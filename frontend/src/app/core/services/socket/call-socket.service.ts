import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Device } from 'mediasoup-client';
import type { Consumer, Producer, Transport } from 'mediasoup-client/types';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { TokenStorage } from '../token-storage/token-storage';
import { CallType, RemotePeer } from '../../../features/calls/models/call.model';

interface ProducerInfo {
  producerId: string;
  userId: string;
  kind: 'audio' | 'video';
}

interface TransportInfo {
  id: string;
  iceParameters: unknown;
  iceCandidates: unknown;
  dtlsParameters: unknown;
}

interface ConsumeInfo {
  id: string;
  producerId: string;
  kind: 'audio' | 'video';
  rtpParameters: unknown;
}

const ACK_TIMEOUT = 10000;

@Injectable({ providedIn: 'root' })
export class CallSocketService {
  private readonly tokenStorage = inject(TokenStorage);
  private readonly authService = inject(AuthService);

  private socket: Socket | null = null;
  private device: Device | null = null;
  private sendTransport: Transport | null = null;
  private recvTransport: Transport | null = null;
  private readonly producers = new Map<'audio' | 'video', Producer>();
  private readonly consumers = new Map<string, Consumer>();
  private readonly streams = new Map<string, MediaStream>();

  private callId: string | null = null;
  private localStream: MediaStream | null = null;

  private readonly peersSubject = new Subject<RemotePeer[]>();
  private readonly peerLeftSubject = new Subject<string>();
  private readonly endedSubject = new Subject<void>();
  private readonly errorSubject = new Subject<string>();

  readonly peers: Observable<RemotePeer[]> = this.peersSubject.asObservable();
  readonly peerLeft: Observable<string> = this.peerLeftSubject.asObservable();
  readonly ended: Observable<void> = this.endedSubject.asObservable();
  readonly errors: Observable<string> = this.errorSubject.asObservable();

  readonly connected = signal(false);
  readonly micEnabled = signal(true);
  readonly cameraEnabled = signal(true);

  constructor() {
    this.authService.registerSessionTeardown(() => void this.leave());
  }

  async join(callId: string, type: CallType): Promise<MediaStream> {
    const token = await this.freshToken();
    if (!token) {
      throw new Error('unauthenticated');
    }

    this.callId = callId;
    this.socket = io(`${environment.socketUrl}/calls`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => this.connected.set(true));
    this.socket.on('disconnect', () => this.connected.set(false));
    this.socket.io.on('reconnect_attempt', () => void this.refreshHandshakeToken());
    this.socket.on('exception', (error: { message?: string }) =>
      this.errorSubject.next(error?.message ?? 'socket'),
    );
    this.socket.on('callEnded', () => this.endedSubject.next());
    this.socket.on('userLeftCall', ({ userId }: { userId: string }) => this.removePeer(userId));
    this.socket.on('newProducer', (info: ProducerInfo) => void this.consume(info));

    await this.waitForConnect();

    const joined = await this.request<{ rtpCapabilities: unknown; producers: ProducerInfo[] }>(
      'joinCallRoom',
      { callId },
      'joinedCallRoom',
    );

    this.device = new Device();
    await this.device.load({ routerRtpCapabilities: joined.rtpCapabilities as never });

    await this.createSendTransport();
    await this.createRecvTransport();

    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === 'video',
    });

    for (const track of this.localStream.getTracks()) {
      const producer = await this.sendTransport!.produce({ track });
      this.producers.set(track.kind as 'audio' | 'video', producer);
    }

    for (const info of joined.producers) {
      await this.consume(info);
    }

    return this.localStream;
  }

  async leave(): Promise<void> {
    if (this.socket && this.callId) {
      this.socket.emit('leaveCallRoom', { callId: this.callId });
    }
    for (const producer of this.producers.values()) {
      producer.close();
    }
    for (const consumer of this.consumers.values()) {
      consumer.close();
    }
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.sendTransport?.close();
    this.recvTransport?.close();

    this.producers.clear();
    this.consumers.clear();
    this.streams.clear();
    this.sendTransport = null;
    this.recvTransport = null;
    this.device = null;
    this.localStream = null;
    this.callId = null;

    this.socket?.disconnect();
    this.socket = null;
    this.connected.set(false);
    this.micEnabled.set(true);
    this.cameraEnabled.set(true);
  }

  endForEveryone(): void {
    if (this.socket && this.callId) {
      this.socket.emit('endCall', { callId: this.callId });
    }
  }

  toggleMic(): void {
    const producer = this.producers.get('audio');
    if (!producer) {
      return;
    }
    if (producer.paused) {
      producer.resume();
      this.micEnabled.set(true);
    } else {
      producer.pause();
      this.micEnabled.set(false);
    }
  }

  toggleCamera(): void {
    const producer = this.producers.get('video');
    if (!producer) {
      return;
    }
    if (producer.paused) {
      producer.resume();
      this.cameraEnabled.set(true);
    } else {
      producer.pause();
      this.cameraEnabled.set(false);
    }
  }

  private async createSendTransport(): Promise<void> {
    const info = await this.request<TransportInfo>('createTransport', {
      callId: this.callId,
      direction: 'send',
    });

    this.sendTransport = this.device!.createSendTransport(info as never);

    this.sendTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
      this.request('connectTransport', { transportId: info.id, dtlsParameters }, 'transportConnected')
        .then(() => callback())
        .catch((error) => errback(error as Error));
    });

    this.sendTransport.on('produce', ({ kind, rtpParameters }, callback, errback) => {
      this.request<{ producerId: string }>('produce', {
        callId: this.callId,
        transportId: info.id,
        kind,
        rtpParameters,
      })
        .then((result) => callback({ id: result.producerId }))
        .catch((error) => errback(error as Error));
    });
  }

  private async createRecvTransport(): Promise<void> {
    const info = await this.request<TransportInfo>('createTransport', {
      callId: this.callId,
      direction: 'recv',
    });

    this.recvTransport = this.device!.createRecvTransport(info as never);

    this.recvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
      this.request('connectTransport', { transportId: info.id, dtlsParameters }, 'transportConnected')
        .then(() => callback())
        .catch((error) => errback(error as Error));
    });
  }

  private async consume(info: ProducerInfo): Promise<void> {
    if (!this.device || !this.recvTransport) {
      return;
    }
    try {
      const params = await this.request<ConsumeInfo>('consume', {
        callId: this.callId,
        producerId: info.producerId,
        rtpCapabilities: this.device.rtpCapabilities,
      });

      const consumer = await this.recvTransport.consume({
        id: params.id,
        producerId: params.producerId,
        kind: params.kind,
        rtpParameters: params.rtpParameters as never,
      });
      this.consumers.set(consumer.id, consumer);

      const stream = this.streams.get(info.userId) ?? new MediaStream();
      stream.addTrack(consumer.track);
      this.streams.set(info.userId, stream);

      await this.request('resumeConsumer', { consumerId: consumer.id }, 'consumerResumed');
      this.emitPeers();
    } catch (error) {
      this.errorSubject.next((error as Error).message);
    }
  }

  private removePeer(userId: string): void {
    const stream = this.streams.get(userId);
    stream?.getTracks().forEach((track) => track.stop());
    this.streams.delete(userId);
    this.peerLeftSubject.next(userId);
    this.emitPeers();
  }

  private emitPeers(): void {
    const peers: RemotePeer[] = [...this.streams.entries()].map(([userId, stream]) => ({
      userId,
      stream,
      hasVideo: stream.getVideoTracks().length > 0,
    }));
    this.peersSubject.next(peers);
  }

  private waitForConnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }
      const timer = setTimeout(() => reject(new Error('connect-timeout')), ACK_TIMEOUT);
      this.socket?.once('connect', () => {
        clearTimeout(timer);
        resolve();
      });
      this.socket?.once('connect_error', (error: Error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
  }

  private request<T>(event: string, payload: unknown, responseEvent?: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const socket = this.socket;
      if (!socket) {
        reject(new Error('no-socket'));
        return;
      }

      let settled = false;
      const finish = (value: T) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        if (responseEvent) {
          socket.off(responseEvent, onEvent);
        }
        resolve(value);
      };

      const onEvent = (data: T) => finish(data);
      const timer = setTimeout(() => {
        if (settled) {
          return;
        }
        settled = true;
        if (responseEvent) {
          socket.off(responseEvent, onEvent);
        }
        reject(new Error(`${event}-timeout`));
      }, ACK_TIMEOUT);

      if (responseEvent) {
        socket.on(responseEvent, onEvent);
      }

      socket.emit(event, payload, (ack: T) => {
        if (ack !== undefined && ack !== null) {
          finish(ack);
        }
      });
    });
  }

  private async refreshHandshakeToken(): Promise<void> {
    const token = await this.freshToken();
    if (token && this.socket) {
      this.socket.auth = { token };
    }
  }

  private async freshToken(): Promise<string | null> {
    const existing = this.tokenStorage.getAccessToken();
    if (existing) {
      return existing;
    }
    if (!this.tokenStorage.hasSession()) {
      return null;
    }
    try {
      return await firstValueFrom(this.authService.refreshAccessToken());
    } catch {
      return null;
    }
  }
}

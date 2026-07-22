import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { TokenStorage } from '../token-storage/token-storage';
import { CallEndedEvent, IncomingCall } from '../../../features/calls/models/call.model';

@Injectable({ providedIn: 'root' })
export class NotificationSocketService {
  private readonly tokenStorage = inject(TokenStorage);
  private readonly authService = inject(AuthService);

  private socket: Socket | null = null;

  private readonly incomingCallSubject = new Subject<IncomingCall>();
  private readonly callEndedSubject = new Subject<CallEndedEvent>();

  readonly incomingCall: Observable<IncomingCall> = this.incomingCallSubject.asObservable();
  readonly callEnded: Observable<CallEndedEvent> = this.callEndedSubject.asObservable();

  readonly connected = signal(false);

  constructor() {
    this.authService.registerSessionTeardown(() => this.disconnect());
  }

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }
    const token = await this.freshToken();
    if (!token) {
      return;
    }

    this.socket?.disconnect();
    this.socket = io(`${environment.socketUrl}/notifications`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => this.connected.set(true));
    this.socket.on('disconnect', () => this.connected.set(false));
    this.socket.io.on('reconnect_attempt', () => void this.refreshHandshakeToken());

    this.socket.on('incomingCall', (payload: IncomingCall) =>
      this.incomingCallSubject.next(payload),
    );
    this.socket.on('callEnded', (payload: CallEndedEvent) => this.callEndedSubject.next(payload));
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.connected.set(false);
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

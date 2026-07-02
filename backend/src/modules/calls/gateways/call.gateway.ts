import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CallsService } from '../calls.service';
import { WebRTCService } from '../webrtc.service';
import { WsJwtGuard } from '@/common/guards/ws-jwt.guard';
import { WsExceptionFilter } from '@/common/filters/ws-exception.filter';
import { wsCorsOrigin } from '@/common/utils/ws-cors';

@UseFilters(new WsExceptionFilter())
@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'calls', cors: { origin: wsCorsOrigin() } })
export class CallGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private callsService: CallsService,
    private webrtcService: WebRTCService,
  ) {}

  async handleDisconnect(client: Socket) {
    const userId = client.data?.user?.sub;
    const callId = client.data?.callId;
    if (!userId || !callId) return;

    await this.webrtcService.closePeer(callId, userId);
    client.to(`call:${callId}`).emit('userLeftCall', { userId });
  }

  @SubscribeMessage('joinCallRoom')
  async handleJoinCallRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string },
  ) {
    const isParticipant = await this.callsService.isParticipant(data.callId, client.data.user.sub);
    if (!isParticipant) throw new WsException("Bu qo'ng'iroqqa qo'shilmagansiz");

    client.join(`call:${data.callId}`);
    client.data.callId = data.callId;

    const rtpCapabilities = await this.webrtcService.getRouterCapabilities(data.callId);
    const producers = await this.webrtcService.getProducers(data.callId, client.data.user.sub);
    client.to(`call:${data.callId}`).emit('userJoinedCall', { userId: client.data.user.sub });

    return { event: 'joinedCallRoom', data: { rtpCapabilities, producers } };
  }

  @SubscribeMessage('leaveCallRoom')
  async handleLeaveCallRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string },
  ) {
    client.leave(`call:${data.callId}`);
    client.data.callId = undefined;
    await this.webrtcService.closePeer(data.callId, client.data.user.sub);
    client.to(`call:${data.callId}`).emit('userLeftCall', { userId: client.data.user.sub });
  }

  @SubscribeMessage('createTransport')
  async handleCreateTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; direction: 'send' | 'recv' },
  ) {
    return this.webrtcService.createTransport(data.callId, client.data.user.sub, data.direction);
  }

  @SubscribeMessage('connectTransport')
  async handleConnectTransport(@MessageBody() data: { transportId: string; dtlsParameters: any }) {
    await this.webrtcService.connectTransport(data.transportId, data.dtlsParameters);
    return { event: 'transportConnected' };
  }

  @SubscribeMessage('produce')
  async handleProduce(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { callId: string; transportId: string; kind: 'audio' | 'video'; rtpParameters: any },
  ) {
    const result = await this.webrtcService.produce(
      data.transportId,
      data.kind,
      data.rtpParameters,
    );
    client.to(`call:${data.callId}`).emit('newProducer', {
      producerId: result.producerId,
      userId: client.data.user.sub,
      kind: data.kind,
    });
    return result;
  }

  @SubscribeMessage('getProducers')
  async handleGetProducers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string },
  ) {
    return this.webrtcService.getProducers(data.callId, client.data.user.sub);
  }

  @SubscribeMessage('consume')
  async handleConsume(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; producerId: string; rtpCapabilities: any },
  ) {
    return this.webrtcService.consume(
      data.callId,
      client.data.user.sub,
      data.producerId,
      data.rtpCapabilities,
    );
  }

  @SubscribeMessage('resumeConsumer')
  async handleResumeConsumer(@MessageBody() data: { consumerId: string }) {
    await this.webrtcService.resumeConsumer(data.consumerId);
    return { event: 'consumerResumed' };
  }

  @SubscribeMessage('endCall')
  async handleEndCall(@ConnectedSocket() client: Socket, @MessageBody() data: { callId: string }) {
    await this.callsService.end(data.callId, client.data.user.sub);
    this.server.to(`call:${data.callId}`).emit('callEnded', { callId: data.callId });
  }
}

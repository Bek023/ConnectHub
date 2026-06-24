import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CallsService } from '../calls.service';
import { WebRTCService } from '../webrtc.service';
import { WsJwtGuard } from '@/common/guards/ws-jwt.guard';
import { WsExceptionFilter } from '@/common/filters/ws-exception.filter';

@UseFilters(new WsExceptionFilter())
@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'calls', cors: { origin: '*' } })
export class CallGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private callsService: CallsService,
    private webrtcService: WebRTCService,
  ) {}

  @SubscribeMessage('joinCallRoom')
  async handleJoinCallRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { callId: string }) {
    client.join(`call:${data.callId}`);
    const capabilities = await this.webrtcService.getRouterCapabilities(data.callId);
    client.to(`call:${data.callId}`).emit('userJoinedCall', { userId: client.data.user.sub });
    return { event: 'joinedCallRoom', data: capabilities };
  }

  @SubscribeMessage('leaveCallRoom')
  async handleLeaveCallRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { callId: string }) {
    client.leave(`call:${data.callId}`);
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
    @MessageBody() data: { callId: string; transportId: string; kind: string; rtpParameters: any },
  ) {
    const result = await this.webrtcService.produce(data.transportId, data.kind, data.rtpParameters);
    client.to(`call:${data.callId}`).emit('newProducer', { ...result, userId: client.data.user.sub });
    return result;
  }

  @SubscribeMessage('endCall')
  async handleEndCall(@ConnectedSocket() client: Socket, @MessageBody() data: { callId: string }) {
    await this.callsService.end(data.callId, client.data.user.sub);
    await this.webrtcService.closeRoom(data.callId);
    this.server.to(`call:${data.callId}`).emit('callEnded', { callId: data.callId });
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { MessagesService } from '../messages.service';
import { WsJwtGuard } from '@/common/guards/ws-jwt.guard';
import { WsExceptionFilter } from '@/common/filters/ws-exception.filter';
import { RedisService } from '@/config/redis.config';

// TZ'dagi bug-fix: avvalgi versiyada `usersRepo` constructor'da inject qilinmagan edi,
// shu sabab onlayn/oxirgi faollik holatini saqlash imkonsiz edi. Endi @InjectRepository
// orqali to'g'ri inject qilingan.
@UseFilters(new WsExceptionFilter())
@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private messagesService: MessagesService,
    private jwtService: JwtService,
    private config: ConfigService,
    private redisService: RedisService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) throw new Error('Token topilmadi');
      const payload = this.jwtService.verify(token, { secret: this.config.get('JWT_SECRET') });
      client.data.user = payload;

      await this.usersRepo.update(payload.sub, { lastSeen: new Date() });
      await this.redisService.sadd('online_users', payload.sub);
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data?.user?.sub;
    if (userId) {
      await this.redisService.srem('online_users', userId);
      await this.usersRepo.update(userId, { lastSeen: new Date() });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinChat')
  handleJoinChat(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string }) {
    client.join(`chat:${data.chatId}`);
    return { event: 'joinedChat', data: { chatId: data.chatId } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveChat')
  handleLeaveChat(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string }) {
    client.leave(`chat:${data.chatId}`);
    return { event: 'leftChat', data: { chatId: data.chatId } };
  }

  @UseGuards(WsJwtGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatType: string; chatId: string; content: string; type?: string; mediaUrl?: string },
  ) {
    const userId = client.data.user.sub;
    const message = await this.messagesService.create({
      ...data,
      senderId: userId,
    } as any);
    this.server.to(`chat:${data.chatId}`).emit('newMessage', message);
    return { event: 'messageSent', data: message };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string }) {
    const userId = client.data.user.sub;
    client.to(`chat:${data.chatId}`).emit('userTyping', { userId, chatId: data.chatId });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('reactToMessage')
  async handleReact(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; emoji: string },
  ) {
    const userId = client.data.user.sub;
    const result = await this.messagesService.react(data.messageId, userId, data.emoji);
    this.server.to(`chat:${result.chatId}`).emit('messageReaction', result);
    return { event: 'reacted', data: result };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('markRead')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    const userId = client.data.user.sub;
    const result = await this.messagesService.markRead(data.messageId, userId);
    return { event: 'messageRead', data: result };
  }
}

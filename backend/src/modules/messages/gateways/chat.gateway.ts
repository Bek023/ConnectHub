import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from '@/modules/users/entities/user.entity';
import { MessagesService } from '../messages.service';
import { ChatMembershipService } from '../chat-membership.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { WsJwtGuard } from '@/common/guards/ws-jwt.guard';
import { WsExceptionFilter } from '@/common/filters/ws-exception.filter';
import { RedisService } from '@/config/redis.config';
import { wsCorsOrigin } from '@/common/utils/ws-cors';

const ONLINE_COUNTS_KEY = 'online_counts';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({ namespace: 'chat', cors: { origin: wsCorsOrigin() } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private messagesService: MessagesService,
    private membership: ChatMembershipService,
    private jwtService: JwtService,
    private config: ConfigService,
    private redisService: RedisService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) throw new Error('Token topilmadi');
      const payload = this.jwtService.verify(token, { secret: this.config.get('JWT_SECRET') });

      const blacklisted = await this.redisService.exists(
        `blacklist:${payload.sub}:${payload.iat}`,
      );
      if (blacklisted) throw new Error('Token bekor qilingan');

      client.data.user = payload;

      await this.usersRepo.update(payload.sub, { lastSeen: new Date() });
      const connections = await this.redisService.hincrby(ONLINE_COUNTS_KEY, payload.sub, 1);
      if (connections === 1) {
        await this.redisService.sadd('online_users', payload.sub);
      }
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data?.user?.sub;
    if (userId) {
      const connections = await this.redisService.hincrby(ONLINE_COUNTS_KEY, userId, -1);
      if (connections <= 0) {
        await this.redisService.hdel(ONLINE_COUNTS_KEY, userId);
        await this.redisService.srem('online_users', userId);
      }
      await this.usersRepo.update(userId, { lastSeen: new Date() });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    const userId = client.data.user.sub;
    const isMember = await this.membership.isMemberAnyType(data.chatId, userId);
    if (!isMember) throw new WsException("Bu chatga kirish huquqingiz yo'q");

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
  async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: unknown) {
    const dto = plainToInstance(SendMessageDto, data);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length) {
      throw new WsException(errors.map((e) => Object.values(e.constraints ?? {})).flat());
    }

    const userId = client.data.user.sub;
    const message = await this.messagesService.create({ ...dto, senderId: userId });
    this.server.to(`chat:${dto.chatId}`).emit('newMessage', message);
    return { event: 'messageSent', data: message };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string }) {
    if (!client.rooms.has(`chat:${data.chatId}`)) return;
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
    client.to(`chat:${result.chatId}`).emit('messageRead', result);
    return { event: 'messageRead', data: result };
  }
}

import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/config/redis.config';
import { wsCorsOrigin } from '@/common/utils/ws-cors';

@WebSocketGateway({ namespace: 'notifications', cors: { origin: wsCorsOrigin() } })
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private redis: RedisService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      const payload = this.jwtService.verify(token, { secret: this.config.get('JWT_SECRET') });

      const blacklisted = await this.redis.exists(`blacklist:${payload.sub}:${payload.iat}`);
      if (blacklisted) throw new Error('Token bekor qilingan');

      client.data.user = payload;
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  notifyUser(userId: string, event: string, data: object) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}

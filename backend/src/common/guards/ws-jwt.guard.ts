import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/config/redis.config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    if (client.data?.user) return true;

    const token = client.handshake?.auth?.token;
    if (!token) throw new UnauthorizedException('Token topilmadi');

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Token yaroqsiz');
    }

    const blacklisted = await this.redis.exists(`blacklist:${payload.sub}:${payload.iat}`);
    if (blacklisted) throw new UnauthorizedException('Token bekor qilingan');

    client.data.user = payload;
    return true;
  }
}

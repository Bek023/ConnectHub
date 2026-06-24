import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    if (client.data?.user) return true;

    const token = client.handshake?.auth?.token;
    if (!token) throw new UnauthorizedException('Token topilmadi');

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      client.data.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token yaroqsiz');
    }
  }
}

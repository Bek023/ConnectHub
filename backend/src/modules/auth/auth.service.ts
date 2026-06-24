import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '@/modules/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '@/modules/mail/mail.service';
import { RedisService } from '@/config/redis.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailService: MailService,
    private redis: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });
    if (exists) {
      throw new ConflictException('Email yoki username band');
    }

    const user = this.userRepo.create({
      ...dto,
      passwordHash: dto.password, // @BeforeInsert da hash bo'ladi
    });
    await this.userRepo.save(user);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redis.setex(`email_verify:${user.id}`, 600, code);
    await this.mailService.sendVerificationEmail(user.email, code);

    return { message: 'Tasdiqlash kodi emailga yuborildi', userId: user.id };
  }

  async verifyEmail(userId: string, code: string) {
    const stored = await this.redis.get(`email_verify:${userId}`);
    if (!stored || stored !== code) {
      throw new BadRequestException("Kod noto'g'ri yoki muddati tugagan");
    }
    await this.userRepo.update(userId, { isVerified: true });
    await this.redis.del(`email_verify:${userId}`);
    return { message: 'Email tasdiqlandi' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'passwordHash', 'isVerified', 'isActive', 'displayName'],
    });

    if (!user || !(await user.verifyPassword(dto.password))) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Email tasdiqlanmagan');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'refreshToken'],
    });

    if (!user?.refreshToken) throw new UnauthorizedException();

    const isMatch = await argon2.verify(user.refreshToken, refreshToken);
    if (!isMatch) throw new UnauthorizedException("Refresh token yaroqsiz");

    return this.generateTokens(user);
  }

  async logout(userId: string) {
    await this.userRepo.update(userId, { refreshToken: undefined });
  }

  async googleLogin(googleUser: { googleId: string; email: string; displayName: string }) {
    let user = await this.userRepo.findOne({ where: { googleId: googleUser.googleId } });

    if (!user) {
      user = await this.userRepo.findOne({ where: { email: googleUser.email } });
      if (user) {
        await this.userRepo.update(user.id, { googleId: googleUser.googleId, isVerified: true });
        user.googleId = googleUser.googleId;
      } else {
        const base = googleUser.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
        const username = `${base}_${Date.now()}`.slice(0, 50);
        const newUser = this.userRepo.create({
          googleId: googleUser.googleId,
          email: googleUser.email,
          displayName: googleUser.displayName,
          username,
          passwordHash: await argon2.hash(Math.random().toString(36)),
          isVerified: true,
        });
        user = await this.userRepo.save(newUser);
      }
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    const hashedRefresh = await argon2.hash(refreshToken);
    await this.userRepo.update(user.id, { refreshToken: hashedRefresh });

    return { accessToken, refreshToken, userId: user.id };
  }
}

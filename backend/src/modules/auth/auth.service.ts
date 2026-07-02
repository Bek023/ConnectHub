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
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
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
    if (exists) throw new ConflictException('Email yoki username band');

    const user = this.userRepo.create({ ...dto, passwordHash: dto.password });
    try {
      await this.userRepo.save(user);
    } catch (e: any) {
      if (e?.code === '23505') throw new ConflictException('Email yoki username band');
      throw e;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redis.setex(`email_verify:${user.id}`, 600, code);
    await this.mailService.sendVerificationEmail(user.email, code);

    return { message: 'Tasdiqlash kodi emailga yuborildi', userId: user.id };
  }

  async verifyEmail(userId: string, code: string) {
    await this.checkCodeAttempts(`email_verify_attempts:${userId}`);
    const stored = await this.redis.get(`email_verify:${userId}`);
    if (!stored || stored !== code) {
      throw new BadRequestException("Kod noto'g'ri yoki muddati tugagan");
    }
    await this.userRepo.update(userId, { isVerified: true });
    await this.redis.del(`email_verify:${userId}`);
    await this.redis.del(`email_verify_attempts:${userId}`);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) await this.mailService.sendWelcomeEmail(user.email, user.displayName);

    return { message: 'Email tasdiqlandi' };
  }

  async resendVerificationCode(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Foydalanuvchi topilmadi');
    if (user.isVerified) throw new BadRequestException('Email allaqachon tasdiqlangan');

    const cooldownKey = `email_verify_cooldown:${userId}`;
    const onCooldown = await this.redis.get(cooldownKey);
    if (onCooldown) throw new BadRequestException('Iltimos, 60 soniya kuting');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redis.setex(`email_verify:${userId}`, 600, code);
    await this.redis.setex(cooldownKey, 60, '1');
    await this.mailService.sendVerificationEmail(user.email, code);

    return { message: 'Yangi tasdiqlash kodi emailga yuborildi' };
  }

  async login(dto: LoginDto, ip?: string) {
    const failKey = `login_fail:${ip ?? 'unknown'}:${dto.email}`;
    const fails = await this.redis.get(failKey);
    if (fails && parseInt(fails) >= 5) {
      throw new UnauthorizedException("Juda ko'p urinish. 15 daqiqadan so'ng qayta urinib ko'ring");
    }

    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: [
        'id',
        'email',
        'passwordHash',
        'isVerified',
        'isActive',
        'displayName',
        'twoFaEnabled',
        'twoFaSecret',
      ],
    });

    if (!user || !(await user.verifyPassword(dto.password))) {
      const count = await this.redis.incr(failKey);
      if (count === 1) await this.redis.expire(failKey, 900);
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    if (!user.isVerified) throw new UnauthorizedException('Email tasdiqlanmagan');

    await this.redis.del(failKey);

    if (user.twoFaEnabled) {
      const twoFaToken = uuidv4();
      await this.redis.setex(`2fa_pending:${twoFaToken}`, 300, user.id);
      return { requires2FA: true, twoFaToken };
    }

    const tokens = await this.generateTokens(user);
    return { ...tokens, user: this.serializeUser(user) };
  }

  async verifyTwoFaLogin(twoFaToken: string, totpCode: string) {
    const attemptsKey = `2fa_attempts:${twoFaToken}`;
    const attempts = await this.redis.incr(attemptsKey);
    if (attempts === 1) await this.redis.expire(attemptsKey, 300);
    if (attempts > 5) {
      await this.redis.del(`2fa_pending:${twoFaToken}`);
      throw new UnauthorizedException("Juda ko'p urinish. Qaytadan login qiling");
    }

    const userId = await this.redis.get(`2fa_pending:${twoFaToken}`);
    if (!userId) throw new UnauthorizedException('Token yaroqsiz yoki muddati tugagan');

    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'twoFaSecret'],
    });
    if (!user?.twoFaSecret) throw new UnauthorizedException();

    const verified = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: 'base32',
      token: totpCode,
      window: 1,
    });
    if (!verified) throw new UnauthorizedException("2FA kod noto'g'ri");

    await this.redis.del(`2fa_pending:${twoFaToken}`);
    await this.redis.del(attemptsKey);
    const fullUser = await this.userRepo.findOne({ where: { id: user.id } });
    const tokens = await this.generateTokens(user);
    return { ...tokens, user: fullUser ? this.serializeUser(fullUser) : undefined };
  }

  async setupTwoFa(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Foydalanuvchi topilmadi');
    const secret = speakeasy.generateSecret({
      name: `ConnectHub (${user.email})`,
      length: 20,
    });
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url ?? '');
    return { secret: secret.base32, qrCodeUrl };
  }

  async enableTwoFa(userId: string, secret: string, totpCode: string) {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: totpCode,
      window: 1,
    });
    if (!verified) throw new BadRequestException("Kod noto'g'ri");

    await this.userRepo.update(userId, { twoFaSecret: secret, twoFaEnabled: true });
    return { message: '2FA yoqildi' };
  }

  async disableTwoFa(userId: string, totpCode: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'twoFaSecret', 'twoFaEnabled'],
    });
    if (!user?.twoFaEnabled || !user.twoFaSecret) {
      throw new BadRequestException("2FA allaqachon o'chirilgan");
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: 'base32',
      token: totpCode,
      window: 1,
    });
    if (!verified) throw new BadRequestException("Kod noto'g'ri");

    await this.userRepo.update(userId, { twoFaSecret: null, twoFaEnabled: false });
    return { message: "2FA o'chirildi" };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'passwordHash'],
    });
    if (!user) throw new BadRequestException('Foydalanuvchi topilmadi');

    const isMatch = await argon2.verify(user.passwordHash, currentPassword);
    if (!isMatch) throw new BadRequestException("Joriy parol noto'g'ri");

    const passwordHash = await argon2.hash(newPassword);
    await this.userRepo.update(userId, { passwordHash, refreshToken: null });
    return { message: 'Parol muvaffaqiyatli yangilandi' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !user.isActive) return { message: "Agar email mavjud bo'lsa, kod yuboriladi" };

    const cooldownKey = `pwd_reset_cooldown:${email}`;
    const onCooldown = await this.redis.get(cooldownKey);
    if (onCooldown) throw new BadRequestException('Iltimos, 60 soniya kuting');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redis.setex(`pwd_reset:${email}`, 600, code);
    await this.redis.setex(cooldownKey, 60, '1');
    await this.mailService.sendPasswordResetCode(email, code);

    return { message: "Agar email mavjud bo'lsa, kod yuboriladi" };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    await this.checkCodeAttempts(`pwd_reset_attempts:${email}`);
    const stored = await this.redis.get(`pwd_reset:${email}`);
    if (!stored || stored !== code) {
      throw new BadRequestException("Kod noto'g'ri yoki muddati tugagan");
    }

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Foydalanuvchi topilmadi');

    const passwordHash = await argon2.hash(newPassword);
    await this.userRepo.update(user.id, { passwordHash, refreshToken: null });
    await this.redis.del(`pwd_reset:${email}`);
    await this.redis.del(`pwd_reset_attempts:${email}`);

    return { message: 'Parol muvaffaqiyatli yangilandi' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'refreshToken'],
    });

    if (!user?.refreshToken) throw new UnauthorizedException();

    const isMatch = await argon2.verify(user.refreshToken, refreshToken);
    if (!isMatch) throw new UnauthorizedException('Refresh token yaroqsiz');

    return this.generateTokens(user);
  }

  async logout(userId: string, token?: string) {
    if (token) {
      const decoded = this.jwtService.decode(token) as { sub: string; iat: number; exp: number };
      if (decoded?.exp && decoded?.iat) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await this.redis.setex(`blacklist:${decoded.sub}:${decoded.iat}`, ttl, '1');
        }
      }
    }
    await this.userRepo.update(userId, { refreshToken: null });
  }

  private async checkCodeAttempts(key: string) {
    const attempts = await this.redis.incr(key);
    if (attempts === 1) await this.redis.expire(key, 600);
    if (attempts > 5) {
      throw new BadRequestException("Juda ko'p urinish. Keyinroq qayta urinib ko'ring");
    }
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

    const tokens = await this.generateTokens(user);
    return { ...tokens, user: this.serializeUser(user) };
  }

  private serializeUser(user: User) {
    const { passwordHash, refreshToken, twoFaSecret, ...safe } = user as any;
    return safe;
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

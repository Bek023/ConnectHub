import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { User } from '@/modules/users/entities/user.entity';
import { MailService } from '@/modules/mail/mail.service';
import { RedisService } from '@/config/redis.config';

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_value'),
  verify: jest.fn(),
}));

jest.mock('speakeasy', () => ({
  generateSecret: jest.fn().mockReturnValue({ base32: 'BASE32SECRET', otpauth_url: 'otpauth://...' }),
  totp: { verify: jest.fn() },
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,QRCODE'),
}));

jest.mock('uuid', () => ({ v4: jest.fn().mockReturnValue('mock-uuid') }));

const mockUser = (): User =>
  ({
    id: 'user-uuid-1',
    username: 'john_doe',
    email: 'john@example.com',
    displayName: 'John Doe',
    passwordHash: 'hashed_password',
    isVerified: true,
    isActive: true,
    twoFaEnabled: false,
    twoFaSecret: null,
    refreshToken: null,
    verifyPassword: jest.fn(),
  }) as unknown as User;

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Repository<User>>;
  let mailService: jest.Mocked<MailService>;
  let redis: jest.Mocked<RedisService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('signed_token'),
            decode: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock_value') },
        },
        {
          provide: MailService,
          useValue: {
            sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
            sendPasswordResetCode: jest.fn().mockResolvedValue(undefined),
            sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            setex: jest.fn().mockResolvedValue('OK'),
            del: jest.fn().mockResolvedValue(1),
            exists: jest.fn().mockResolvedValue(0),
            incr: jest.fn().mockResolvedValue(1),
            expire: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    mailService = module.get(MailService);
    redis = module.get(RedisService);
    jwtService = module.get(JwtService);
  });

  // ─── register ───────────────────────────────────────────────────────────────

  describe('register', () => {
    it('throws ConflictException when email or username is taken', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      await expect(
        service.register({ email: 'john@example.com', username: 'john', password: 'Pass1234!', displayName: 'John' }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates user and sends verification email', async () => {
      const user = mockUser();
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue(user);
      userRepo.save.mockResolvedValue(user);

      const result = await service.register({ email: 'john@example.com', username: 'john_doe', password: 'Pass1234!', displayName: 'John Doe' });

      expect(userRepo.save).toHaveBeenCalled();
      expect(redis.setex).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(user.email, expect.any(String));
      expect(result).toHaveProperty('userId');
    });
  });

  // ─── verifyEmail ─────────────────────────────────────────────────────────────

  describe('verifyEmail', () => {
    it('throws BadRequestException when code is wrong', async () => {
      redis.get.mockResolvedValue('111111');
      await expect(service.verifyEmail('user-uuid-1', '999999')).rejects.toThrow(BadRequestException);
    });

    it('verifies email and sends welcome email', async () => {
      redis.get.mockResolvedValue('123456');
      userRepo.update.mockResolvedValue({ affected: 1 } as any);
      userRepo.findOne.mockResolvedValue(mockUser());

      const result = await service.verifyEmail('user-uuid-1', '123456');

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', { isVerified: true });
      expect(redis.del).toHaveBeenCalled();
      expect(mailService.sendWelcomeEmail).toHaveBeenCalledWith(mockUser().email, mockUser().displayName);
      expect(result).toHaveProperty('message');
    });
  });

  // ─── login ───────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('throws UnauthorizedException when too many failed attempts', async () => {
      redis.get.mockResolvedValue('5');
      await expect(service.login({ email: 'x@x.com', password: 'Pass1234!' })).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user not found', async () => {
      redis.get.mockResolvedValue(null);
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.login({ email: 'x@x.com', password: 'Pass1234!' })).rejects.toThrow(UnauthorizedException);
    });

    it('increments fail counter on wrong password', async () => {
      redis.get.mockResolvedValue(null);
      const user = mockUser();
      (user.verifyPassword as jest.Mock).mockResolvedValue(false);
      userRepo.findOne.mockResolvedValue(user);

      await expect(service.login({ email: user.email, password: 'WrongPass!' })).rejects.toThrow(UnauthorizedException);
      expect(redis.incr).toHaveBeenCalledWith(`login_fail:unknown:${user.email}`);
    });

    it('throws UnauthorizedException when email not verified', async () => {
      redis.get.mockResolvedValue(null);
      const user = { ...mockUser(), isVerified: false } as unknown as User;
      (user.verifyPassword as jest.Mock).mockResolvedValue(true);
      userRepo.findOne.mockResolvedValue(user);
      await expect(service.login({ email: user.email, password: 'Pass1234!' })).rejects.toThrow(UnauthorizedException);
    });

    it('returns twoFaToken when 2FA is enabled', async () => {
      redis.get.mockResolvedValue(null);
      const user = { ...mockUser(), twoFaEnabled: true } as unknown as User;
      (user.verifyPassword as jest.Mock).mockResolvedValue(true);
      userRepo.findOne.mockResolvedValue(user);

      const result = await service.login({ email: user.email, password: 'Pass1234!' });

      expect(result).toEqual({ requires2FA: true, twoFaToken: 'mock-uuid' });
      expect(redis.setex).toHaveBeenCalledWith('2fa_pending:mock-uuid', 300, user.id);
    });

    it('returns tokens on successful login without 2FA', async () => {
      redis.get.mockResolvedValue(null);
      const user = mockUser();
      (user.verifyPassword as jest.Mock).mockResolvedValue(true);
      userRepo.findOne.mockResolvedValue(user);
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.login({ email: user.email, password: 'Pass1234!' });

      expect(redis.del).toHaveBeenCalledWith(`login_fail:unknown:${user.email}`);
      expect(result).toHaveProperty('accessToken');
    });
  });

  // ─── 2FA ─────────────────────────────────────────────────────────────────────

  describe('setupTwoFa', () => {
    it('returns secret and qrCodeUrl', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      const result = await service.setupTwoFa('user-uuid-1');
      expect(result).toHaveProperty('secret', 'BASE32SECRET');
      expect(result).toHaveProperty('qrCodeUrl');
    });
  });

  describe('enableTwoFa', () => {
    it('throws BadRequestException when TOTP code is wrong', async () => {
      const speakeasy = require('speakeasy');
      speakeasy.totp.verify.mockReturnValue(false);
      await expect(service.enableTwoFa('user-uuid-1', 'SECRET', '000000')).rejects.toThrow(BadRequestException);
    });

    it('enables 2FA when code is correct', async () => {
      const speakeasy = require('speakeasy');
      speakeasy.totp.verify.mockReturnValue(true);
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.enableTwoFa('user-uuid-1', 'BASE32SECRET', '123456');
      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', { twoFaSecret: 'BASE32SECRET', twoFaEnabled: true });
      expect(result).toHaveProperty('message');
    });
  });

  describe('disableTwoFa', () => {
    it('throws BadRequestException when 2FA already disabled', async () => {
      userRepo.findOne.mockResolvedValue({ ...mockUser(), twoFaEnabled: false } as unknown as User);
      await expect(service.disableTwoFa('user-uuid-1', '123456')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when code is wrong', async () => {
      const speakeasy = require('speakeasy');
      speakeasy.totp.verify.mockReturnValue(false);
      userRepo.findOne.mockResolvedValue({ ...mockUser(), twoFaEnabled: true, twoFaSecret: 'SECRET' } as unknown as User);
      await expect(service.disableTwoFa('user-uuid-1', '000000')).rejects.toThrow(BadRequestException);
    });

    it('disables 2FA when code is correct', async () => {
      const speakeasy = require('speakeasy');
      speakeasy.totp.verify.mockReturnValue(true);
      userRepo.findOne.mockResolvedValue({ ...mockUser(), twoFaEnabled: true, twoFaSecret: 'SECRET' } as unknown as User);
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.disableTwoFa('user-uuid-1', '123456');
      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', { twoFaSecret: null, twoFaEnabled: false });
      expect(result).toHaveProperty('message');
    });
  });

  describe('verifyTwoFaLogin', () => {
    it('throws UnauthorizedException when twoFaToken expired', async () => {
      redis.get.mockResolvedValue(null);
      await expect(service.verifyTwoFaLogin('bad-token', '123456')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when TOTP code is wrong', async () => {
      const speakeasy = require('speakeasy');
      speakeasy.totp.verify.mockReturnValue(false);
      redis.get.mockResolvedValue('user-uuid-1');
      userRepo.findOne.mockResolvedValue({ ...mockUser(), twoFaSecret: 'SECRET' } as unknown as User);
      await expect(service.verifyTwoFaLogin('valid-token', '000000')).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens when both token and TOTP are valid', async () => {
      const speakeasy = require('speakeasy');
      speakeasy.totp.verify.mockReturnValue(true);
      redis.get.mockResolvedValue('user-uuid-1');
      userRepo.findOne.mockResolvedValue({ ...mockUser(), twoFaSecret: 'SECRET' } as unknown as User);
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.verifyTwoFaLogin('valid-token', '123456');
      expect(redis.del).toHaveBeenCalledWith('2fa_pending:valid-token');
      expect(result).toHaveProperty('accessToken');
    });
  });

  // ─── changePassword ──────────────────────────────────────────────────────────

  describe('changePassword', () => {
    it('throws BadRequestException when current password is wrong', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      (argon2.verify as jest.Mock).mockResolvedValue(false);
      await expect(service.changePassword('user-uuid-1', 'WrongPass!', 'NewPass1!')).rejects.toThrow(BadRequestException);
    });

    it('updates password when current password is correct', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.changePassword('user-uuid-1', 'CorrectPass1!', 'NewPass1!');
      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', {
        passwordHash: 'hashed_value',
        refreshToken: null,
      });
      expect(result).toHaveProperty('message');
    });
  });

  // ─── forgotPassword ──────────────────────────────────────────────────────────

  describe('forgotPassword', () => {
    it('returns generic message when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const result = await service.forgotPassword('unknown@example.com');
      expect(mailService.sendPasswordResetCode).not.toHaveBeenCalled();
      expect(result).toHaveProperty('message');
    });

    it('returns generic message when user is inactive', async () => {
      userRepo.findOne.mockResolvedValue({ ...mockUser(), isActive: false } as unknown as User);
      const result = await service.forgotPassword('john@example.com');
      expect(mailService.sendPasswordResetCode).not.toHaveBeenCalled();
      expect(result).toHaveProperty('message');
    });

    it('throws BadRequestException when cooldown is active', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      redis.get.mockResolvedValue('1');
      await expect(service.forgotPassword('john@example.com')).rejects.toThrow(BadRequestException);
    });

    it('sends reset code when user exists, active, and no cooldown', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      redis.get.mockResolvedValue(null);

      const result = await service.forgotPassword('john@example.com');
      expect(mailService.sendPasswordResetCode).toHaveBeenCalledWith('john@example.com', expect.any(String));
      expect(result).toHaveProperty('message');
    });
  });

  // ─── resetPassword ───────────────────────────────────────────────────────────

  describe('resetPassword', () => {
    it('throws BadRequestException when code is wrong', async () => {
      redis.get.mockResolvedValue('111111');
      await expect(service.resetPassword('john@example.com', '999999', 'NewPass1!')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when code is expired', async () => {
      redis.get.mockResolvedValue(null);
      await expect(service.resetPassword('john@example.com', '123456', 'NewPass1!')).rejects.toThrow(BadRequestException);
    });

    it('updates password and deletes reset key on success', async () => {
      redis.get.mockResolvedValue('123456');
      userRepo.findOne.mockResolvedValue(mockUser());
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.resetPassword('john@example.com', '123456', 'NewPass1!');
      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', {
        passwordHash: 'hashed_value',
        refreshToken: null,
      });
      expect(redis.del).toHaveBeenCalledWith('pwd_reset:john@example.com');
      expect(result).toHaveProperty('message');
    });
  });

  // ─── logout ──────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('clears refresh token', async () => {
      userRepo.update.mockResolvedValue({ affected: 1 } as any);
      await service.logout('user-uuid-1');
      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', { refreshToken: null });
    });

    it('blacklists access token on logout', async () => {
      userRepo.update.mockResolvedValue({ affected: 1 } as any);
      jwtService.decode.mockReturnValue({ sub: 'user-uuid-1', iat: 1000, exp: Math.floor(Date.now() / 1000) + 900 });

      await service.logout('user-uuid-1', 'some.jwt.token');
      expect(redis.setex).toHaveBeenCalledWith('blacklist:user-uuid-1:1000', expect.any(Number), '1');
    });
  });

  // ─── resendVerificationCode ──────────────────────────────────────────────────

  describe('resendVerificationCode', () => {
    it('throws BadRequestException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.resendVerificationCode('user-uuid-1')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when user is already verified', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      await expect(service.resendVerificationCode('user-uuid-1')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when cooldown is active', async () => {
      const user = { ...mockUser(), isVerified: false } as unknown as User;
      userRepo.findOne.mockResolvedValue(user);
      redis.get.mockResolvedValue('1');
      await expect(service.resendVerificationCode('user-uuid-1')).rejects.toThrow(BadRequestException);
    });

    it('sends new code when user is unverified and no cooldown', async () => {
      const user = { ...mockUser(), isVerified: false } as unknown as User;
      userRepo.findOne.mockResolvedValue(user);
      redis.get.mockResolvedValue(null);

      const result = await service.resendVerificationCode('user-uuid-1');
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(user.email, expect.any(String));
      expect(result).toHaveProperty('message');
    });
  });

  // ─── refreshTokens ───────────────────────────────────────────────────────────

  describe('refreshTokens', () => {
    it('throws UnauthorizedException when user has no stored refresh token', async () => {
      userRepo.findOne.mockResolvedValue({ ...mockUser(), refreshToken: null } as unknown as User);
      await expect(service.refreshTokens('user-uuid-1', 'some_token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when refresh token does not match', async () => {
      userRepo.findOne.mockResolvedValue({ ...mockUser(), refreshToken: 'hashed' } as unknown as User);
      (argon2.verify as jest.Mock).mockResolvedValue(false);
      await expect(service.refreshTokens('user-uuid-1', 'wrong_token')).rejects.toThrow(UnauthorizedException);
    });

    it('returns new tokens when refresh token is valid', async () => {
      userRepo.findOne.mockResolvedValue({ ...mockUser(), refreshToken: 'hashed' } as unknown as User);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.refreshTokens('user-uuid-1', 'valid_token');
      expect(result).toHaveProperty('accessToken');
    });
  });
});

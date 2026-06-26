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

const mockUser = (): User =>
  ({
    id: 'user-uuid-1',
    username: 'john_doe',
    email: 'john@example.com',
    displayName: 'John Doe',
    passwordHash: 'hashed_password',
    isVerified: true,
    isActive: true,
    refreshToken: null,
    verifyPassword: jest.fn(),
  }) as unknown as User;

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Repository<User>>;
  let mailService: jest.Mocked<MailService>;
  let redis: jest.Mocked<RedisService>;

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
          useValue: { signAsync: jest.fn().mockResolvedValue('signed_token') },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock_value') },
        },
        {
          provide: MailService,
          useValue: { sendVerificationEmail: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            setex: jest.fn().mockResolvedValue('OK'),
            del: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    mailService = module.get(MailService);
    redis = module.get(RedisService);
  });

  describe('register', () => {
    it('throws ConflictException when email or username is taken', async () => {
      userRepo.findOne.mockResolvedValue(mockUser());
      await expect(
        service.register({
          email: 'john@example.com',
          username: 'john',
          password: 'Pass1234!',
          displayName: 'John',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates user and sends verification email', async () => {
      const user = mockUser();
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue(user);
      userRepo.save.mockResolvedValue(user);

      const result = await service.register({
        email: 'john@example.com',
        username: 'john_doe',
        password: 'Pass1234!',
        displayName: 'John Doe',
      });

      expect(userRepo.save).toHaveBeenCalled();
      expect(redis.setex).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        user.email,
        expect.any(String),
      );
      expect(result).toHaveProperty('userId');
    });
  });

  describe('verifyEmail', () => {
    it('throws BadRequestException when code is wrong', async () => {
      redis.get.mockResolvedValue('111111');
      await expect(service.verifyEmail('user-uuid-1', '999999')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('verifies email when code matches', async () => {
      redis.get.mockResolvedValue('123456');
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.verifyEmail('user-uuid-1', '123456');

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', { isVerified: true });
      expect(redis.del).toHaveBeenCalled();
      expect(result).toHaveProperty('message');
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.login({ email: 'x@x.com', password: 'Pass1234!' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      const user = mockUser();
      (user.verifyPassword as jest.Mock).mockResolvedValue(false);
      userRepo.findOne.mockResolvedValue(user);

      await expect(service.login({ email: user.email, password: 'WrongPass!' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when email is not verified', async () => {
      const user = { ...mockUser(), isVerified: false } as unknown as User;
      (user.verifyPassword as jest.Mock).mockResolvedValue(true);
      userRepo.findOne.mockResolvedValue(user);

      await expect(service.login({ email: user.email, password: 'Pass1234!' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns tokens on successful login', async () => {
      const user = mockUser();
      (user.verifyPassword as jest.Mock).mockResolvedValue(true);
      userRepo.findOne.mockResolvedValue(user);
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.login({ email: user.email, password: 'Pass1234!' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('userId');
    });
  });

  describe('refreshTokens', () => {
    it('throws UnauthorizedException when user has no stored refresh token', async () => {
      userRepo.findOne.mockResolvedValue({ ...mockUser(), refreshToken: null } as unknown as User);
      await expect(service.refreshTokens('user-uuid-1', 'some_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when refresh token does not match', async () => {
      userRepo.findOne.mockResolvedValue({
        ...mockUser(),
        refreshToken: 'hashed',
      } as unknown as User);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.refreshTokens('user-uuid-1', 'wrong_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns new tokens when refresh token is valid', async () => {
      userRepo.findOne.mockResolvedValue({
        ...mockUser(),
        refreshToken: 'hashed',
      } as unknown as User);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.refreshTokens('user-uuid-1', 'valid_token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('resendVerificationCode', () => {
    it('throws BadRequestException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.resendVerificationCode('user-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when user is already verified', async () => {
      userRepo.findOne.mockResolvedValue(mockUser()); // isVerified: true
      await expect(service.resendVerificationCode('user-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when cooldown is active', async () => {
      const user = { ...mockUser(), isVerified: false } as unknown as User;
      userRepo.findOne.mockResolvedValue(user);
      redis.get.mockResolvedValue('1'); // cooldown active

      await expect(service.resendVerificationCode('user-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('sends new code when user is unverified and no cooldown', async () => {
      const user = { ...mockUser(), isVerified: false } as unknown as User;
      userRepo.findOne.mockResolvedValue(user);
      redis.get.mockResolvedValue(null); // no cooldown

      const result = await service.resendVerificationCode('user-uuid-1');

      expect(redis.setex).toHaveBeenCalledWith('email_verify:user-uuid-1', 600, expect.any(String));
      expect(redis.setex).toHaveBeenCalledWith('email_verify_cooldown:user-uuid-1', 60, '1');
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        user.email,
        expect.any(String),
      );
      expect(result).toHaveProperty('message');
    });
  });

  describe('logout', () => {
    it('clears refresh token', async () => {
      userRepo.update.mockResolvedValue({ affected: 1 } as any);
      await service.logout('user-uuid-1');
      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', { refreshToken: undefined });
    });
  });
});

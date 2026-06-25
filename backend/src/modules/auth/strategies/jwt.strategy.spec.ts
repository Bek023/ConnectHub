import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '@/modules/users/users.service';
import { User } from '@/modules/users/entities/user.entity';

const mockUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-uuid-1',
    email: 'john@example.com',
    isActive: true,
    ...overrides,
  }) as User;

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock_jwt_secret') },
        },
        {
          provide: UsersService,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    strategy = module.get(JwtStrategy);
    usersService = module.get(UsersService);
  });

  it('returns the user when found and active', async () => {
    const user = mockUser();
    usersService.findById.mockResolvedValue(user);

    const result = await strategy.validate({ sub: user.id, email: user.email });

    expect(usersService.findById).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(user);
  });

  it('throws UnauthorizedException when the user does not exist', async () => {
    usersService.findById.mockResolvedValue(null);

    await expect(strategy.validate({ sub: 'missing', email: 'x@x.com' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when the user is inactive', async () => {
    usersService.findById.mockResolvedValue(mockUser({ isActive: false }));

    await expect(
      strategy.validate({ sub: 'user-uuid-1', email: 'john@example.com' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtRefreshStrategy,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock_refresh_secret') },
        },
      ],
    }).compile();

    strategy = module.get(JwtRefreshStrategy);
  });

  it('merges the refresh token from the request body into the payload', async () => {
    const req = { body: { refreshToken: 'some-refresh-token' } } as any;
    const payload = { sub: 'user-uuid-1', email: 'john@example.com' };

    const result = await strategy.validate(req, payload);

    expect(result).toEqual({ ...payload, refreshToken: 'some-refresh-token' });
  });

  it('sets refreshToken to undefined when missing from the request body', async () => {
    const req = { body: {} } as any;
    const payload = { sub: 'user-uuid-1' };

    const result = await strategy.validate(req, payload);

    expect(result).toEqual({ ...payload, refreshToken: undefined });
  });
});

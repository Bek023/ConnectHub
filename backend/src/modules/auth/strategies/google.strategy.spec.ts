import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock_value') },
        },
      ],
    }).compile();

    strategy = module.get(GoogleStrategy);
  });

  it('extracts googleId, email and displayName from the profile', () => {
    const profile = {
      id: 'google-id-1',
      emails: [{ value: 'john@example.com' }],
      displayName: 'John Doe',
    };
    const done = jest.fn();

    strategy.validate('access-token', 'refresh-token', profile, done);

    expect(done).toHaveBeenCalledWith(null, {
      googleId: 'google-id-1',
      email: 'john@example.com',
      displayName: 'John Doe',
    });
  });

  it('leaves email undefined when the profile has no emails', () => {
    const profile = { id: 'google-id-1', emails: [], displayName: 'John Doe' };
    const done = jest.fn();

    strategy.validate('access-token', 'refresh-token', profile, done);

    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ email: undefined, googleId: 'google-id-1' }),
    );
  });
});

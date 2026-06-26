import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

// Eslatma: ishlatish uchun `passport-google-oauth20` paketini o'rnatish kerak.
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private config: ConfigService) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID') || 'DISABLED',
      clientSecret: config.get('GOOGLE_CLIENT_SECRET') || 'DISABLED',
      callbackURL: `${config.get('API_URL', `http://localhost:${config.get('PORT', 4000)}/api/v1`)}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, emails, displayName } = profile;
    done(null, {
      googleId: id,
      email: emails?.[0]?.value,
      displayName,
    });
  }
}

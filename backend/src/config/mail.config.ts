import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import * as path from 'path';

export const mailConfig = (config: ConfigService) => {
  const user = config.get('MAIL_USER');
  const pass = config.get('MAIL_PASS');
  return {
    transport: {
      host: config.get('MAIL_HOST'),
      port: config.get<number>('MAIL_PORT', 587),
      secure: false,
      auth: user ? { user, pass } : undefined,
    },
    defaults: {
      from: config.get('MAIL_FROM'),
    },
    template: {
      dir: path.join(__dirname, '..', 'modules', 'mail', 'templates'),
      adapter: new HandlebarsAdapter(),
      options: { strict: true },
    },
  };
};

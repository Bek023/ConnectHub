import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService) {}

  async sendVerificationEmail(to: string, code: string) {
    await this.mailer.sendMail({
      to,
      subject: 'ConnectHub — Email tasdiqlash',
      template: 'verify-email',
      context: { code, appName: 'ConnectHub', year: new Date().getFullYear() },
    });
  }

  async sendPasswordResetCode(to: string, code: string) {
    await this.mailer.sendMail({
      to,
      subject: 'ConnectHub — Parolni tiklash',
      template: 'reset-password',
      context: { code, appName: 'ConnectHub', year: new Date().getFullYear() },
    });
  }

  async sendWelcomeEmail(to: string, displayName: string) {
    await this.mailer.sendMail({
      to,
      subject: 'ConnectHub ga xush kelibsiz!',
      template: 'welcome',
      context: { displayName, appName: 'ConnectHub' },
    });
  }
}

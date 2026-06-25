import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { databaseConfig } from './config/database.config';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GoalsModule } from './modules/goals/goals.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { MessagesModule } from './modules/messages/messages.module';
import { PostsModule } from './modules/posts/posts.module';
import { CallsModule } from './modules/calls/calls.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MediaModule } from './modules/media/media.module';
import { SearchModule } from './modules/search/search.module';
import { MailModule } from './modules/mail/mail.module';

import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ inject: [ConfigService], useFactory: databaseConfig }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),
    ScheduleModule.forRoot(),

    AuthModule,
    UsersModule,
    GoalsModule,
    GroupsModule,
    ChannelsModule,
    MessagesModule,
    PostsModule,
    CallsModule,
    NotificationsModule,
    MediaModule,
    SearchModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

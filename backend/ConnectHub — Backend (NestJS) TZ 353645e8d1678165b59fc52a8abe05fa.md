# ConnectHub — Backend (NestJS) TZ

# ⚙️ ConnectHub — Backend Texnik Zadaniya (NestJS)

> Bu hujjat **faqat Backend** ishlab chiquvchisi uchun. NestJS + PostgreSQL + Redis asosida quriladigan ConnectHub server ilovasining barcha texnik talablari — arxitektura, modullar, API, WebSocket, xavfsizlik, va deployment shu yerda.
> 

---

# 1. 🏗️ Texnik Stack

| Texnologiya | Versiya | Maqsad |
| --- | --- | --- |
| **Node.js** | 20 LTS | Runtime |
| **NestJS** | 10.x | Asosiy framework |
| **TypeScript** | 5.x | Type safety |
| **PostgreSQL** | 16 | Asosiy ma'lumotlar bazasi |
| **Redis** | 7.x | Cache, session, pub/sub |
| **TypeORM** | 0.3.x | ORM |
| [**Socket.io**](http://Socket.io) | 4.x | WebSocket real-vaqt |
| **mediasoup** | 3.x | WebRTC SFU (video/audio) |
| **Bull/BullMQ** | 5.x | Task queue |
| **Elasticsearch** | 8.x | Qidiruv tizimi |
| **MinIO / AWS S3** | latest | Fayl saqlash |
| **FFmpeg** | 6.x | Media transcode |
| **Docker** | 24.x | Containerization |
| **Nginx** | 1.25 | Reverse proxy |

## NPM Paketlar

```bash
# Core
bun add @nestjs/core @nestjs/common @nestjs/platform-express
bun add @nestjs/config @nestjs/jwt @nestjs/passport
bun add @nestjs/typeorm typeorm pg
bun add @nestjs/cache-manager cache-manager ioredis
bun add @nestjs/bull bullmq
bun add @nestjs/swagger swagger-ui-express
bun add @nestjs/websockets @nestjs/platform-socket.io socket.io
bun add @nestjs/throttler
bun add @nestjs/schedule

# Auth
bun add passport passport-jwt passport-local
bun add bcrypt argon2
bun add speakeasy qrcode  # 2FA

# Validation
bun add class-validator class-transformer

# Media
bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
bun add mediasoup
bun add fluent-ffmpeg
bun add sharp  # Rasm compress

# Search
bun add @elastic/elasticsearch

# Utils
bun add uuid dayjs helmet morgan
bun add nodemailer @nestjs-modules/mailer handlebars
bun add winston nest-winston

# Dev
bun add -D @types/node @types/bcrypt @types/multer
bun add -D jest @nestjs/testing supertest
```

---

# 2. 📁 Loyiha Tuzilmasi

```
connecthub-backend/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Health check
│   │
│   ├── config/
│   │   ├── app.config.ts          # App konfiguratsiya
│   │   ├── database.config.ts     # PostgreSQL config
│   │   ├── redis.config.ts        # Redis config
│   │   ├── jwt.config.ts          # JWT config
│   │   ├── mail.config.ts         # Email config
│   │   ├── s3.config.ts           # S3/MinIO config
│   │   └── mediasoup.config.ts    # WebRTC config
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── jwt-refresh.strategy.ts
│   │   │   │   └── google.strategy.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   └── throttle.guard.ts
│   │   │   └── dto/
│   │   │       ├── register.dto.ts
│   │   │       ├── login.dto.ts
│   │   │       └── refresh-token.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── goals/
│   │   │   ├── goals.module.ts
│   │   │   ├── goals.controller.ts
│   │   │   ├── goals.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── goal.entity.ts
│   │   │   │   └── user-goal.entity.ts
│   │   │   └── dto/
│   │   │       └── create-goal.dto.ts
│   │   │
│   │   ├── groups/
│   │   │   ├── groups.module.ts
│   │   │   ├── groups.controller.ts
│   │   │   ├── groups.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── group.entity.ts
│   │   │   │   └── group-member.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-group.dto.ts
│   │   │       └── update-member-role.dto.ts
│   │   │
│   │   ├── channels/
│   │   │   ├── channels.module.ts
│   │   │   ├── channels.controller.ts
│   │   │   ├── channels.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── channel.entity.ts
│   │   │   │   └── channel-subscriber.entity.ts
│   │   │   └── dto/
│   │   │       └── create-channel.dto.ts
│   │   │
│   │   ├── messages/
│   │   │   ├── messages.module.ts
│   │   │   ├── messages.controller.ts
│   │   │   ├── messages.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── message.entity.ts
│   │   │   │   └── message-reaction.entity.ts
│   │   │   └── dto/
│   │   │       ├── send-message.dto.ts
│   │   │       └── edit-message.dto.ts
│   │   │
│   │   ├── posts/
│   │   │   ├── posts.module.ts
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── post.entity.ts
│   │   │   │   └── comment.entity.ts
│   │   │   └── dto/
│   │   │       └── create-post.dto.ts
│   │   │
│   │   ├── calls/
│   │   │   ├── calls.module.ts
│   │   │   ├── calls.controller.ts
│   │   │   ├── calls.service.ts
│   │   │   ├── webrtc.service.ts  # mediasoup
│   │   │   └── entities/
│   │   │       └── call.entity.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts
│   │   │   └── entities/
│   │   │       └── notification.entity.ts
│   │   │
│   │   ├── media/
│   │   │   ├── media.module.ts
│   │   │   ├── media.controller.ts
│   │   │   └── media.service.ts   # S3, FFmpeg
│   │   │
│   │   └── search/
│   │       ├── search.module.ts
│   │       ├── search.controller.ts
│   │       └── search.service.ts  # Elasticsearch
│   │
│   ├── gateways/
│   │   ├── chat.gateway.ts        # Socket.io chat
│   │   ├── call.gateway.ts        # WebRTC signaling
│   │   └── notification.gateway.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── ws-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   └── cache.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── guards/
│   │   │   └── ws-jwt.guard.ts
│   │   └── types/
│   │       ├── pagination.type.ts
│   │       └── api-response.type.ts
│   │
│   └── database/
│       ├── migrations/            # TypeORM migrations
│       └── seeds/                 # Test data
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

# 3. 🗄️ Ma'lumotlar Bazasi — Entities (TypeORM)

## User Entity

```tsx
// modules/users/entities/user.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, OneToMany, BeforeInsert
} from 'typeorm';
import * as argon2 from 'argon2';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @Column({ name: 'display_name', length: 100 })
  displayName: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ nullable: true, length: 300 })
  bio: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'refresh_token', nullable: true, select: false })
  refreshToken: string;

  @Column({ name: 'two_fa_secret', nullable: true, select: false })
  twoFaSecret: string;

  @Column({ name: 'two_fa_enabled', default: false })
  twoFaEnabled: boolean;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @Column({ name: 'last_seen', nullable: true })
  lastSeen: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => GroupMember, (gm) => gm.user)
  groupMemberships: GroupMember[];

  @BeforeInsert()
  async hashPassword() {
    if (this.passwordHash) {
      this.passwordHash = await argon2.hash(this.passwordHash);
    }
  }

  async verifyPassword(plain: string): Promise<boolean> {
    return argon2.verify(this.passwordHash, plain);
  }
}
```

## Group Entity

```tsx
// modules/groups/entities/group.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, CreateDateColumn, JoinColumn
} from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ nullable: true, length: 1000 })
  description: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'cover_url', nullable: true })
  coverUrl: string;

  @Column({ name: 'is_private', default: false })
  isPrivate: boolean;

  @Column({ name: 'invite_code', unique: true, nullable: true })
  inviteCode: string;

  @Column({ name: 'max_members', default: 1000 })
  maxMembers: number;

  @Column({ name: 'member_count', default: 0 })
  memberCount: number;

  @ManyToOne(() => Goal)
  @JoinColumn({ name: 'goal_id' })
  goal: Goal;

  @Column({ name: 'goal_id' })
  goalId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by' })
  createdById: string;

  @OneToMany(() => GroupMember, (gm) => gm.group)
  members: GroupMember[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

// Rollar uchun enum
export enum MemberRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
}

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (g) => g.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: MemberRole, default: MemberRole.MEMBER })
  role: MemberRole;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
```

## Message Entity

```tsx
// modules/messages/entities/message.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, CreateDateColumn, JoinColumn
} from 'typeorm';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  VOICE = 'voice',
  POLL = 'poll',
}

export enum ChatType {
  GROUP = 'group',
  CHANNEL = 'channel',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chat_type', type: 'enum', enum: ChatType })
  chatType: ChatType;

  @Column({ name: 'chat_id' })
  chatId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ nullable: true, length: 4000 })
  content: string;

  @Column({
    name: 'message_type',
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  messageType: MessageType;

  @Column({ name: 'media_url', nullable: true })
  mediaUrl: string;

  @Column({ name: 'media_metadata', type: 'jsonb', nullable: true })
  mediaMetadata: {
    size?: number;
    duration?: number;
    mimeType?: string;
    width?: number;
    height?: number;
    thumbnailUrl?: string;
  };

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'reply_to' })
  replyTo: Message;

  @Column({ name: 'reply_to', nullable: true })
  replyToId: string;

  @Column({ name: 'is_edited', default: false })
  isEdited: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @OneToMany(() => MessageReaction, (r) => r.message)
  reactions: MessageReaction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('message_reactions')
export class MessageReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Message, (m) => m.reactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column({ name: 'message_id' })
  messageId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 10 })
  emoji: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

---

# 4. 🔐 Auth Moduli

## JWT Strategy

```tsx
// modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/modules/users/users.service';

export interface JwtPayload {
  sub: string;   // user id
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token yaroqsiz');
    }
    return user;
  }
}
```

## Auth Service

```tsx
// modules/auth/auth.service.ts
import {
  Injectable, UnauthorizedException,
  ConflictException, BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
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
    // Email va username mavjudligini tekshirish
    const exists = await this.userRepo.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });
    if (exists) {
      throw new ConflictException('Email yoki username band');
    }

    const user = this.userRepo.create({
      ...dto,
      passwordHash: dto.password, // @BeforeInsert da hash bo'ladi
    });
    await this.userRepo.save(user);

    // Email tasdiqlash kodi
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redis.setex(`email_verify:${user.id}`, 600, code); // 10 daqiqa
    await this.mailService.sendVerificationEmail(user.email, code);

    return { message: 'Tasdiqlash kodi emailga yuborildi', userId: user.id };
  }

  async verifyEmail(userId: string, code: string) {
    const stored = await this.redis.get(`email_verify:${userId}`);
    if (!stored || stored !== code) {
      throw new BadRequestException('Kod noto\'g\'ri yoki muddati tugagan');
    }
    await this.userRepo.update(userId, { isVerified: true });
    await this.redis.del(`email_verify:${userId}`);
    return { message: 'Email tasdiqlandi' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'passwordHash', 'isVerified', 'isActive', 'displayName'],
    });

    if (!user || !(await user.verifyPassword(dto.password))) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Email tasdiqlanmagan');
    }

    return this.generateTokens(user);
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

  async logout(userId: string) {
    await this.userRepo.update(userId, { refreshToken: null });
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

    // Refresh tokenni hash qilib saqlash
    const hashedRefresh = await argon2.hash(refreshToken);
    await this.userRepo.update(user.id, { refreshToken: hashedRefresh });

    return { accessToken, refreshToken, userId: user.id };
  }
}
```

## Auth Controller

```tsx
// modules/auth/auth.controller.ts
import {
  Controller, Post, Body, Get, Req,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 ta/daqiqa
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('verify-email')
  verifyEmail(@Body() body: { userId: string; code: string }) {
    return this.authService.verifyEmail(body.userId, body.code);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMe(@Req() req: any) {
    return req.user;
  }
}
```

---

# 5. 💬 Chat Gateway ([Socket.io](http://Socket.io))

```tsx
// gateways/chat.gateway.ts
import {
  WebSocketGateway, WebSocketServer,
  SubscribeMessage, MessageBody,
  ConnectedSocket, OnGatewayConnection,
  OnGatewayDisconnect, WsException,
} from '@nestjs/websockets';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '@/common/guards/ws-jwt.guard';
import { MessagesService } from '@/modules/messages/messages.service';
import { RedisService } from '@/config/redis.config';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMember } from '@/modules/groups/entities/group-member.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
  namespace: '/',
  transports: ['websocket'],
})
@UsePipes(new ValidationPipe())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private messagesService: MessagesService,
    private redis: RedisService,
    @InjectRepository(GroupMember)
    private memberRepo: Repository<GroupMember>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Token tekshirish
      const token = client.handshake.auth?.token;
      const user = await this.verifyToken(token);
      client.data.user = user;

      // Online holatni saqlash
      await this.redis.setex(`online:${user.id}`, 60, client.id);
      await this.redis.sadd('online_users', user.id);

      console.log(`✅ User ${user.id} ulandi: ${client.id}`);
    } catch (e) {
      client.emit('error', { message: 'Autentifikatsiya xatosi' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (!user) return;

    // Offline qilish
    await this.redis.del(`online:${user.id}`);
    await this.redis.srem('online_users', user.id);

    // Last seen yangilash
    await this.usersRepo?.update(user.id, { lastSeen: new Date() });
    console.log(`❌ User ${user.id} uzildi`);
  }

  // Xonaga kirish
  @SubscribeMessage('room:join')
  @UseGuards(WsJwtGuard)
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    // A'zoligini tekshirish
    const isMember = await this.checkMembership(client.data.user.id, data.chatId);
    if (!isMember) throw new WsException('Ruxsat yo\'q');

    client.join(`room:${data.chatId}`);
    client.emit('room:joined', { chatId: data.chatId });
  }

  // Xabar yuborish
  @SubscribeMessage('message:send')
  @UseGuards(WsJwtGuard)
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      chatId: string;
      chatType: 'group' | 'channel';
      content?: string;
      messageType?: string;
      mediaUrl?: string;
      replyTo?: string;
    },
  ) {
    const user = client.data.user;

    // A'zoligini tekshirish
    const isMember = await this.checkMembership(user.id, data.chatId);
    if (!isMember) throw new WsException('Ruxsat yo\'q');

    // Xabarni saqlash
    const message = await this.messagesService.create({
      ...data,
      senderId: user.id,
    });

    // Xonaga broadcast
    this.server.to(`room:${data.chatId}`).emit('message:new', message);

    // Bildirishnoma (offline userlar uchun)
    this.notifyOfflineMembers(data.chatId, message);
  }

  // Xabar tahrirlash
  @SubscribeMessage('message:edit')
  @UseGuards(WsJwtGuard)
  async handleEditMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; content: string },
  ) {
    const updated = await this.messagesService.edit(
      data.messageId,
      client.data.user.id,
      data.content,
    );
    this.server
      .to(`room:${updated.chatId}`)
      .emit('message:edited', { id: updated.id, content: updated.content });
  }

  // Xabar o'chirish
  @SubscribeMessage('message:delete')
  @UseGuards(WsJwtGuard)
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    const msg = await this.messagesService.delete(
      data.messageId,
      client.data.user.id,
    );
    this.server
      .to(`room:${msg.chatId}`)
      .emit('message:deleted', { id: msg.id });
  }

  // Reaction
  @SubscribeMessage('message:react')
  @UseGuards(WsJwtGuard)
  async handleReaction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; emoji: string },
  ) {
    const result = await this.messagesService.react(
      data.messageId,
      client.data.user.id,
      data.emoji,
    );
    this.server
      .to(`room:${result.chatId}`)
      .emit('message:reaction', result);
  }

  // Yozmoqda indikator
  @SubscribeMessage('typing:start')
  @UseGuards(WsJwtGuard)
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    client.to(`room:${data.chatId}`).emit('typing:indicator', {
      userId: client.data.user.id,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing:stop')
  @UseGuards(WsJwtGuard)
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    client.to(`room:${data.chatId}`).emit('typing:indicator', {
      userId: client.data.user.id,
      isTyping: false,
    });
  }

  private async checkMembership(userId: string, chatId: string): Promise<boolean> {
    const member = await this.memberRepo.findOne({
      where: { userId, groupId: chatId },
    });
    return !!member;
  }

  private async verifyToken(token: string) {
    // JWT verify — JwtService.verify ishlatiladi
    // ...
  }

  private async notifyOfflineMembers(chatId: string, message: any) {
    // Push notification (FCM) offline userlar uchun
    // ...
  }
}
```

---

# 6. 📡 WebRTC — Call Gateway (mediasoup)

```tsx
// gateways/call.gateway.ts
import {
  WebSocketGateway, WebSocketServer,
  SubscribeMessage, MessageBody,
  ConnectedSocket, UseGuards,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CallsService } from '@/modules/calls/calls.service';
import { WebRTCService } from '@/modules/calls/webrtc.service';
import { WsJwtGuard } from '@/common/guards/ws-jwt.guard';

@WebSocketGateway({ namespace: '/call' })
export class CallGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private callsService: CallsService,
    private webrtcService: WebRTCService,
  ) {}

  // Qo'ng'iroq boshlash
  @SubscribeMessage('call:initiate')
  @UseGuards(WsJwtGuard)
  async handleInitiate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; type: 'audio' | 'video' },
  ) {
    const call = await this.callsService.create({
      chatId: data.chatId,
      initiatorId: client.data.user.id,
      type: data.type,
    });

    // Guruh a'zolariga kiruvchi qo'ng'iroq bildirish
    this.server.to(`room:${data.chatId}`).emit('call:incoming', {
      callId: call.id,
      initiator: client.data.user,
      type: data.type,
    });

    // mediasoup Router yaratish
    const routerRtpCapabilities = await this.webrtcService.createRouter(call.id);
    client.emit('call:router-capabilities', { routerRtpCapabilities });
  }

  // Qo'ng'iroqqa qo'shilish
  @SubscribeMessage('call:join')
  @UseGuards(WsJwtGuard)
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string },
  ) {
    client.join(`call:${data.callId}`);
    const routerRtpCapabilities = await this.webrtcService.getRouterCapabilities(data.callId);
    client.emit('call:router-capabilities', { routerRtpCapabilities });

    // Boshqa ishtirokchilarga bildirish
    client.to(`call:${data.callId}`).emit('call:participant:joined', {
      userId: client.data.user.id,
      user: client.data.user,
    });
  }

  // WebRTC Transport yaratish
  @SubscribeMessage('call:create-transport')
  @UseGuards(WsJwtGuard)
  async handleCreateTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; direction: 'send' | 'recv' },
  ) {
    const transport = await this.webrtcService.createTransport(
      data.callId,
      client.data.user.id,
      data.direction,
    );
    client.emit('call:transport-created', transport);
  }

  // Transport ulash
  @SubscribeMessage('call:connect-transport')
  @UseGuards(WsJwtGuard)
  async handleConnectTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { transportId: string; dtlsParameters: any },
  ) {
    await this.webrtcService.connectTransport(data.transportId, data.dtlsParameters);
    client.emit('call:transport-connected');
  }

  // Producer (media yuborish)
  @SubscribeMessage('call:produce')
  @UseGuards(WsJwtGuard)
  async handleProduce(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; transportId: string; kind: string; rtpParameters: any },
  ) {
    const { producerId } = await this.webrtcService.produce(
      data.transportId,
      data.kind,
      data.rtpParameters,
    );

    // Boshqa ishtirokchilarga yangi producer haqida bildirish
    client.to(`call:${data.callId}`).emit('call:new-producer', {
      producerId,
      userId: client.data.user.id,
      kind: data.kind,
    });

    client.emit('call:produced', { producerId });
  }

  // Consumer (media qabul qilish)
  @SubscribeMessage('call:consume')
  @UseGuards(WsJwtGuard)
  async handleConsume(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; producerId: string; rtpCapabilities: any },
  ) {
    const consumer = await this.webrtcService.consume(
      data.callId,
      client.data.user.id,
      data.producerId,
      data.rtpCapabilities,
    );
    client.emit('call:consumed', consumer);
  }

  // Qo'ng'iroqni tugatish
  @SubscribeMessage('call:end')
  @UseGuards(WsJwtGuard)
  async handleEnd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string },
  ) {
    await this.callsService.end(data.callId, client.data.user.id);
    await this.webrtcService.closeRoom(data.callId);
    this.server.to(`call:${data.callId}`).emit('call:ended', { callId: data.callId });
  }
}
```

---

# 7. 📤 Media Service (S3 + FFmpeg)

```tsx
// modules/media/media.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client, PutObjectCommand,
  DeleteObjectCommand, GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as sharp from 'sharp';
import * as ffmpeg from 'fluent-ffmpeg';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';

type MediaType = 'image' | 'video' | 'voice' | 'file';

const ALLOWED_TYPES: Record<MediaType, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  voice: ['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4'],
  file: ['application/pdf', 'application/zip', 'text/plain',
         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

const MAX_SIZES: Record<MediaType, number> = {
  image: 10 * 1024 * 1024,   // 10 MB
  video: 100 * 1024 * 1024,  // 100 MB
  voice: 20 * 1024 * 1024,   // 20 MB
  file: 50 * 1024 * 1024,    // 50 MB
};

@Injectable()
export class MediaService {
  private s3: S3Client;
  private bucket: string;
  private cdnUrl: string;

  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      region: config.get('AWS_REGION'),
      endpoint: config.get('S3_ENDPOINT'), // MinIO uchun
      credentials: {
        accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = config.get('S3_BUCKET');
    this.cdnUrl = config.get('CDN_URL');
  }

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    mediaType: MediaType,
  ) {
    // Fayl turi tekshirish
    if (!ALLOWED_TYPES[mediaType].includes(mimeType)) {
      throw new BadRequestException(`${mimeType} turi ruxsat etilmagan`);
    }

    // Hajm tekshirish
    if (buffer.length > MAX_SIZES[mediaType]) {
      throw new BadRequestException('Fayl hajmi juda katta');
    }

    let processedBuffer = buffer;
    let metadata: Record<string, any> = { size: buffer.length, mimeType };

    // Rasm optimallashtirish
    if (mediaType === 'image') {
      const result = await this.processImage(buffer);
      processedBuffer = result.buffer;
      metadata = { ...metadata, ...result.metadata };
    }

    // Video thumbnail
    if (mediaType === 'video') {
      const result = await this.processVideo(buffer, originalName);
      metadata = { ...metadata, ...result };
    }

    const ext = path.extname(originalName);
    const key = `${mediaType}s/${uuid()}${ext}`;

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: processedBuffer,
      ContentType: mimeType,
      ACL: 'public-read',
      Metadata: { originalName: encodeURIComponent(originalName) },
    }));

    return {
      url: `${this.cdnUrl}/${key}`,
      key,
      mediaType,
      metadata,
    };
  }

  private async processImage(buffer: Buffer) {
    const image = sharp(buffer);
    const imgMeta = await image.metadata();

    const processed = await image
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    // Thumbnail
    const thumbnail = await sharp(buffer)
      .resize(320, 240, { fit: 'cover' })
      .webp({ quality: 70 })
      .toBuffer();

    const thumbKey = `thumbnails/${uuid()}.webp`;
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: thumbKey,
      Body: thumbnail,
      ContentType: 'image/webp',
      ACL: 'public-read',
    }));

    return {
      buffer: processed,
      metadata: {
        width: imgMeta.width,
        height: imgMeta.height,
        thumbnailUrl: `${this.cdnUrl}/${thumbKey}`,
      },
    };
  }

  private async processVideo(buffer: Buffer, name: string) {
    const tmpInput = `/tmp/${uuid()}${path.extname(name)}`;
    const tmpThumb = `/tmp/${uuid()}.jpg`;
    await fs.writeFile(tmpInput, buffer);

    // Davomiylik va thumbnail olish
    return new Promise<object>((resolve, reject) => {
      ffmpeg(tmpInput)
        .screenshots({ count: 1, filename: path.basename(tmpThumb), folder: '/tmp' })
        .on('end', async () => {
          // Thumbnail S3 ga yuklash
          const thumbBuffer = await fs.readFile(tmpThumb);
          const thumbKey = `thumbnails/${uuid()}.jpg`;
          await this.s3.send(new PutObjectCommand({
            Bucket: this.bucket, Key: thumbKey,
            Body: thumbBuffer, ContentType: 'image/jpeg', ACL: 'public-read',
          }));
          await fs.unlink(tmpInput).catch(() => {});
          await fs.unlink(tmpThumb).catch(() => {});
          resolve({ thumbnailUrl: `${this.cdnUrl}/${thumbKey}` });
        })
        .on('error', reject);
    });
  }

  async deleteFile(key: string) {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async getPresignedUrl(key: string, expiresIn = 3600) {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn },
    );
  }
}
```

---

# 8. 🔍 Elasticsearch — Qidiruv

```tsx
// modules/search/search.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService implements OnModuleInit {
  private es: ElasticsearchService;

  constructor(private config: ConfigService) {
    this.es = new ElasticsearchService({
      node: config.get('ELASTICSEARCH_URL'),
      auth: {
        username: config.get('ES_USERNAME'),
        password: config.get('ES_PASSWORD'),
      },
    });
  }

  async onModuleInit() {
    await this.createIndices();
  }

  private async createIndices() {
    const indices = [
      {
        index: 'goals',
        body: {
          mappings: {
            properties: {
              title: { type: 'text', analyzer: 'standard' },
              description: { type: 'text' },
              category: { type: 'keyword' },
              memberCount: { type: 'integer' },
              createdAt: { type: 'date' },
            },
          },
        },
      },
      {
        index: 'groups',
        body: {
          mappings: {
            properties: {
              name: { type: 'text', analyzer: 'standard' },
              description: { type: 'text' },
              goalId: { type: 'keyword' },
              memberCount: { type: 'integer' },
            },
          },
        },
      },
      {
        index: 'messages',
        body: {
          mappings: {
            properties: {
              content: { type: 'text' },
              chatId: { type: 'keyword' },
              senderId: { type: 'keyword' },
              createdAt: { type: 'date' },
            },
          },
        },
      },
    ];

    for (const { index, body } of indices) {
      const exists = await this.es.indices.exists({ index });
      if (!exists) await this.es.indices.create({ index, body });
    }
  }

  async indexDocument(index: string, id: string, body: object) {
    await this.es.index({ index, id, body });
  }

  async search(index: string, query: string, filters?: object, size = 20) {
    const result = await this.es.search({
      index,
      body: {
        query: {
          bool: {
            must: [{ multi_match: { query, fields: ['title^2', 'name^2', 'description', 'content'], fuzziness: 'AUTO' } }],
            filter: filters ? [{ term: filters }] : [],
          },
        },
        size,
        highlight: { fields: { title: {}, name: {}, content: {} } },
      },
    });

    return result.hits.hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...(hit._source as object),
      highlight: hit.highlight,
    }));
  }

  async deleteDocument(index: string, id: string) {
    await this.es.delete({ index, id });
  }
}
```

---

# 9. 🌐 API Endpoints — To'liq Ro'yxat

## Base URL: `/api/v1`

### Auth

```
POST   /auth/register          Body: {username, email, password, displayName}
POST   /auth/login             Body: {email, password}
POST   /auth/logout            Header: Bearer token
POST   /auth/refresh           Body: {userId, refreshToken}
POST   /auth/verify-email      Body: {userId, code}
POST   /auth/forgot-password   Body: {email}
POST   /auth/reset-password    Body: {token, password}
POST   /auth/google            Body: {idToken}
GET    /auth/me                Header: Bearer token
```

### Users

```
GET    /users/me               Profil
PUT    /users/me               Body: {displayName, bio, avatarUrl}
DELETE /users/me               Akkauntni o'chirish
POST   /users/me/avatar        Multipart: avatar file
GET    /users/:id              Boshqa profil
GET    /users/search?q=        Qidiruv
GET    /users/online           Online userlar
```

### Goals

```
GET    /goals                  Query: {page, limit, category, q}
GET    /goals/trending         Trend maqsadlar
GET    /goals/my               Mening maqsadlarim
GET    /goals/:id
POST   /goals                  Body: {title, description, category, icon, color}
PUT    /goals/:id
DELETE /goals/:id
POST   /goals/:id/join
DELETE /goals/:id/leave
GET    /goals/:id/groups       Query: {page, limit}
GET    /goals/:id/channels
GET    /goals/:id/members
```

### Groups

```
GET    /groups                 Query: {goalId, page, limit}
POST   /groups                 Body: {goalId, name, description, isPrivate}
GET    /groups/:id
PUT    /groups/:id             Body: {name, description, avatarUrl, coverUrl}
DELETE /groups/:id
POST   /groups/:id/join
POST   /groups/join/:code      Invite code
DELETE /groups/:id/leave
GET    /groups/:id/members     Query: {role, page}
PUT    /groups/:id/members/:uid Body: {role}
DELETE /groups/:id/members/:uid
GET    /groups/:id/messages    Query: {cursor, limit}
GET    /groups/:id/posts       Query: {page, limit}
GET    /groups/:id/media       Query: {type, page}
POST   /groups/:id/invite-link  Yangi invite link
GET    /groups/:id/stats        Admin statistika
```

### Channels

```
GET    /channels               Query: {goalId, page, limit}
POST   /channels               Body: {goalId, name, description}
GET    /channels/:id
PUT    /channels/:id
DELETE /channels/:id
POST   /channels/:id/subscribe
DELETE /channels/:id/unsubscribe
GET    /channels/:id/posts     Query: {cursor, limit}
GET    /channels/:id/subscribers
GET    /channels/:id/stats
```

### Messages

```
GET    /messages/:chatType/:chatId  Query: {cursor, limit}
DELETE /messages/:id
PUT    /messages/:id               Body: {content}
POST   /messages/:id/react         Body: {emoji}
DELETE /messages/:id/react/:emoji
POST   /messages/media/upload      Multipart: file, type
GET    /messages/:id/read-by
```

### Posts

```
GET    /posts/feed             Lenta
POST   /posts                  Body: {chatType, chatId, content, mediaUrls}
GET    /posts/:id
PUT    /posts/:id
DELETE /posts/:id
POST   /posts/:id/like
DELETE /posts/:id/like
GET    /posts/:id/comments     Query: {cursor}
POST   /posts/:id/comments     Body: {content, replyTo?}
DELETE /posts/:id/comments/:commentId
POST   /posts/:id/pin
DELETE /posts/:id/pin
```

### Calls

```
POST   /calls/initiate         Body: {chatId, type}
POST   /calls/:id/join
POST   /calls/:id/end
GET    /calls/:id/participants
GET    /calls/history          O'tgan qo'ng'iroqlar
```

### Search

```
GET    /search?q=&type=        type: all|goals|groups|channels|messages|users
GET    /search/suggestions?q=  Autocomplete
```

### Notifications

```
GET    /notifications          Query: {page, unreadOnly}
PUT    /notifications/read-all
PUT    /notifications/:id/read
DELETE /notifications/:id
POST   /notifications/push/register  Body: {token, platform}
```

---

# 10. 🛡️ Xavfsizlik

## Rate Limiting

```tsx
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot([
  { name: 'short',  ttl: 1000,  limit: 3   },  // 3 req/sekund
  { name: 'medium', ttl: 10000, limit: 20  },  // 20 req/10s
  { name: 'long',   ttl: 60000, limit: 100 },  // 100 req/daqiqa
]),
```

## Global Middleware (main.ts)

```tsx
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Xavfsizlik headerlari
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // Logging
  app.use(morgan('combined'));

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,          // Ko'rsatilmagan fieldlarni olib tashlash
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('ConnectHub API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT || 4000);
  console.log(`🚀 Server: http://localhost:${process.env.PORT || 4000}/api/v1`);
  console.log(`📚 Swagger: http://localhost:${process.env.PORT || 4000}/api/docs`);
}

bootstrap();
```

## DTO Validatsiya

```tsx
// modules/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username faqat harf, raqam va _ dan iborat bo\'lsin' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Parol kamida 8 ta belgi bo\'lsin' })
  @MaxLength(72)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Parolda katta harf, kichik harf va raqam bo\'lishi shart',
  })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  displayName: string;
}
```

---

# 11. ⚡ Redis — Cache va Pub/Sub

```tsx
// config/redis.config.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;

  constructor(private config: ConfigService) {
    const redisConfig = {
      host: config.get('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      password: config.get('REDIS_PASSWORD'),
      retryStrategy: (times: number) => Math.min(times * 100, 3000),
    };

    this.client = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
    this.publisher = new Redis(redisConfig);

    this.client.on('error', (e) => console.error('Redis xatosi:', e));
  }

  // Key-value operatsiyalar
  async get(key: string) { return this.client.get(key); }
  async set(key: string, value: string) { return this.client.set(key, value); }
  async setex(key: string, seconds: number, value: string) {
    return this.client.setex(key, seconds, value);
  }
  async del(key: string) { return this.client.del(key); }
  async exists(key: string) { return this.client.exists(key); }
  async incr(key: string) { return this.client.incr(key); }
  async expire(key: string, seconds: number) { return this.client.expire(key, seconds); }

  // Set operatsiyalar
  async sadd(key: string, ...members: string[]) { return this.client.sadd(key, ...members); }
  async srem(key: string, ...members: string[]) { return this.client.srem(key, ...members); }
  async smembers(key: string) { return this.client.smembers(key); }

  // Hash operatsiyalar
  async hset(key: string, field: string, value: string) { return this.client.hset(key, field, value); }
  async hget(key: string, field: string) { return this.client.hget(key, field); }
  async hgetall(key: string) { return this.client.hgetall(key); }

  // Cache wrapper
  async getOrSet<T>(key: string, ttl: number, factory: () => Promise<T>): Promise<T> {
    const cached = await this.get(key);
    if (cached) return JSON.parse(cached);
    const value = await factory();
    await this.setex(key, ttl, JSON.stringify(value));
    return value;
  }

  // Pub/Sub
  async publish(channel: string, message: object) {
    return this.publisher.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, handler: (msg: any) => void) {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) handler(JSON.parse(msg));
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
    this.subscriber.disconnect();
    this.publisher.disconnect();
  }
}
```

---

# 12. 📧 Mail Service

```tsx
// modules/mail/mail.service.ts
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

  async sendPasswordReset(to: string, resetLink: string) {
    await this.mailer.sendMail({
      to,
      subject: 'ConnectHub — Parolni tiklash',
      template: 'reset-password',
      context: { resetLink, appName: 'ConnectHub' },
    });
  }

  async sendWelcomeEmail(to: string, displayName: string) {
    await this.mailer.sendMail({
      to,
      subject: "ConnectHub ga xush kelibsiz!",
      template: 'welcome',
      context: { displayName, appName: 'ConnectHub' },
    });
  }
}
```

---

# 13. 🐳 Docker va Deployment

## Dockerfile

```docker
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g bun
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g bun
RUN apk add --no-cache ffmpeg
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

## docker-compose.yml

```yaml
version: '3.9'

services:
  api:
    build: .
    ports:
      - '4000:4000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/connecthub
      - REDIS_HOST=redis
      - ELASTICSEARCH_URL=http://elasticsearch:9200
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - connecthub-net

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: connecthub
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - connecthub-net

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - connecthub-net

  elasticsearch:
    image: elasticsearch:8.12.0
    environment:
      - discovery.type=single-node
      - ELASTIC_PASSWORD=${ES_PASSWORD}
      - xpack.security.enabled=true
    volumes:
      - es_data:/usr/share/elasticsearch/data
    ports:
      - '9200:9200'
    networks:
      - connecthub-net

  minio:
    image: minio/minio
    command: server /data --console-address ':9001'
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - '9000:9000'
      - '9001:9001'
    networks:
      - connecthub-net

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    networks:
      - connecthub-net

volumes:
  postgres_data:
  redis_data:
  es_data:
  minio_data:

networks:
  connecthub-net:
    driver: bridge
```

---

# 14. 🔑 Environment Variables

```bash
# .env.example

# App
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
MOBILE_URL=connecthub://

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/connecthub
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=connecthub

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_min_64_chars_here
JWT_REFRESH_SECRET=your_refresh_secret_different_from_jwt
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Mail (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASS=
MAIL_FROM=noreply@connecthub.app

# S3 / MinIO
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=connecthub-media
S3_ENDPOINT=http://localhost:9000  # MinIO uchun
CDN_URL=https://cdn.connecthub.app

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200
ES_USERNAME=elastic
ES_PASSWORD=

# Firebase (Push Notification)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# WebRTC (mediasoup)
MEDIASOUP_LISTEN_IP=0.0.0.0
MEDIASOUP_ANNOUNCED_IP=your_server_ip
MEDIASOUP_MIN_PORT=10000
MEDIASOUP_MAX_PORT=10100

# Monitoring
SENTRY_DSN=
```

---

# 15. 🧪 Testing

```tsx
// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register — muvaffaqiyatli ro\'yxatdan o\'tish', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123456!',
        displayName: 'Test User',
      })
      .expect(201);

    expect(response.body).toHaveProperty('userId');
    expect(response.body.message).toContain('emailga yuborildi');
  });

  it('POST /auth/login — noto\'g\'ri parol', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'WrongPass' })
      .expect(401);
  });

  it('GET /auth/me — token yo\'q', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(401);
  });
});
```

## Test Qamrovi Maqsadi

| Modul | Unit | Integration | E2E |
| --- | --- | --- | --- |
| Auth | 90%+ | 80%+ | ✅ |
| Users | 80%+ | 70%+ | ✅ |
| Messages | 85%+ | 75%+ | ✅ |
| Groups | 80%+ | 70%+ | - |
| WebRTC | 60%+ | 50%+ | - |

---

# 16. 📋 Backend Developer Checklist

## Setup

- [ ]  NestJS loyiha yaratish: `nest new connecthub-backend`
- [ ]  Barcha paketlar o'rnatilgan
- [ ]  `.env.local` sozlangan
- [ ]  TypeORM + PostgreSQL ulanish
- [ ]  Redis ulanish
- [ ]  Docker Compose ishga tushirilgan

## Modullar

- [ ]  Auth moduli (register, login, logout, refresh, verify-email)
- [ ]  JWT strategy + Guards
- [ ]  Users moduli
- [ ]  Goals moduli
- [ ]  Groups moduli (a'zolar, rollar, invite)
- [ ]  Channels moduli
- [ ]  Messages moduli (CRUD, reactions)
- [ ]  Posts moduli (CRUD, like, comment)
- [ ]  Media moduli (upload, S3, FFmpeg)
- [ ]  Search moduli (Elasticsearch)
- [ ]  Notifications moduli
- [ ]  Calls moduli

## Real-vaqt

- [ ]  Chat Gateway ([Socket.io](http://Socket.io))
- [ ]  Call Gateway (WebRTC signaling)
- [ ]  Notification Gateway
- [ ]  WsJwtGuard

## Xavfsizlik

- [ ]  Rate limiting (Throttler)
- [ ]  Helmet headers
- [ ]  CORS sozlash
- [ ]  Input validation (class-validator)
- [ ]  SQL injection himoyasi (TypeORM parametrli query)
- [ ]  File upload validatsiya (tur, hajm)

## Infra

- [ ]  Dockerfile
- [ ]  docker-compose.yml
- [ ]  Nginx konfiguratsiya
- [ ]  Database migration'lar
- [ ]  Swagger UI (`/api/docs`)
- [ ]  Health check endpoint
- [ ]  Winston logging
- [ ]  Sentry error monitoring

---

> 📌 **Muhim:** Har bir endpoint Swagger'da to'liq hujjatlashtirilgan bo'lsin (ApiProperty, ApiResponse, ApiBearerAuth).
> 

---

*ConnectHub Backend TZ | NestJS 10 + PostgreSQL + Redis | 2026-yil Aprel*

---

# 🔍 Code Review & Tavsiyalar

> Bu bo'lim TZ ni tahlil qilish natijasida aniqlangan xatolar, xavf omillari va yaxshilash tavsiyalarini o'z ichiga oladi.
> 

---

## ⚠️ Aniqlangan Xatolar (Buglar)

### 1. `ChatGateway` — `usersRepo` inject qilinmagan

`handleDisconnect` metodida `this.usersRepo` ishlatilgan, lekin constructor'da inject qilinmagan. Bu runtime'da `undefined` xatosiga olib keladi.

```tsx
// ❌ Xato — usersRepo mavjud emas
await this.usersRepo?.update(user.id, { lastSeen: new Date() });

// ✅ To'g'ri — UsersRepository ni inject qilish kerak
@InjectRepository(User)
private usersRepo: Repository<User>;
```

### 2. `Group.memberCount` — Desync xavfi

`memberCount` maydoni `Group` entity'da alohida saqlanmoqda. `GroupMember` qo'shilsa yoki o'chirilsa, bu maydon avtomatik yangilanmaydi. Transaction yoki DB trigger kerak:

```tsx
// ✅ To'g'ri yondashuv — Transaction ichida
await queryRunner.manager.increment(Group, { id: groupId }, 'memberCount', 1);
```

### 3. `MEDIASOUP_MAX_PORT` — Port range juda kichik

```bash
# ❌ Faqat 100 ta port = max 50 ta bir vaqtdagi video call
MEDIASOUP_MIN_PORT=10000
MEDIASOUP_MAX_PORT=10100

# ✅ Kamida 10000 ta port bo'lishi kerak
MEDIASOUP_MIN_PORT=10000
MEDIASOUP_MAX_PORT=20000
```

### 4. `REDIS_PASSWORD` — Production'da bo'sh

`.env.example` da `REDIS_PASSWORD=` bo'sh qoldirilgan. Production'da bu jiddiy xavfsizlik muammosi. Majburiy to'ldirish kerak.

### 5. `verifyToken` — ChatGateway'da implement qilinmagan

`handleConnection` ichida `this.verifyToken(token)` chaqirilgan, lekin bu metod to'liq implement qilinmagan (faqat komment bor). JwtService inject qilib to'liq yozilishi kerak.

---

## 🚦 Loyiha Hajmi Tahlili

Bu TZ **bir developer uchun 3–6 oylik** ish hajmini o'z ichiga oladi. Barcha featurelarni bir vaqtda qurishga urinish eng katta xavf.

### Tavsiya etilgan boshlash tartibi (MVP → Production):

| Bosqich | Modullar | Taxminiy vaqt |
| --- | --- | --- |
| **1 — Foundation** | Auth, Users, JWT Guards | 1-2 hafta |
| **2 — Core Chat** | Groups, Messages, [Socket.io](http://Socket.io) Gateway | 2-3 hafta |
| **3 — Media** | Media upload, S3/MinIO | 1 hafta |
| **4 — Content** | Posts, Channels, Notifications | 2 hafta |
| **5 — Search** | Elasticsearch (yoki PostgreSQL FTS) | 1 hafta |
| **6 — Calls** | mediasoup, WebRTC | 2-3 hafta |

---

## 💡 Yaxshilash Tavsiyalari

### MVP uchun Elasticsearch o'rniga PostgreSQL FTS

Elasticsearch alohida server, konfiguratsiya va resurs talab qiladi. MVP bosqichida oddiy PostgreSQL full-text search yetarli:

```sql
-- Elasticsearch o'rniga ishlatish mumkin
WHERE to_tsvector('simple', name || ' ' || description)
  @@ plainto_tsquery('simple', $1)
```

Keyinchalik Elasticsearch qo'shiladi.

### mediasoup port range — Production sozlamasi

```bash
# mediasoup uchun OS darajasida firewall ochilishi kerak
MEDIASOUP_MIN_PORT=10000
MEDIASOUP_MAX_PORT=20000
# + Nginx upstream'da WebSocket proxy to'g'ri sozlansin
```

### `memberCount` o'rniga COUNT query ishlatish

Real-time counter o'rniga, kichik guruhlarda to'g'ridan-to'g'ri COUNT ishlatish xavfsizroq:

```tsx
// Har doim aniq son
const count = await this.memberRepo.count({ where: { groupId } });
```

### Redis password — `.env.example` da majburiy belgilash

```bash
# .env.example
REDIS_PASSWORD=CHANGE_ME_IN_PRODUCTION  # bo'sh qoldirilmasin
```

---

## ✅ Umumiy Baho

| Mezon | Baho | Izoh |
| --- | --- | --- |
| Arxitektura | ⭐⭐⭐⭐⭐ | NestJS best practice to'liq qo'llanilgan |
| Stack tanlovi | ⭐⭐⭐⭐⭐ | Industry-standard, production-ready |
| Xavfsizlik | ⭐⭐⭐⭐⭐ | Argon2, refresh token hashing, rate limit — barchasi to'g'ri |
| Realistik hajm | ⭐⭐⭐ | Bir developer uchun juda katta — bosqichma-bosqich qurilsin |
| Kod sifati | ⭐⭐⭐⭐ | Bir nechta kichik xato bor, yuqorida ko'rsatilgan |

> 📌 **Xulosa:** TZ sifati juda yuqori va tajribali odam tomonidan yozilgan. Asosiy tavsiya — **bosqichma-bosqich (MVP → feature by feature)** qurilsin. mediasoup va Elasticsearch — oxirgi bosqichga qoldirilsin.
> 

---

*Code Review | Claude AI | 2026-yil Iyun*
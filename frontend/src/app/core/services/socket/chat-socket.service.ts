import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import {
  Message,
  ReactionEvent,
  SendMessagePayload,
  TypingEvent,
} from '../../../features/chat/models/message.model';
import { AuthService } from '../auth/auth.service';
import { TokenStorage } from '../token-storage/token-storage';

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private readonly tokenStorage = inject(TokenStorage);
  private readonly authService = inject(AuthService);

  private socket: Socket | null = null;
  private readonly joinedChats = new Set<string>();

  private readonly newMessageSubject = new Subject<Message>();
  private readonly typingSubject = new Subject<TypingEvent>();
  private readonly reactionSubject = new Subject<ReactionEvent>();
  private readonly readSubject = new Subject<{ chatId: string; messageId: string }>();

  readonly newMessage: Observable<Message> = this.newMessageSubject.asObservable();
  readonly userTyping: Observable<TypingEvent> = this.typingSubject.asObservable();
  readonly messageReaction: Observable<ReactionEvent> = this.reactionSubject.asObservable();
  readonly messageRead = this.readSubject.asObservable();

  readonly connected = signal(false);

  constructor() {
    this.authService.registerSessionTeardown(() => this.disconnect());
  }

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }
    const token = await this.freshToken();
    if (!token) {
      return;
    }

    this.socket?.disconnect();
    this.socket = io(`${environment.socketUrl}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.connected.set(true);
      for (const chatId of this.joinedChats) {
        this.socket?.emit('joinChat', { chatId });
      }
    });

    this.socket.on('disconnect', () => this.connected.set(false));

    this.socket.io.on('reconnect_attempt', () => {
      void this.refreshHandshakeToken();
    });

    this.socket.on('newMessage', (message: Message) => this.newMessageSubject.next(message));
    this.socket.on('userTyping', (event: TypingEvent) => this.typingSubject.next(event));
    this.socket.on('messageReaction', (event: ReactionEvent) => this.reactionSubject.next(event));
    this.socket.on('messageRead', (event: { chatId: string; messageId: string }) =>
      this.readSubject.next(event),
    );
  }

  disconnect(): void {
    this.joinedChats.clear();
    this.socket?.disconnect();
    this.socket = null;
    this.connected.set(false);
  }

  joinChat(chatId: string): void {
    this.joinedChats.add(chatId);
    this.socket?.emit('joinChat', { chatId });
  }

  leaveChat(chatId: string): void {
    this.joinedChats.delete(chatId);
    this.socket?.emit('leaveChat', { chatId });
  }

  sendMessage(payload: SendMessagePayload): void {
    this.socket?.emit('sendMessage', payload);
  }

  typing(chatId: string): void {
    this.socket?.emit('typing', { chatId });
  }

  react(messageId: string, emoji: string): void {
    this.socket?.emit('reactToMessage', { messageId, emoji });
  }

  markRead(messageId: string): void {
    this.socket?.emit('markRead', { messageId });
  }

  private async refreshHandshakeToken(): Promise<void> {
    const token = await this.freshToken();
    if (token && this.socket) {
      this.socket.auth = { token };
    }
  }

  private async freshToken(): Promise<string | null> {
    const existing = this.tokenStorage.getAccessToken();
    if (existing) {
      return existing;
    }
    if (!this.tokenStorage.hasSession()) {
      return null;
    }
    try {
      return await firstValueFrom(this.authService.refreshAccessToken());
    } catch {
      return null;
    }
  }
}

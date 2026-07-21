import { Component, DestroyRef, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, ArrowLeft01Icon, Image01Icon, SentIcon } from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_MAX_BYTES,
  MediaService,
} from '../../../../core/services/media/media.service';
import { MessagesService } from '../../../../core/services/messages/messages.service';
import { ChatSocketService } from '../../../../core/services/socket/chat-socket.service';
import { MessageBubble } from '../../components/message-bubble/message-bubble';
import { ChatType, Message } from '../../models/message.model';

const TYPING_TIMEOUT_MS = 3000;

@Component({
  selector: 'app-chat-room',
  standalone: true,
  host: { class: 'block' },
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    HugeiconsIconComponent,
    MessageBubble,
  ],
  template: `
    <div class="mx-auto flex h-[calc(100dvh-8rem)] w-full max-w-2xl flex-col">
      <div class="mb-3 flex items-center gap-3">
        <a routerLink="/chat" class="btn-ghost-icon" [attr.aria-label]="'common.back' | translate">
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="flex-1 truncate text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'nav.chat' | translate }}
        </h1>
        <span
          class="h-2 w-2 shrink-0 rounded-full"
          [class]="socket.connected() ? 'bg-accent-500' : 'bg-zinc-300 dark:bg-zinc-700'"
          [title]="(socket.connected() ? 'chat.online' : 'chat.offline') | translate"
        ></span>
      </div>

      <div #scroller class="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        @if (loading()) {
          <div class="space-y-3">
            @for (i of [1, 2, 3]; track i) {
              <div class="h-12 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800"></div>
            }
          </div>
        } @else if (errorMessage()) {
          <p class="field-error" role="alert">
            <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
            {{ errorMessage() }}
          </p>
        } @else {
          @if (nextCursor()) {
            <button type="button" class="btn-secondary" [disabled]="loadingMore()" (click)="loadHistory()">
              {{ (loadingMore() ? 'common.loading' : 'posts.loadMore') | translate }}
            </button>
          }
          @for (message of messages(); track message.id) {
            <app-message-bubble
              [message]="message"
              [own]="message.senderId === currentUserId()"
              (reacted)="react($event)"
              (deleted)="removeMessage($event)"
            />
          }
          @if (messages().length === 0) {
            <p class="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {{ 'chat.noMessages' | translate }}
            </p>
          }
        }
      </div>

      <div class="mt-2 h-5 px-1">
        @if (typingLabel()) {
          <p class="animate-fade-in text-xs text-zinc-500 dark:text-zinc-400">{{ typingLabel() }}</p>
        }
      </div>

      @if (pendingMedia()) {
        <div class="mb-2 flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
          <img [src]="pendingMedia()" alt="" class="h-10 w-10 rounded-lg object-cover" />
          <span class="flex-1 text-xs text-zinc-600 dark:text-zinc-400">
            {{ 'chat.imageReady' | translate }}
          </span>
          <button type="button" class="btn-ghost-icon" (click)="pendingMedia.set(null)">
            {{ 'common.cancel' | translate }}
          </button>
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="send()" class="flex gap-2">
        <button
          type="button"
          class="btn-ghost-icon shrink-0"
          [disabled]="uploading()"
          [attr.aria-label]="'posts.addImage' | translate"
          (click)="fileInput.click()"
        >
          <hugeicons-icon [icon]="imageIcon" [size]="18" [strokeWidth]="1.8" />
        </button>
        <input
          #fileInput
          type="file"
          class="hidden"
          accept="image/jpeg,image/png,image/gif,image/webp"
          (change)="onFileSelected($event)"
        />
        <input
          formControlName="content"
          class="field-input flex-1"
          maxlength="4000"
          [placeholder]="'chat.placeholder' | translate"
          (input)="notifyTyping()"
        />
        <button
          type="submit"
          class="inline-flex shrink-0 items-center justify-center rounded-xl bg-accent-700 px-4 text-white transition-all hover:bg-accent-800 active:scale-[0.98] disabled:opacity-50 dark:bg-accent-500 dark:text-zinc-950 dark:hover:bg-accent-400"
          [disabled]="!canSend()"
          [attr.aria-label]="'posts.send' | translate"
        >
          <hugeicons-icon [icon]="sendIcon" [size]="18" [strokeWidth]="1.8" />
        </button>
      </form>
    </div>
  `,
})
export class ChatRoom {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly messagesService = inject(MessagesService);
  private readonly mediaService = inject(MediaService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly socket = inject(ChatSocketService);

  private readonly scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly sendIcon = SentIcon;
  protected readonly imageIcon = Image01Icon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly messages = signal<Message[]>([]);
  protected readonly nextCursor = signal<string | null>(null);
  protected readonly typingUsers = signal<Set<string>>(new Set());
  protected readonly pendingMedia = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly uploading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly chatType = this.route.snapshot.paramMap.get('chatType') as ChatType;
  private readonly chatId = this.route.snapshot.paramMap.get('chatId') ?? '';
  private readonly typingTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private lastTypingSentAt = 0;

  protected readonly currentUserId = computed(() => this.authService.currentUser()?.id ?? null);

  protected readonly typingLabel = computed(() => {
    const count = this.typingUsers().size;
    return count === 0 ? null : count === 1 ? '…' : `${count} …`;
  });

  protected readonly form = this.fb.nonNullable.group({
    content: ['', Validators.maxLength(4000)],
  });

  protected readonly canSend = computed(
    () => this.form.getRawValue().content.trim().length > 0 || this.pendingMedia() !== null,
  );

  constructor() {
    void this.socket.connect().then(() => this.socket.joinChat(this.chatId));

    this.socket.newMessage.pipe(takeUntilDestroyed()).subscribe((message) => {
      if (message.chatId !== this.chatId) {
        return;
      }
      this.messages.set([...this.messages(), message]);
      this.clearTyping(message.senderId);
      this.scrollToBottom();
    });

    this.socket.userTyping.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event.chatId !== this.chatId || event.userId === this.currentUserId()) {
        return;
      }
      const next = new Set(this.typingUsers());
      next.add(event.userId);
      this.typingUsers.set(next);
      clearTimeout(this.typingTimers.get(event.userId));
      this.typingTimers.set(
        event.userId,
        setTimeout(() => this.clearTyping(event.userId), TYPING_TIMEOUT_MS),
      );
    });

    this.socket.messageReaction.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event.chatId !== this.chatId) {
        return;
      }
      this.messages.set(
        this.messages().map((m) =>
          m.id === event.messageId ? { ...m, reactions: event.reactions } : m,
        ),
      );
    });

    this.destroyRef.onDestroy(() => {
      this.socket.leaveChat(this.chatId);
      for (const timer of this.typingTimers.values()) {
        clearTimeout(timer);
      }
    });

    effect(() => {
      if (!this.loading() && this.messages().length) {
        this.scrollToBottom();
      }
    });

    this.loadHistory();
  }

  loadHistory(): void {
    const cursor = this.nextCursor();
    if (cursor) {
      this.loadingMore.set(true);
    }

    this.messagesService
      .history(this.chatType, this.chatId, cursor ? { cursor } : {})
      .subscribe({
        next: (page) => {
          const older = [...page.items].reverse();
          this.messages.set(cursor ? [...older, ...this.messages()] : older);
          this.nextCursor.set(page.nextCursor);
          this.loading.set(false);
          this.loadingMore.set(false);
        },
        error: (err: Error) => {
          this.loading.set(false);
          this.loadingMore.set(false);
          this.errorMessage.set(err.message);
        },
      });
  }

  send(): void {
    if (!this.canSend()) {
      return;
    }
    const content = this.form.getRawValue().content.trim();
    const mediaUrl = this.pendingMedia();

    this.socket.sendMessage({
      chatId: this.chatId,
      chatType: this.chatType,
      ...(content ? { content } : {}),
      ...(mediaUrl ? { mediaUrl, messageType: 'image' as const } : {}),
    });

    this.form.reset();
    this.pendingMedia.set(null);
  }

  notifyTyping(): void {
    const now = Date.now();
    if (now - this.lastTypingSentAt < 1500) {
      return;
    }
    this.lastTypingSentAt = now;
    this.socket.typing(this.chatId);
  }

  react(event: { messageId: string; emoji: string }): void {
    this.socket.react(event.messageId, event.emoji);
  }

  removeMessage(message: Message): void {
    this.messagesService.remove(message.id).subscribe({
      next: () => this.messages.set(this.messages().filter((m) => m.id !== message.id)),
      error: (err: Error) => this.errorMessage.set(err.message),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    this.errorMessage.set(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > IMAGE_MAX_BYTES) {
      this.errorMessage.set('');
      return;
    }

    this.uploading.set(true);
    this.mediaService.upload(file, 'image').subscribe({
      next: (result) => {
        this.uploading.set(false);
        this.pendingMedia.set(result.url);
      },
      error: (err: Error) => {
        this.uploading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  private clearTyping(userId: string): void {
    clearTimeout(this.typingTimers.get(userId));
    this.typingTimers.delete(userId);
    const next = new Set(this.typingUsers());
    next.delete(userId);
    this.typingUsers.set(next);
  }

  private scrollToBottom(): void {
    queueMicrotask(() => {
      const element = this.scroller()?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}

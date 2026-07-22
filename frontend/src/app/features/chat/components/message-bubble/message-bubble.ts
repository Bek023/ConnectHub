import { Component, computed, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  Clock01Icon,
  Delete02Icon,
  Download04Icon,
  Edit02Icon,
  File01Icon,
  RefreshIcon,
  ArrowTurnBackwardIcon,
} from '@hugeicons/core-free-icons';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';
import { ChatMessage } from '../../models/message.model';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉'];

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  host: { class: 'block' },
  imports: [TranslatePipe, HugeiconsIconComponent, Avatar, RelativeTimePipe],
  template: `
    <div class="flex gap-2" [class.flex-row-reverse]="own()">
      @if (!own()) {
        <app-avatar
          [src]="message().sender?.avatarUrl ?? null"
          [name]="message().sender?.displayName ?? ''"
          [size]="32"
        />
      }

      <div class="flex min-w-0 max-w-[75%] flex-col" [class.items-end]="own()">
        @if (!own()) {
          <p class="mb-0.5 px-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {{ message().sender?.displayName }}
          </p>
        }

        <div
          class="group relative rounded-2xl px-3.5 py-2 transition-opacity"
          [class.opacity-60]="message().status === 'sending'"
          [class]="
            own()
              ? 'bg-accent-700 text-white dark:bg-accent-500 dark:text-zinc-950'
              : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
          "
        >
          @if (message().mediaUrl; as media) {
            @switch (message().messageType) {
              @case ('video') {
                <video
                  [src]="media"
                  controls
                  preload="metadata"
                  class="mb-2 max-h-64 w-full rounded-xl bg-black"
                ></video>
              }
              @case ('voice') {
                <audio [src]="media" controls preload="metadata" class="mb-2 w-56"></audio>
              }
              @case ('file') {
                <a
                  [href]="media"
                  target="_blank"
                  rel="noopener"
                  download
                  class="mb-2 flex items-center gap-2 rounded-xl px-2.5 py-2 transition-colors"
                  [class]="
                    own()
                      ? 'bg-white/15 hover:bg-white/25 dark:bg-zinc-950/10 dark:hover:bg-zinc-950/20'
                      : 'bg-zinc-200/70 hover:bg-zinc-300/70 dark:bg-zinc-700/60 dark:hover:bg-zinc-700'
                  "
                >
                  <hugeicons-icon [icon]="fileIcon" [size]="16" [strokeWidth]="1.8" />
                  <span class="min-w-0 flex-1 truncate text-sm">{{ fileName() }}</span>
                  <hugeicons-icon [icon]="downloadIcon" [size]="14" [strokeWidth]="1.8" />
                </a>
              }
              @default {
                <img
                  [src]="media"
                  alt=""
                  loading="lazy"
                  class="mb-2 max-h-64 rounded-xl object-cover"
                />
              }
            }
          }
          @if (parent(); as quoted) {
            <p
              class="mb-1 truncate border-l-2 pl-2 text-xs"
              [class]="
                own()
                  ? 'border-white/40 text-white/80 dark:border-zinc-950/40 dark:text-zinc-950/80'
                  : 'border-zinc-400 text-zinc-600 dark:border-zinc-500 dark:text-zinc-400'
              "
            >
              {{ quoted.sender?.displayName }}: {{ quoted.content }}
            </p>
          }

          @if (editing()) {
            <div class="flex flex-col gap-1.5">
              <input
                #editInput
                [value]="message().content ?? ''"
                maxlength="4000"
                class="w-full rounded-lg bg-white/20 px-2 py-1 text-sm text-inherit outline-none placeholder:text-inherit/60 dark:bg-zinc-950/20"
                (keydown.enter)="commitEdit(editInput.value)"
                (keydown.escape)="editing.set(false)"
              />
              <div class="flex gap-2 text-xs">
                <button type="button" class="font-medium" (click)="commitEdit(editInput.value)">
                  {{ 'common.save' | translate }}
                </button>
                <button type="button" class="opacity-70" (click)="editing.set(false)">
                  {{ 'common.cancel' | translate }}
                </button>
              </div>
            </div>
          } @else if (message().content) {
            <p class="whitespace-pre-wrap break-words text-sm">{{ message().content }}</p>
          }

          <div class="mt-1 flex items-center justify-end gap-1.5">
            @if (message().isEdited) {
              <span
                class="text-[10px]"
                [class]="own() ? 'text-white/70 dark:text-zinc-950/70' : 'text-zinc-500 dark:text-zinc-400'"
              >
                {{ 'chat.edited' | translate }}
              </span>
            }
            @if (own() && readByOthers() && !message().status) {
              <span class="text-[10px] text-white/70 dark:text-zinc-950/70">
                {{ 'chat.read' | translate }}
              </span>
            }
            @if (message().status === 'sending') {
              <span
                class="flex items-center gap-1 text-[10px]"
                [class]="own() ? 'text-white/70 dark:text-zinc-950/70' : 'text-zinc-500 dark:text-zinc-400'"
              >
                <hugeicons-icon [icon]="clockIcon" [size]="10" [strokeWidth]="2" />
                {{ 'chat.sending' | translate }}
              </span>
            } @else {
              <span
                class="text-[10px]"
                [class]="own() ? 'text-white/70 dark:text-zinc-950/70' : 'text-zinc-500 dark:text-zinc-400'"
              >
                {{ message().createdAt | relativeTime }}
              </span>
            }
          </div>

          <div
            class="absolute -top-3 hidden gap-0.5 rounded-full border border-zinc-200 bg-white px-1 py-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
            [class]="own() ? 'left-0' : 'right-0'"
            [class.group-hover:flex]="!message().status"
          >
            @for (emoji of quickReactions; track emoji) {
              <button
                type="button"
                class="rounded-full px-1 text-sm transition-transform hover:scale-125"
                [attr.aria-label]="emoji"
                (click)="reacted.emit({ messageId: message().id, emoji })"
              >
                {{ emoji }}
              </button>
            }
            <button
              type="button"
              class="rounded-full px-1 text-zinc-500 transition-colors hover:text-accent-700 dark:text-zinc-400 dark:hover:text-accent-400"
              [attr.aria-label]="'posts.reply' | translate"
              (click)="replied.emit(message())"
            >
              <hugeicons-icon [icon]="replyIcon" [size]="13" [strokeWidth]="2" />
            </button>
            @if (own()) {
              @if (message().content) {
                <button
                  type="button"
                  class="rounded-full px-1 text-zinc-500 transition-colors hover:text-accent-700 dark:text-zinc-400 dark:hover:text-accent-400"
                  [attr.aria-label]="'posts.edit' | translate"
                  (click)="editing.set(true)"
                >
                  <hugeicons-icon [icon]="editIcon" [size]="13" [strokeWidth]="2" />
                </button>
              }
              <button
                type="button"
                class="rounded-full px-1 text-zinc-500 transition-colors hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                [attr.aria-label]="'chat.deleteMessage' | translate"
                (click)="deleted.emit(message())"
              >
                <hugeicons-icon [icon]="deleteIcon" [size]="13" [strokeWidth]="2" />
              </button>
            }
          </div>
        </div>

        @if (message().status === 'failed') {
          <div class="mt-1 flex items-center gap-2 px-1">
            <span class="text-xs text-red-600 dark:text-red-400">
              {{ 'chat.sendFailed' | translate }}
            </span>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-red-200 px-2 py-0.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 active:scale-95 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
              (click)="retried.emit(message())"
            >
              <hugeicons-icon [icon]="retryIcon" [size]="11" [strokeWidth]="2" />
              {{ 'chat.retry' | translate }}
            </button>
          </div>
        }

        @if (groupedReactions().length) {
          <div class="mt-1 flex flex-wrap gap-1 px-1">
            @for (group of groupedReactions(); track group.emoji) {
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-1.5 py-0.5 text-xs transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                (click)="reacted.emit({ messageId: message().id, emoji: group.emoji })"
              >
                <span>{{ group.emoji }}</span>
                <span class="text-zinc-600 dark:text-zinc-400">{{ group.count }}</span>
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class MessageBubble {
  readonly message = input.required<ChatMessage>();
  readonly own = input(false);
  readonly reacted = output<{ messageId: string; emoji: string }>();
  readonly deleted = output<ChatMessage>();
  readonly retried = output<ChatMessage>();
  readonly replied = output<ChatMessage>();
  readonly editedContent = output<{ messageId: string; content: string }>();
  readonly parent = input<ChatMessage | null>(null);
  readonly readByOthers = input(false);

  protected readonly editing = signal(false);

  protected readonly quickReactions = QUICK_REACTIONS;
  protected readonly deleteIcon = Delete02Icon;
  protected readonly clockIcon = Clock01Icon;
  protected readonly retryIcon = RefreshIcon;
  protected readonly fileIcon = File01Icon;
  protected readonly downloadIcon = Download04Icon;
  protected readonly editIcon = Edit02Icon;
  protected readonly replyIcon = ArrowTurnBackwardIcon;

  protected commitEdit(value: string): void {
    const content = value.trim();
    this.editing.set(false);
    if (content && content !== this.message().content) {
      this.editedContent.emit({ messageId: this.message().id, content });
    }
  }

  protected readonly fileName = computed(() => {
    const url = this.message().mediaUrl;
    if (!url) {
      return '';
    }
    return decodeURIComponent(url.split('/').pop() ?? url);
  });

  protected readonly groupedReactions = computed(() => {
    const reactions = this.message().reactions ?? [];
    const counts = new Map<string, number>();
    for (const reaction of reactions) {
      counts.set(reaction.emoji, (counts.get(reaction.emoji) ?? 0) + 1);
    }
    return [...counts.entries()].map(([emoji, count]) => ({ emoji, count }));
  });
}

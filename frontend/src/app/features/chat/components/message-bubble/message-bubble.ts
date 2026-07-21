import { Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';
import { Message } from '../../models/message.model';

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
          class="group relative rounded-2xl px-3.5 py-2"
          [class]="
            own()
              ? 'bg-accent-700 text-white dark:bg-accent-500 dark:text-zinc-950'
              : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
          "
        >
          @if (message().mediaUrl) {
            <img
              [src]="message().mediaUrl"
              alt=""
              loading="lazy"
              class="mb-2 max-h-64 rounded-xl object-cover"
            />
          }
          @if (message().content) {
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
            <span
              class="text-[10px]"
              [class]="own() ? 'text-white/70 dark:text-zinc-950/70' : 'text-zinc-500 dark:text-zinc-400'"
            >
              {{ message().createdAt | relativeTime }}
            </span>
          </div>

          <div
            class="absolute -top-3 hidden gap-0.5 rounded-full border border-zinc-200 bg-white px-1 py-0.5 shadow-sm group-hover:flex dark:border-zinc-700 dark:bg-zinc-900"
            [class]="own() ? 'left-0' : 'right-0'"
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
            @if (own()) {
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
  readonly message = input.required<Message>();
  readonly own = input(false);
  readonly reacted = output<{ messageId: string; emoji: string }>();
  readonly deleted = output<Message>();

  protected readonly quickReactions = QUICK_REACTIONS;
  protected readonly deleteIcon = Delete02Icon;

  protected readonly groupedReactions = computed(() => {
    const reactions = this.message().reactions ?? [];
    const counts = new Map<string, number>();
    for (const reaction of reactions) {
      counts.set(reaction.emoji, (counts.get(reaction.emoji) ?? 0) + 1);
    }
    return [...counts.entries()].map(([emoji, count]) => ({ emoji, count }));
  });
}

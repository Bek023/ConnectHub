import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  BubbleChatIcon,
  Megaphone01Icon,
  UserGroupIcon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons';
import { ChannelsService } from '../../../../core/services/channels/channels.service';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { ChatTarget } from '../../models/message.model';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, TranslatePipe, HugeiconsIconComponent, EmptyState],
  template: `
    <div class="mx-auto w-full max-w-2xl animate-fade-up">
      <h1 class="mb-5 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ 'nav.chat' | translate }}
      </h1>

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1, 2, 3]; track i) {
            <div class="h-16 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
          }
        </div>
      } @else if (targets().length === 0) {
        <app-empty-state titleKey="chat.empty" hintKey="chat.emptyHint" [icon]="chatIcon" />
      } @else {
        <ul class="space-y-2">
          @for (target of targets(); track target.chatType + target.id) {
            <li>
              <a
                [routerLink]="['/chat', target.chatType, target.id]"
                class="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
                >
                  <hugeicons-icon
                    [icon]="target.chatType === 'group' ? groupIcon : channelIcon"
                    [size]="18"
                    [strokeWidth]="1.8"
                  />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {{ target.name }}
                  </p>
                  <p
                    class="mt-0.5 inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    <hugeicons-icon [icon]="membersIcon" [size]="12" [strokeWidth]="1.8" />
                    {{ target.memberCount }}
                  </p>
                </div>
              </a>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class ChatList {
  private readonly groupsService = inject(GroupsService);
  private readonly channelsService = inject(ChannelsService);

  protected readonly chatIcon = BubbleChatIcon;
  protected readonly groupIcon = UserGroupIcon;
  protected readonly channelIcon = Megaphone01Icon;
  protected readonly membersIcon = UserMultipleIcon;

  protected readonly targets = signal<ChatTarget[]>([]);
  protected readonly loading = signal(true);

  private pending = 2;

  constructor() {
    this.groupsService.my({ limit: 100 }).subscribe({
      next: (page) =>
        this.append(
          page.items.map((g) => ({
            id: g.id,
            chatType: 'group' as const,
            name: g.name,
            avatarUrl: g.avatarUrl,
            memberCount: g.memberCount,
          })),
        ),
      error: () => this.settle(),
    });

    this.channelsService.my({ limit: 100 }).subscribe({
      next: (page) =>
        this.append(
          page.items.map((c) => ({
            id: c.id,
            chatType: 'channel' as const,
            name: c.name,
            avatarUrl: c.avatarUrl,
            memberCount: c.subscriberCount,
          })),
        ),
      error: () => this.settle(),
    });
  }

  private append(items: ChatTarget[]): void {
    this.targets.set([...this.targets(), ...items]);
    this.settle();
  }

  private settle(): void {
    this.pending -= 1;
    if (this.pending <= 0) {
      this.loading.set(false);
    }
  }
}

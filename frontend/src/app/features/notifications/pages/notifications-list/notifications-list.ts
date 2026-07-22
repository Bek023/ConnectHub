import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  Call02Icon,
  Comment01Icon,
  Delete02Icon,
  FavouriteIcon,
  Notification03Icon,
  UserAdd01Icon,
} from '@hugeicons/core-free-icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { NotificationSocketService } from '../../../../core/services/socket/notification-socket.service';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { LoadMore } from '../../../../shared/components/load-more/load-more';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';
import { AppNotification, NotificationType } from '../../models/notification.model';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  host: { class: 'block' },
  imports: [
    TranslatePipe,
    HugeiconsIconComponent,
    Avatar,
    EmptyState,
    LoadMore,
    RelativeTimePipe,
  ],
  template: `
    <div class="mx-auto w-full max-w-3xl animate-fade-up">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'nav.notifications' | translate }}
        </h1>
        @if (unread() > 0) {
          <button type="button" class="link-accent text-sm" (click)="markAllRead()">
            {{ 'notifications.markAllRead' | translate }}
          </button>
        }
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1, 2, 3]; track i) {
            <div class="h-16 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
          }
        </div>
      } @else if (errorMessage()) {
        <p class="field-error" role="alert">
          <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
          {{ errorMessage() }}
        </p>
      } @else if (items().length === 0) {
        <app-empty-state
          titleKey="notifications.empty"
          hintKey="notifications.emptyHint"
          [icon]="bellIcon"
        />
      } @else {
        <ul class="space-y-2">
          @for (item of items(); track item.id) {
            <li>
              <div
                class="flex items-start gap-3 rounded-2xl border p-3.5 transition-colors"
                [class]="
                  item.isRead
                    ? 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                    : 'border-accent-200 bg-accent-50/60 dark:border-accent-500/30 dark:bg-accent-500/10'
                "
              >
                <button
                  type="button"
                  class="flex min-w-0 flex-1 items-start gap-3 text-left"
                  (click)="open(item)"
                >
                  <span class="relative shrink-0">
                    <app-avatar
                      [src]="item.data?.actor?.avatarUrl ?? null"
                      [name]="item.data?.actor?.displayName ?? item.title"
                      [size]="40"
                    />
                    <span
                      class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700"
                    >
                      <hugeicons-icon [icon]="iconFor(item.type)" [size]="11" [strokeWidth]="2" />
                    </span>
                  </span>

                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {{ item.title }}
                    </span>
                    <span class="block truncate text-sm text-zinc-600 dark:text-zinc-400">
                      {{ item.body ? (item.body | translate) : '' }}
                    </span>
                    <span class="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-500">
                      {{ item.createdAt | relativeTime }}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  class="btn-ghost-icon shrink-0"
                  [attr.aria-label]="'notifications.remove' | translate"
                  (click)="remove(item)"
                >
                  <hugeicons-icon [icon]="deleteIcon" [size]="15" [strokeWidth]="1.9" />
                </button>
              </div>
            </li>
          }
        </ul>

        <app-load-more
          [shown]="items().length"
          [total]="total()"
          [loading]="loadingMore()"
          (more)="loadMore()"
        />
      }
    </div>
  `,
})
export class NotificationsList implements OnInit {
  private readonly service = inject(NotificationsService);
  private readonly socket = inject(NotificationSocketService);
  private readonly router = inject(Router);

  protected readonly alertIcon = AlertCircleIcon;
  protected readonly bellIcon = Notification03Icon;
  protected readonly deleteIcon = Delete02Icon;

  protected readonly items = signal<AppNotification[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly unread = this.service.unread;

  constructor() {
    this.socket.notification.pipe(takeUntilDestroyed()).subscribe((notification) => {
      this.items.set([notification, ...this.items()]);
      this.total.update((count) => count + 1);
    });
  }

  ngOnInit(): void {
    void this.socket.connect();
    this.service.list(1).subscribe({
      next: (page) => {
        this.items.set(page.items);
        this.total.set(page.total);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      },
    });
  }

  protected loadMore(): void {
    if (this.loadingMore()) {
      return;
    }
    this.loadingMore.set(true);
    this.page.update((current) => current + 1);
    this.service.list(this.page()).subscribe({
      next: (page) => {
        this.items.set([...this.items(), ...page.items]);
        this.total.set(page.total);
        this.loadingMore.set(false);
      },
      error: (error: Error) => {
        this.page.update((current) => current - 1);
        this.loadingMore.set(false);
        this.errorMessage.set(error.message);
      },
    });
  }

  protected markAllRead(): void {
    this.service.markAllRead().subscribe({
      next: () => this.items.set(this.items().map((item) => ({ ...item, isRead: true }))),
      error: (error: Error) => this.errorMessage.set(error.message),
    });
  }

  protected remove(item: AppNotification): void {
    this.service.remove(item.id).subscribe({
      next: () => {
        this.items.set(this.items().filter((entry) => entry.id !== item.id));
        this.total.update((count) => Math.max(0, count - 1));
        if (!item.isRead) {
          this.service.unread.update((count) => Math.max(0, count - 1));
        }
      },
      error: (error: Error) => this.errorMessage.set(error.message),
    });
  }

  protected open(item: AppNotification): void {
    if (!item.isRead) {
      this.service.markRead(item.id).subscribe({ error: () => undefined });
      this.items.set(
        this.items().map((entry) => (entry.id === item.id ? { ...entry, isRead: true } : entry)),
      );
    }

    const target = this.targetFor(item);
    if (target) {
      void this.router.navigate(target.commands, target.extras);
    }
  }

  protected iconFor(type: NotificationType) {
    switch (type) {
      case 'like':
        return FavouriteIcon;
      case 'comment':
        return Comment01Icon;
      case 'call':
        return Call02Icon;
      case 'group_invite':
        return UserAdd01Icon;
      default:
        return Notification03Icon;
    }
  }

  private targetFor(
    item: AppNotification,
  ): { commands: unknown[]; extras?: Record<string, unknown> } | null {
    const data = item.data;
    if (!data) {
      return null;
    }
    if (data.postId) {
      return { commands: ['/posts', data.postId] };
    }
    if (data.chatId && data.chatType) {
      return { commands: ['/chat', data.chatType, data.chatId] };
    }
    if (data.callId) {
      return { commands: ['/calls', data.callId] };
    }
    return null;
  }
}

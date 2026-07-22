import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  Megaphone01Icon,
  PlusSignIcon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons';
import { ChannelsService } from '../../../../core/services/channels/channels.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import {
  SegmentedTab,
  SegmentedTabs,
} from '../../../../shared/components/segmented-tabs/segmented-tabs';
import { LoadMore } from '../../../../shared/components/load-more/load-more';

const PAGE_SIZE = 20;
import { Channel } from '../../models/channel.model';

@Component({
  selector: 'app-channels-list',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, TranslatePipe, HugeiconsIconComponent, SegmentedTabs, EmptyState, LoadMore],
  template: `
    <div class="mx-auto w-full max-w-3xl animate-fade-up">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'nav.channels' | translate }}
        </h1>
        <a
          routerLink="/channels/create"
          class="inline-flex items-center gap-2 rounded-xl bg-accent-700 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-800 active:scale-[0.98] dark:bg-accent-500 dark:text-zinc-950 dark:hover:bg-accent-400"
        >
          <hugeicons-icon [icon]="plusIcon" [size]="16" [strokeWidth]="2" />
          {{ 'channels.create' | translate }}
        </a>
      </div>

      <app-segmented-tabs [tabs]="tabs" [active]="activeTab()" (changed)="switchTab($event)" />

      <div class="mt-5">
        @if (loading()) {
          <div class="space-y-3">
            @for (i of [1, 2, 3]; track i) {
              <div class="h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
            }
          </div>
        } @else if (errorMessage()) {
          <p class="field-error" role="alert">
            <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
            {{ errorMessage() }}
          </p>
        } @else if (channels().length === 0) {
          <app-empty-state
            [titleKey]="activeTab() === 'my' ? 'channels.emptyMy' : 'channels.empty'"
            [hintKey]="activeTab() === 'my' ? 'channels.emptyMyHint' : null"
            [icon]="channelIcon"
          />
        } @else {
          <ul class="space-y-3">
            @for (channel of channels(); track channel.id) {
              <li>
                <a
                  [routerLink]="['/channels', channel.id]"
                  class="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <span
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
                  >
                    <hugeicons-icon [icon]="channelIcon" [size]="20" [strokeWidth]="1.8" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate font-medium text-zinc-900 dark:text-zinc-100">
                      {{ channel.name }}
                    </p>
                    <p
                      class="mt-0.5 inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400"
                    >
                      <hugeicons-icon [icon]="membersIcon" [size]="14" [strokeWidth]="1.8" />
                      {{ channel.subscriberCount }}
                    </p>
                  </div>
                  @if (subscribedIds().has(channel.id)) {
                    <span
                      class="shrink-0 rounded-full bg-accent-100 px-2.5 py-1 text-xs font-medium text-accent-800 dark:bg-accent-500/15 dark:text-accent-300"
                    >
                      {{ 'channels.subscribed' | translate }}
                    </span>
                  }
                </a>
              </li>
            }
          </ul>

          <app-load-more
            [shown]="channels().length"
            [total]="total()"
            [loading]="loadingMore()"
            (more)="loadMore()"
          />
        }
      </div>
    </div>
  `,
})
export class ChannelsList {
  private readonly channelsService = inject(ChannelsService);

  protected readonly plusIcon = PlusSignIcon;
  protected readonly channelIcon = Megaphone01Icon;
  protected readonly membersIcon = UserMultipleIcon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly tabs: SegmentedTab[] = [
    { value: 'my', labelKey: 'channels.my' },
    { value: 'discover', labelKey: 'channels.discover' },
  ];

  protected readonly activeTab = signal('my');
  protected readonly channels = signal<Channel[]>([]);
  protected readonly subscribedIds = signal<Set<string>>(new Set());
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly total = signal(0);
  protected readonly page = signal(1);

  constructor() {
    this.loadSubscriptions();
    this.load();
  }

  switchTab(tab: string): void {
    if (tab === this.activeTab()) {
      return;
    }
    this.activeTab.set(tab);
    this.page.set(1);
    this.total.set(0);
    this.load();
  }

  private loadSubscriptions(): void {
    this.channelsService.my({ limit: 100 }).subscribe({
      next: (page) => this.subscribedIds.set(new Set(page.items.map((c) => c.id))),
      error: () => undefined,
    });
  }

  loadMore(): void {
    if (this.loadingMore()) {
      return;
    }
    this.loadingMore.set(true);
    this.page.update((current) => current + 1);
    this.request(this.page()).subscribe({
      next: (page) => {
        this.channels.set([...this.channels(), ...page.items]);
        this.total.set(page.total);
        this.rememberOwn(page.items);
        this.loadingMore.set(false);
      },
      error: (err: Error) => {
        this.page.update((current) => current - 1);
        this.loadingMore.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  private request(page: number) {
    return this.activeTab() === 'my'
      ? this.channelsService.my({ page, limit: PAGE_SIZE })
      : this.channelsService.list({ page, limit: PAGE_SIZE });
  }

  private rememberOwn(items: Channel[]): void {
    if (this.activeTab() !== 'my') {
      return;
    }
    const next = new Set(this.subscribedIds());
    for (const item of items) {
      next.add(item.id);
    }
    this.subscribedIds.set(next);
  }

  private load(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const request = this.request(1);

    request.subscribe({
      next: (page) => {
        this.channels.set(page.items);
        this.total.set(page.total);
        this.rememberOwn(page.items);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}

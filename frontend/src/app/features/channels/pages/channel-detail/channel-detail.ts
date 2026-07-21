import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  Megaphone01Icon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ChannelsService } from '../../../../core/services/channels/channels.service';
import { Channel } from '../../models/channel.model';

@Component({
  selector: 'app-channel-detail',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, TranslatePipe, HugeiconsIconComponent],
  template: `
    <div class="mx-auto w-full max-w-2xl animate-fade-up">
      <div class="mb-5 flex items-center gap-3">
        <a
          routerLink="/channels"
          class="btn-ghost-icon"
          [attr.aria-label]="'common.back' | translate"
        >
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'nav.channels' | translate }}
        </h1>
      </div>

      @if (loading()) {
        <div class="h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      } @else if (errorMessage()) {
        <p class="field-error" role="alert">
          <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
          {{ errorMessage() }}
        </p>
      } @else if (channel(); as c) {
        <section
          class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div class="flex items-start gap-4">
            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
            >
              <hugeicons-icon [icon]="channelIcon" [size]="22" [strokeWidth]="1.8" />
            </span>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{{ c.name }}</h2>
              <p
                class="mt-1 inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400"
              >
                <hugeicons-icon [icon]="membersIcon" [size]="14" [strokeWidth]="1.8" />
                {{ c.subscriberCount }}
              </p>
            </div>
            @if (isOwner()) {
              <span
                class="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {{ 'channels.owner' | translate }}
              </span>
            }
          </div>

          @if (c.description) {
            <p class="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {{ c.description }}
            </p>
          }

          <button
            type="button"
            class="mt-5"
            [class]="subscribed() ? 'btn-secondary' : 'btn-primary'"
            [disabled]="busy()"
            (click)="toggleSubscription()"
          >
            {{
              (busy()
                ? 'common.loading'
                : subscribed()
                  ? 'channels.unsubscribe'
                  : 'channels.subscribe'
              ) | translate
            }}
          </button>

          @if (actionError()) {
            <p class="field-error animate-fade-in" role="alert">
              <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
              {{ actionError() }}
            </p>
          }
        </section>

        @if (isOwner() && stats(); as s) {
          <section
            class="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ 'channels.stats' | translate }}
            </h3>
            <p class="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {{ s.subscriberCount }}
            </p>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              {{ 'channels.subscribers' | translate }}
            </p>
          </section>
        }
      }
    </div>
  `,
})
export class ChannelDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly channelsService = inject(ChannelsService);
  private readonly authService = inject(AuthService);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly channelIcon = Megaphone01Icon;
  protected readonly membersIcon = UserMultipleIcon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly channel = signal<Channel | null>(null);
  protected readonly stats = signal<{ subscriberCount: number } | null>(null);
  protected readonly subscribed = signal(false);
  protected readonly loading = signal(true);
  protected readonly busy = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  private readonly channelId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly isOwner = computed(
    () => this.channel()?.createdById === this.authService.currentUser()?.id,
  );

  constructor() {
    this.channelsService.byId(this.channelId).subscribe({
      next: (channel) => {
        this.channel.set(channel);
        this.loading.set(false);
        if (this.isOwner()) {
          this.loadStats();
        }
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });

    this.channelsService.my({ limit: 100 }).subscribe({
      next: (page) => this.subscribed.set(page.items.some((c) => c.id === this.channelId)),
      error: () => undefined,
    });
  }

  toggleSubscription(): void {
    const wasSubscribed = this.subscribed();
    this.busy.set(true);
    this.actionError.set(null);
    this.subscribed.set(!wasSubscribed);

    const request: Observable<unknown> = wasSubscribed
      ? this.channelsService.unsubscribe(this.channelId)
      : this.channelsService.subscribe(this.channelId);

    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.adjustCount(wasSubscribed ? -1 : 1);
      },
      error: (err: Error) => {
        this.busy.set(false);
        this.subscribed.set(wasSubscribed);
        this.actionError.set(err.message);
      },
    });
  }

  private adjustCount(delta: number): void {
    const current = this.channel();
    if (current) {
      this.channel.set({
        ...current,
        subscriberCount: Math.max(0, current.subscriberCount + delta),
      });
    }
    if (this.isOwner()) {
      this.loadStats();
    }
  }

  private loadStats(): void {
    this.channelsService.stats(this.channelId).subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => undefined,
    });
  }
}

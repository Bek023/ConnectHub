import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons';
import { ChannelsService } from '../../../../core/services/channels/channels.service';
import { GoalsService } from '../../../../core/services/goals/goals.service';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import { Channel } from '../../../channels/models/channel.model';
import { Group } from '../../../groups/models/group.model';
import { categoryIcon, categoryLabelKey } from '../../models/goal-category';
import { Goal } from '../../models/goal.model';

@Component({
  selector: 'app-goal-detail',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, TranslatePipe, HugeiconsIconComponent],
  template: `
    <div class="mx-auto w-full max-w-2xl animate-fade-up">
      <div class="mb-5 flex items-center gap-3">
        <a routerLink="/goals" class="btn-ghost-icon" [attr.aria-label]="'common.back' | translate">
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'nav.goals' | translate }}
        </h1>
      </div>

      @if (loading()) {
        <div class="h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      } @else if (errorMessage()) {
        <p class="field-error" role="alert">
          <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
          {{ errorMessage() }}
        </p>
      } @else if (goal(); as g) {
        <section
          class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div class="flex items-start gap-4">
            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
            >
              <hugeicons-icon [icon]="iconFor(g)" [size]="22" [strokeWidth]="1.8" />
            </span>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{{ g.title }}</h2>
              <p class="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span>{{ labelFor(g) | translate }}</span>
                <span aria-hidden="true">&middot;</span>
                <span class="inline-flex items-center gap-1">
                  <hugeicons-icon [icon]="membersIcon" [size]="14" [strokeWidth]="1.8" />
                  {{ g.memberCount }}
                </span>
              </p>
            </div>
          </div>

          @if (g.description) {
            <p class="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {{ g.description }}
            </p>
          }

          <button
            type="button"
            class="mt-5"
            [class]="joined() ? 'btn-secondary' : 'btn-primary'"
            [disabled]="busy()"
            (click)="toggleJoin()"
          >
            {{
              (busy() ? 'common.loading' : joined() ? 'goals.leave' : 'goals.join') | translate
            }}
          </button>

          @if (actionError()) {
            <p class="field-error animate-fade-in" role="alert">
              <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
              {{ actionError() }}
            </p>
          }
        </section>

        <section class="mt-4">
          <h3 class="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ 'nav.groups' | translate }}
          </h3>
          @if (groups().length === 0) {
            <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ 'groups.empty' | translate }}</p>
          } @else {
            <ul class="space-y-2">
              @for (group of groups(); track group.id) {
                <li>
                  <a
                    [routerLink]="['/groups', group.id]"
                    class="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  >
                    <span class="truncate font-medium text-zinc-900 dark:text-zinc-100">
                      {{ group.name }}
                    </span>
                    <span class="shrink-0 text-zinc-500 dark:text-zinc-400">
                      {{ group.memberCount }}
                    </span>
                  </a>
                </li>
              }
            </ul>
          }
        </section>

        <section class="mt-4">
          <h3 class="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ 'nav.channels' | translate }}
          </h3>
          @if (channels().length === 0) {
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              {{ 'channels.empty' | translate }}
            </p>
          } @else {
            <ul class="space-y-2">
              @for (channel of channels(); track channel.id) {
                <li>
                  <a
                    [routerLink]="['/channels', channel.id]"
                    class="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  >
                    <span class="truncate font-medium text-zinc-900 dark:text-zinc-100">
                      {{ channel.name }}
                    </span>
                    <span class="shrink-0 text-zinc-500 dark:text-zinc-400">
                      {{ channel.subscriberCount }}
                    </span>
                  </a>
                </li>
              }
            </ul>
          }
        </section>
      }
    </div>
  `,
})
export class GoalDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly goalsService = inject(GoalsService);
  private readonly groupsService = inject(GroupsService);
  private readonly channelsService = inject(ChannelsService);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly membersIcon = UserMultipleIcon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly goal = signal<Goal | null>(null);
  protected readonly groups = signal<Group[]>([]);
  protected readonly channels = signal<Channel[]>([]);
  protected readonly joined = signal(false);
  protected readonly loading = signal(true);
  protected readonly busy = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  private readonly goalId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly iconFor = (goal: Goal) => categoryIcon(goal.category);
  protected readonly labelFor = (goal: Goal) => categoryLabelKey(goal.category);

  constructor() {
    this.goalsService.byId(this.goalId).subscribe({
      next: (goal) => {
        this.goal.set(goal);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });

    this.goalsService.my().subscribe({
      next: (goals) => this.joined.set(goals.some((g) => g.id === this.goalId)),
      error: () => undefined,
    });

    this.groupsService.list({ goalId: this.goalId, limit: 10 }).subscribe({
      next: (page) => this.groups.set(page.items),
      error: () => undefined,
    });

    this.channelsService.list({ goalId: this.goalId, limit: 10 }).subscribe({
      next: (page) => this.channels.set(page.items),
      error: () => undefined,
    });
  }

  toggleJoin(): void {
    const wasJoined = this.joined();
    this.busy.set(true);
    this.actionError.set(null);
    this.joined.set(!wasJoined);

    const request = wasJoined
      ? this.goalsService.leave(this.goalId)
      : this.goalsService.join(this.goalId);

    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.adjustMemberCount(wasJoined ? -1 : 1);
      },
      error: (err: Error) => {
        this.busy.set(false);
        this.joined.set(wasJoined);
        this.actionError.set(err.message);
      },
    });
  }

  private adjustMemberCount(delta: number): void {
    const current = this.goal();
    if (current) {
      this.goal.set({ ...current, memberCount: Math.max(0, current.memberCount + delta) });
    }
  }
}

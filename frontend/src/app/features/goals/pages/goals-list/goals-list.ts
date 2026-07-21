import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, PlusSignIcon, Target02Icon, UserMultipleIcon } from '@hugeicons/core-free-icons';
import { GoalsService } from '../../../../core/services/goals/goals.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SegmentedTab, SegmentedTabs } from '../../../../shared/components/segmented-tabs/segmented-tabs';
import { categoryIcon, categoryLabelKey } from '../../models/goal-category';
import { Goal } from '../../models/goal.model';

@Component({
  selector: 'app-goals-list',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, TranslatePipe, HugeiconsIconComponent, SegmentedTabs, EmptyState],
  template: `
    <div class="mx-auto w-full max-w-3xl animate-fade-up">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'nav.goals' | translate }}
        </h1>
        <a routerLink="/goals/create" class="inline-flex items-center gap-2 rounded-xl bg-accent-700 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-800 active:scale-[0.98] dark:bg-accent-500 dark:text-zinc-950 dark:hover:bg-accent-400">
          <hugeicons-icon [icon]="plusIcon" [size]="16" [strokeWidth]="2" />
          {{ 'goals.create' | translate }}
        </a>
      </div>

      <app-segmented-tabs [tabs]="tabs" [active]="activeTab()" (changed)="switchTab($event)" />

      <div class="mt-5">
        @if (loading()) {
          <div class="space-y-3">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
            }
          </div>
        } @else if (errorMessage()) {
          <p class="field-error" role="alert">
            <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
            {{ errorMessage() }}
          </p>
        } @else if (goals().length === 0) {
          <app-empty-state
            [titleKey]="activeTab() === 'my' ? 'goals.emptyMy' : 'goals.empty'"
            [hintKey]="activeTab() === 'my' ? 'goals.emptyMyHint' : null"
            [icon]="targetIcon"
          />
        } @else {
          <ul class="space-y-3">
            @for (goal of goals(); track goal.id) {
              <li>
                <a
                  [routerLink]="['/goals', goal.id]"
                  class="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <span
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
                  >
                    <hugeicons-icon [icon]="iconFor(goal)" [size]="20" [strokeWidth]="1.8" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate font-medium text-zinc-900 dark:text-zinc-100">
                      {{ goal.title }}
                    </p>
                    <p class="mt-0.5 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <span>{{ labelFor(goal) | translate }}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span class="inline-flex items-center gap-1">
                        <hugeicons-icon [icon]="membersIcon" [size]="14" [strokeWidth]="1.8" />
                        {{ goal.memberCount }}
                      </span>
                    </p>
                  </div>
                  @if (joinedIds().has(goal.id)) {
                    <span
                      class="shrink-0 rounded-full bg-accent-100 px-2.5 py-1 text-xs font-medium text-accent-800 dark:bg-accent-500/15 dark:text-accent-300"
                    >
                      {{ 'goals.joined' | translate }}
                    </span>
                  }
                </a>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `,
})
export class GoalsList {
  private readonly goalsService = inject(GoalsService);

  protected readonly plusIcon = PlusSignIcon;
  protected readonly targetIcon = Target02Icon;
  protected readonly membersIcon = UserMultipleIcon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly tabs: SegmentedTab[] = [
    { value: 'trending', labelKey: 'goals.trending' },
    { value: 'all', labelKey: 'goals.all' },
    { value: 'my', labelKey: 'goals.my' },
  ];

  protected readonly activeTab = signal('trending');
  protected readonly goals = signal<Goal[]>([]);
  protected readonly joinedIds = signal<Set<string>>(new Set());
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly iconFor = (goal: Goal) => categoryIcon(goal.category);
  protected readonly labelFor = (goal: Goal) => categoryLabelKey(goal.category);

  constructor() {
    this.loadJoined();
    this.load();
  }

  switchTab(tab: string): void {
    if (tab === this.activeTab()) {
      return;
    }
    this.activeTab.set(tab);
    this.load();
  }

  private loadJoined(): void {
    this.goalsService.my().subscribe({
      next: (goals) => this.joinedIds.set(new Set(goals.map((g) => g.id))),
      error: () => undefined,
    });
  }

  private load(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const done = (items: Goal[]) => {
      this.goals.set(items);
      this.loading.set(false);
    };
    const fail = (err: Error) => {
      this.loading.set(false);
      this.errorMessage.set(err.message);
    };

    switch (this.activeTab()) {
      case 'trending':
        this.goalsService.trending(20).subscribe({ next: done, error: fail });
        break;
      case 'my':
        this.goalsService.my().subscribe({
          next: (items) => {
            this.joinedIds.set(new Set(items.map((g) => g.id)));
            done(items);
          },
          error: fail,
        });
        break;
      default:
        this.goalsService.list({ limit: 50 }).subscribe({
          next: (page) => done(page.items),
          error: fail,
        });
    }
  }
}

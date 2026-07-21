import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  PlusSignIcon,
  UserAdd01Icon,
  UserGroupIcon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import {
  SegmentedTab,
  SegmentedTabs,
} from '../../../../shared/components/segmented-tabs/segmented-tabs';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-groups-list',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, TranslatePipe, HugeiconsIconComponent, SegmentedTabs, EmptyState],
  template: `
    <div class="mx-auto w-full max-w-3xl animate-fade-up">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'nav.groups' | translate }}
        </h1>
        <div class="flex gap-2">
          <a
            routerLink="/groups/join"
            class="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <hugeicons-icon [icon]="joinIcon" [size]="16" [strokeWidth]="1.8" />
            {{ 'groups.joinByCode' | translate }}
          </a>
          <a
            routerLink="/groups/create"
            class="inline-flex items-center gap-2 rounded-xl bg-accent-700 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-800 active:scale-[0.98] dark:bg-accent-500 dark:text-zinc-950 dark:hover:bg-accent-400"
          >
            <hugeicons-icon [icon]="plusIcon" [size]="16" [strokeWidth]="2" />
            {{ 'groups.create' | translate }}
          </a>
        </div>
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
        } @else if (groups().length === 0) {
          <app-empty-state
            [titleKey]="activeTab() === 'my' ? 'groups.emptyMy' : 'groups.empty'"
            [hintKey]="activeTab() === 'my' ? 'groups.emptyMyHint' : null"
            [icon]="groupIcon"
          />
        } @else {
          <ul class="space-y-3">
            @for (group of groups(); track group.id) {
              <li>
                <a
                  [routerLink]="['/groups', group.id]"
                  class="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <span
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
                  >
                    <hugeicons-icon [icon]="groupIcon" [size]="20" [strokeWidth]="1.8" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate font-medium text-zinc-900 dark:text-zinc-100">
                      {{ group.name }}
                    </p>
                    <p
                      class="mt-0.5 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
                    >
                      <span class="inline-flex items-center gap-1">
                        <hugeicons-icon [icon]="membersIcon" [size]="14" [strokeWidth]="1.8" />
                        {{ group.memberCount }} / {{ group.maxMembers }}
                      </span>
                      @if (group.isPrivate) {
                        <span aria-hidden="true">&middot;</span>
                        <span>{{ 'groups.private' | translate }}</span>
                      }
                    </p>
                  </div>
                  @if (memberIds().has(group.id)) {
                    <span
                      class="shrink-0 rounded-full bg-accent-100 px-2.5 py-1 text-xs font-medium text-accent-800 dark:bg-accent-500/15 dark:text-accent-300"
                    >
                      {{ 'groups.member' | translate }}
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
export class GroupsList {
  private readonly groupsService = inject(GroupsService);

  protected readonly plusIcon = PlusSignIcon;
  protected readonly joinIcon = UserAdd01Icon;
  protected readonly groupIcon = UserGroupIcon;
  protected readonly membersIcon = UserMultipleIcon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly tabs: SegmentedTab[] = [
    { value: 'my', labelKey: 'groups.my' },
    { value: 'discover', labelKey: 'groups.discover' },
  ];

  protected readonly activeTab = signal('my');
  protected readonly groups = signal<Group[]>([]);
  protected readonly memberIds = signal<Set<string>>(new Set());
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadMembership();
    this.load();
  }

  switchTab(tab: string): void {
    if (tab === this.activeTab()) {
      return;
    }
    this.activeTab.set(tab);
    this.load();
  }

  private loadMembership(): void {
    this.groupsService.my({ limit: 100 }).subscribe({
      next: (page) => this.memberIds.set(new Set(page.items.map((g) => g.id))),
      error: () => undefined,
    });
  }

  private load(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const request =
      this.activeTab() === 'my'
        ? this.groupsService.my({ limit: 50 })
        : this.groupsService.list({ limit: 50 });

    request.subscribe({
      next: (page) => {
        this.groups.set(page.items);
        if (this.activeTab() === 'my') {
          this.memberIds.set(new Set(page.items.map((g) => g.id)));
        }
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  Message01Icon,
  Search01Icon,
  Target02Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { SearchService } from '../../../../core/services/search/search.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';
import { EMPTY_RESULTS, SearchResults } from '../../models/search.model';

const DEBOUNCE_MS = 350;
const MIN_LENGTH = 2;

@Component({
  selector: 'app-search-page',
  standalone: true,
  host: { class: 'block' },
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    HugeiconsIconComponent,
    EmptyState,
    RelativeTimePipe,
  ],
  template: `
    <div class="mx-auto w-full max-w-3xl animate-fade-up">
      <h1 class="mb-4 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ 'search.title' | translate }}
      </h1>

      <div class="relative">
        <span
          class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
        >
          <hugeicons-icon [icon]="searchIcon" [size]="17" [strokeWidth]="1.9" />
        </span>
        <input
          type="search"
          [formControl]="query"
          [attr.aria-label]="'search.title' | translate"
          [placeholder]="'search.placeholder' | translate"
          class="field-input pl-10"
        />
      </div>

      <div class="mt-5">
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
        } @else if (!hasQuery()) {
          <app-empty-state titleKey="search.prompt" hintKey="search.promptHint" [icon]="searchIcon" />
        } @else if (isEmpty()) {
          <app-empty-state titleKey="search.noResults" hintKey="search.noResultsHint" [icon]="searchIcon" />
        } @else {
          @if (results().goals.length) {
            <section class="mb-6">
              <h2 class="mb-2 px-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                {{ 'nav.goals' | translate }}
              </h2>
              <ul class="space-y-2">
                @for (goal of results().goals; track goal.id) {
                  <li>
                    <a [routerLink]="['/goals', goal.id]" class="result-row">
                      <span class="result-icon">
                        <hugeicons-icon [icon]="goalIcon" [size]="17" [strokeWidth]="1.8" />
                      </span>
                      <span class="min-w-0 flex-1">
                        <span class="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {{ goal.title }}
                        </span>
                        @if (goal.description) {
                          <span class="block truncate text-sm text-zinc-500 dark:text-zinc-400">
                            {{ goal.description }}
                          </span>
                        }
                      </span>
                    </a>
                  </li>
                }
              </ul>
            </section>
          }

          @if (results().groups.length) {
            <section class="mb-6">
              <h2 class="mb-2 px-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                {{ 'nav.groups' | translate }}
              </h2>
              <ul class="space-y-2">
                @for (group of results().groups; track group.id) {
                  <li>
                    <a [routerLink]="['/groups', group.id]" class="result-row">
                      <span class="result-icon">
                        <hugeicons-icon [icon]="groupIcon" [size]="17" [strokeWidth]="1.8" />
                      </span>
                      <span class="min-w-0 flex-1">
                        <span class="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {{ group.name }}
                        </span>
                        <span class="block text-sm text-zinc-500 dark:text-zinc-400">
                          {{ 'groups.members' | translate }}: {{ group.member_count }}
                        </span>
                      </span>
                    </a>
                  </li>
                }
              </ul>
            </section>
          }

          @if (results().messages.length) {
            <section>
              <h2 class="mb-2 px-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                {{ 'search.messages' | translate }}
              </h2>
              <ul class="space-y-2">
                @for (message of results().messages; track message.id) {
                  <li>
                    <a
                      [routerLink]="['/chat', message.chat_type, message.chat_id]"
                      class="result-row"
                    >
                      <span class="result-icon">
                        <hugeicons-icon [icon]="messageIcon" [size]="17" [strokeWidth]="1.8" />
                      </span>
                      <span class="min-w-0 flex-1">
                        <span class="block truncate text-sm text-zinc-900 dark:text-zinc-100">
                          {{ message.content }}
                        </span>
                        <span class="block text-xs text-zinc-500 dark:text-zinc-500">
                          {{ message.created_at | relativeTime }}
                        </span>
                      </span>
                    </a>
                  </li>
                }
              </ul>
            </section>
          }
        }
      </div>
    </div>
  `,
})
export class SearchPage {
  private readonly searchService = inject(SearchService);

  protected readonly searchIcon = Search01Icon;
  protected readonly goalIcon = Target02Icon;
  protected readonly groupIcon = UserGroupIcon;
  protected readonly messageIcon = Message01Icon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly query = new FormControl('', { nonNullable: true });

  protected readonly results = signal<SearchResults>(EMPTY_RESULTS);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly hasQuery = signal(false);

  protected readonly isEmpty = computed(() => {
    const current = this.results();
    return !current.goals.length && !current.groups.length && !current.messages.length;
  });

  constructor() {
    this.query.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_MS),
        distinctUntilChanged(),
        switchMap((value) => {
          const term = value.trim();
          this.errorMessage.set('');
          this.hasQuery.set(term.length >= MIN_LENGTH);
          if (term.length < MIN_LENGTH) {
            this.results.set(EMPTY_RESULTS);
            this.loading.set(false);
            return [];
          }
          this.loading.set(true);
          return this.searchService.searchAll(term).pipe(
            catchError((error: Error) => {
              this.errorMessage.set(error.message);
              this.loading.set(false);
              return of(EMPTY_RESULTS);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((results) => {
        this.results.set(results ?? EMPTY_RESULTS);
        this.loading.set(false);
      });
  }
}

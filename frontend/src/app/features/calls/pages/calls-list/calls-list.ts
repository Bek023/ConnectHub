import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, Call02Icon, Video01Icon } from '@hugeicons/core-free-icons';
import { CallsService } from '../../../../core/services/calls/calls.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';
import { Call } from '../../models/call.model';

@Component({
  selector: 'app-calls-list',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, TranslatePipe, HugeiconsIconComponent, EmptyState, RelativeTimePipe],
  template: `
    <div class="mx-auto w-full max-w-3xl animate-fade-up">
      <h1 class="mb-5 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ 'nav.calls' | translate }}
      </h1>

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
      } @else if (calls().length === 0) {
        <app-empty-state
          titleKey="calls.empty"
          hintKey="calls.emptyHint"
          [icon]="callIcon"
        />
      } @else {
        <ul class="space-y-3">
          @for (call of calls(); track call.id) {
            <li
              class="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              >
                <hugeicons-icon
                  [icon]="call.type === 'video' ? videoIcon : callIcon"
                  [size]="18"
                  [strokeWidth]="1.8"
                />
              </span>

              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {{ (call.type === 'video' ? 'calls.videoCall' : 'calls.audioCall') | translate }}
                </p>
                <p class="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                  {{ call.startedAt | relativeTime }}
                  @if (call.initiatorId === myId()) {
                    · {{ 'calls.outgoing' | translate }}
                  } @else {
                    · {{ 'calls.incoming' | translate }}
                  }
                </p>
              </div>

              @if (call.status === 'ongoing') {
                <a
                  [routerLink]="['/calls', call.id]"
                  [queryParams]="{ type: call.type }"
                  class="shrink-0 rounded-xl bg-accent-700 px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-accent-800 active:scale-[0.98] dark:bg-accent-500 dark:text-zinc-950 dark:hover:bg-accent-400"
                >
                  {{ 'calls.rejoin' | translate }}
                </a>
              } @else {
                <span class="shrink-0 text-xs text-zinc-500 dark:text-zinc-500">
                  {{ 'calls.ended' | translate }}
                </span>
              }
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class CallsList implements OnInit {
  private readonly callsService = inject(CallsService);
  private readonly authService = inject(AuthService);

  protected readonly callIcon = Call02Icon;
  protected readonly videoIcon = Video01Icon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly calls = signal<Call[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');

  protected readonly myId = () => this.authService.currentUser()?.id ?? '';

  ngOnInit(): void {
    this.callsService.history().subscribe({
      next: (page) => {
        this.calls.set(page.items);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      },
    });
  }
}

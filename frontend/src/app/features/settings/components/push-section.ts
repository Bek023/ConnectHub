import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { Notification03Icon } from '@hugeicons/core-free-icons';
import { PushService } from '../../../core/services/notifications/push.service';

@Component({
  selector: 'app-push-section',
  standalone: true,
  host: { class: 'block' },
  imports: [TranslatePipe, HugeiconsIconComponent],
  template: `
    <section
      class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div class="flex items-start gap-3">
        <span
          class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
        >
          <hugeicons-icon [icon]="bellIcon" [size]="18" [strokeWidth]="1.8" />
        </span>

        <div class="min-w-0 flex-1">
          <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ 'settings.pushTitle' | translate }}
          </h2>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {{ 'settings.pushHint' | translate }}
          </p>

          @switch (state()) {
            @case ('unsupported') {
              <p class="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
                {{ 'settings.pushUnsupported' | translate }}
              </p>
            }
            @case ('denied') {
              <p class="mt-3 text-sm text-red-600 dark:text-red-400">
                {{ 'settings.pushDenied' | translate }}
              </p>
            }
            @case ('on') {
              <div class="mt-3 flex flex-wrap items-center gap-3">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-2.5 py-1 text-xs font-medium text-accent-800 dark:bg-accent-500/15 dark:text-accent-300"
                >
                  {{ 'settings.pushOn' | translate }}
                </span>
                <button
                  type="button"
                  class="link-accent text-sm"
                  [disabled]="busy()"
                  (click)="disable()"
                >
                  {{ 'settings.pushDisable' | translate }}
                </button>
              </div>
            }
            @default {
              <button
                type="button"
                class="mt-3 inline-flex items-center gap-2 rounded-xl bg-accent-700 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-800 active:scale-[0.98] disabled:opacity-60 dark:bg-accent-500 dark:text-zinc-950 dark:hover:bg-accent-400"
                [disabled]="busy()"
                (click)="enable()"
              >
                {{ (busy() ? 'common.loading' : 'settings.pushEnable') | translate }}
              </button>
            }
          }
        </div>
      </div>
    </section>
  `,
})
export class PushSection implements OnInit {
  private readonly pushService = inject(PushService);

  protected readonly bellIcon = Notification03Icon;
  protected readonly state = this.pushService.state;
  protected readonly busy = this.pushService.busy;

  ngOnInit(): void {
    void this.pushService.refreshState();
  }

  protected enable(): void {
    void this.pushService.enable();
  }

  protected disable(): void {
    void this.pushService.disable();
  }
}

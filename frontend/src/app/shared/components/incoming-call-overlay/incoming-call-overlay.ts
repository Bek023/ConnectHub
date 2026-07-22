import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { CallEnd01Icon, Call02Icon, Video01Icon } from '@hugeicons/core-free-icons';
import { Subscription } from 'rxjs';
import { NotificationSocketService } from '../../../core/services/socket/notification-socket.service';
import { CallsService } from '../../../core/services/calls/calls.service';
import { IncomingCall } from '../../../features/calls/models/call.model';
import { Avatar } from '../avatar/avatar';

@Component({
  selector: 'app-incoming-call-overlay',
  standalone: true,
  imports: [TranslatePipe, HugeiconsIconComponent, Avatar],
  template: `
    @if (call(); as incoming) {
      <div
        class="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
        role="alertdialog"
        aria-live="assertive"
      >
        <div
          class="animate-fade-up flex w-full max-w-md items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40"
        >
          <app-avatar
            [src]="incoming.initiator.avatarUrl"
            [name]="incoming.initiator.displayName"
            [size]="48"
          />

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ incoming.initiator.displayName }}
            </p>
            <p class="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              <hugeicons-icon
                [icon]="incoming.type === 'video' ? videoIcon : callIcon"
                [size]="14"
                [strokeWidth]="1.8"
              />
              {{ (incoming.type === 'video' ? 'calls.videoCall' : 'calls.audioCall') | translate }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 transition-all hover:bg-zinc-300 active:scale-95 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              [attr.aria-label]="'calls.decline' | translate"
              (click)="decline()"
            >
              <hugeicons-icon [icon]="endIcon" [size]="18" [strokeWidth]="1.8" />
            </button>
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-accent-700 text-white transition-all hover:bg-accent-800 active:scale-95 dark:bg-accent-500 dark:text-zinc-950 dark:hover:bg-accent-400"
              [attr.aria-label]="'calls.accept' | translate"
              (click)="accept(incoming)"
            >
              <hugeicons-icon [icon]="callIcon" [size]="18" [strokeWidth]="1.8" />
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class IncomingCallOverlay implements OnInit, OnDestroy {
  private readonly notificationSocket = inject(NotificationSocketService);
  private readonly callsService = inject(CallsService);
  private readonly router = inject(Router);

  private readonly subscriptions = new Subscription();

  protected readonly callIcon = Call02Icon;
  protected readonly videoIcon = Video01Icon;
  protected readonly endIcon = CallEnd01Icon;

  protected readonly call = signal<IncomingCall | null>(null);

  ngOnInit(): void {
    void this.notificationSocket.connect();

    this.subscriptions.add(
      this.notificationSocket.incomingCall.subscribe((incoming) => this.call.set(incoming)),
    );
    this.subscriptions.add(
      this.notificationSocket.callEnded.subscribe((event) => {
        if (this.call()?.callId === event.callId) {
          this.call.set(null);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected accept(incoming: IncomingCall): void {
    this.call.set(null);
    this.callsService.join(incoming.callId).subscribe({
      next: () =>
        void this.router.navigate(['/calls', incoming.callId], {
          queryParams: { type: incoming.type },
        }),
      error: () => undefined,
    });
  }

  protected decline(): void {
    this.call.set(null);
  }
}

import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  CallEnd01Icon,
  Mic01Icon,
  MicOff01Icon,
  Video01Icon,
  VideoOffIcon,
} from '@hugeicons/core-free-icons';
import { Subscription } from 'rxjs';
import { CallSocketService } from '../../../../core/services/socket/call-socket.service';
import { CallsService } from '../../../../core/services/calls/calls.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CallParticipant, CallType, RemotePeer } from '../../models/call.model';
import { VideoTile } from '../../components/video-tile';

@Component({
  selector: 'app-call-room',
  standalone: true,
  host: { class: 'block' },
  imports: [TranslatePipe, HugeiconsIconComponent, VideoTile],
  template: `
    <section class="mx-auto flex min-h-[70vh] max-w-5xl flex-col">
      <header class="flex items-center justify-between gap-3 pb-4">
        <div class="min-w-0">
          <h1 class="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {{ (isVideo() ? 'calls.videoCall' : 'calls.audioCall') | translate }}
          </h1>
          <p class="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            @if (status() === 'active') {
              {{ elapsed() }}
            } @else {
              {{ 'calls.' + status() | translate }}
            }
          </p>
        </div>
        <span
          class="flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            [class]="connected() ? 'bg-accent-500' : 'bg-zinc-400'"
          ></span>
          {{ (connected() ? 'chat.online' : 'chat.offline') | translate }}
        </span>
      </header>

      @if (status() === 'connecting') {
        <div class="grid flex-1 gap-3 sm:grid-cols-2">
          @for (placeholder of [1, 2]; track placeholder) {
            <div class="aspect-video animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
          }
        </div>
      } @else if (status() === 'failed') {
        <div
          class="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700"
        >
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {{ 'calls.failed' | translate }}
          </p>
          <p class="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">{{ error() }}</p>
          <button type="button" class="btn-secondary" (click)="back()">
            {{ 'common.back' | translate }}
          </button>
        </div>
      } @else if (status() === 'ended') {
        <div
          class="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700"
        >
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {{ 'calls.ended' | translate }}
          </p>
          <button type="button" class="btn-secondary" (click)="back()">
            {{ 'common.back' | translate }}
          </button>
        </div>
      } @else {
        <div class="grid flex-1 gap-3" [class]="gridClass()">
          <app-video-tile
            class="animate-fade-up"
            [stream]="localStream()"
            [name]="'calls.you' | translate"
            [avatarUrl]="myAvatar()"
            [hasVideo]="isVideo() && cameraEnabled()"
            [muted]="true"
            [micOn]="micEnabled()"
          />
          @for (peer of peers(); track peer.userId) {
            <app-video-tile
              class="animate-fade-up"
              [stream]="peer.stream"
              [name]="nameFor(peer.userId)"
              [avatarUrl]="avatarFor(peer.userId)"
              [hasVideo]="peer.hasVideo"
            />
          }
          @if (!peers().length) {
            <div
              class="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
            >
              {{ 'calls.waitingForOthers' | translate }}
            </div>
          }
        </div>
      }

      @if (status() === 'active') {
        <div class="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            class="control-btn"
            [class.control-btn-off]="!micEnabled()"
            [attr.aria-label]="(micEnabled() ? 'calls.muteMic' : 'calls.unmuteMic') | translate"
            (click)="toggleMic()"
          >
            <hugeicons-icon
              [icon]="micEnabled() ? micIcon : micOffIcon"
              [size]="20"
              [strokeWidth]="1.8"
            />
          </button>

          @if (isVideo()) {
            <button
              type="button"
              class="control-btn"
              [class.control-btn-off]="!cameraEnabled()"
              [attr.aria-label]="
                (cameraEnabled() ? 'calls.stopCamera' : 'calls.startCamera') | translate
              "
              (click)="toggleCamera()"
            >
              <hugeicons-icon
                [icon]="cameraEnabled() ? videoIcon : videoOffIcon"
                [size]="20"
                [strokeWidth]="1.8"
              />
            </button>
          }

          <button
            type="button"
            class="control-btn control-btn-danger"
            [attr.aria-label]="'calls.leave' | translate"
            (click)="leave()"
          >
            <hugeicons-icon [icon]="endIcon" [size]="20" [strokeWidth]="1.8" />
          </button>
        </div>

        <p class="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-500">
          {{ 'calls.leaveHint' | translate }}
          <button type="button" class="link-accent" (click)="endForEveryone()">
            {{ 'calls.endForEveryone' | translate }}
          </button>
        </p>
      }
    </section>
  `,
})
export class CallRoom implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly callSocket = inject(CallSocketService);
  private readonly callsService = inject(CallsService);
  private readonly authService = inject(AuthService);

  private readonly subscriptions = new Subscription();
  private timer: ReturnType<typeof setInterval> | null = null;
  private startedAt = 0;

  protected readonly micIcon = Mic01Icon;
  protected readonly micOffIcon = MicOff01Icon;
  protected readonly videoIcon = Video01Icon;
  protected readonly videoOffIcon = VideoOffIcon;
  protected readonly endIcon = CallEnd01Icon;

  protected readonly status = signal<'connecting' | 'active' | 'ended' | 'failed'>('connecting');
  protected readonly error = signal('');
  protected readonly localStream = signal<MediaStream | null>(null);
  protected readonly peers = signal<RemotePeer[]>([]);
  protected readonly participants = signal<CallParticipant[]>([]);
  protected readonly seconds = signal(0);

  protected readonly connected = this.callSocket.connected;
  protected readonly micEnabled = this.callSocket.micEnabled;
  protected readonly cameraEnabled = this.callSocket.cameraEnabled;

  private readonly callId = this.route.snapshot.paramMap.get('id') ?? '';
  private readonly callType: CallType =
    (this.route.snapshot.queryParamMap.get('type') as CallType) ?? 'video';

  protected readonly isVideo = computed(() => this.callType === 'video');

  protected readonly myAvatar = computed(() => this.authService.currentUser()?.avatarUrl ?? null);

  protected readonly elapsed = computed(() => {
    const total = this.seconds();
    const minutes = Math.floor(total / 60)
      .toString()
      .padStart(2, '0');
    const secs = (total % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  });

  protected readonly gridClass = computed(() =>
    this.peers().length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
  );

  ngOnInit(): void {
    if (!this.callId) {
      this.fail('missing-call');
      return;
    }

    this.subscriptions.add(this.callSocket.peers.subscribe((peers) => this.peers.set(peers)));
    this.subscriptions.add(this.callSocket.ended.subscribe(() => this.onEnded()));
    this.subscriptions.add(this.callSocket.errors.subscribe((message) => this.error.set(message)));

    this.callsService.participants(this.callId).subscribe({
      next: (items) => this.participants.set(items),
      error: () => this.participants.set([]),
    });

    void this.start();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.stopTimer();
    void this.callSocket.leave();
  }

  protected nameFor(userId: string): string {
    const participant = this.participants().find((item) => item.user.id === userId);
    return participant?.user.displayName ?? participant?.user.username ?? userId.slice(0, 8);
  }

  protected avatarFor(userId: string): string | null {
    return this.participants().find((item) => item.user.id === userId)?.user.avatarUrl ?? null;
  }

  protected toggleMic(): void {
    this.callSocket.toggleMic();
  }

  protected toggleCamera(): void {
    this.callSocket.toggleCamera();
  }

  protected leave(): void {
    void this.callSocket.leave();
    this.callsService.leave(this.callId).subscribe({ error: () => undefined });
    this.back();
  }

  protected endForEveryone(): void {
    this.callSocket.endForEveryone();
  }

  protected back(): void {
    void this.router.navigate(['/calls']);
  }

  private async start(): Promise<void> {
    try {
      const stream = await this.callSocket.join(this.callId, this.callType);
      this.localStream.set(stream);
      this.status.set('active');
      this.startTimer();
    } catch (error) {
      this.fail((error as Error).message);
    }
  }

  private onEnded(): void {
    this.stopTimer();
    this.status.set('ended');
    void this.callSocket.leave();
  }

  private fail(message: string): void {
    this.error.set(message);
    this.status.set('failed');
  }

  private startTimer(): void {
    this.startedAt = Date.now();
    this.timer = setInterval(
      () => this.seconds.set(Math.floor((Date.now() - this.startedAt) / 1000)),
      1000,
    );
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

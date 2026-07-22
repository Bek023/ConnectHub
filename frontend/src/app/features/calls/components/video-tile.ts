import {
  Component,
  ElementRef,
  effect,
  input,
  viewChild,
} from '@angular/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { MicOff01Icon } from '@hugeicons/core-free-icons';
import { Avatar } from '../../../shared/components/avatar/avatar';

@Component({
  selector: 'app-video-tile',
  standalone: true,
  host: { class: 'block' },
  imports: [Avatar, HugeiconsIconComponent],
  template: `
    <div
      class="relative aspect-video overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-zinc-800 transition-shadow duration-300"
      [class.ring-accent-500]="speaking()"
    >
      <video
        #video
        autoplay
        playsinline
        [muted]="muted()"
        class="h-full w-full object-cover"
        [class.invisible]="!hasVideo()"
      ></video>

      @if (!hasVideo()) {
        <div class="absolute inset-0 flex items-center justify-center">
          <app-avatar [src]="avatarUrl()" [name]="name()" [size]="72" />
        </div>
      }

      <div
        class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6"
      >
        <span class="truncate text-sm font-medium text-white">{{ name() }}</span>
        @if (!micOn()) {
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <hugeicons-icon [icon]="micOffIcon" [size]="14" [strokeWidth]="1.8" />
          </span>
        }
      </div>
    </div>
  `,
})
export class VideoTile {
  readonly stream = input<MediaStream | null>(null);
  readonly name = input('');
  readonly avatarUrl = input<string | null>(null);
  readonly hasVideo = input(false);
  readonly muted = input(false);
  readonly micOn = input(true);
  readonly speaking = input(false);

  protected readonly micOffIcon = MicOff01Icon;

  private readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    effect(() => {
      const element = this.video()?.nativeElement;
      const stream = this.stream();
      if (element && element.srcObject !== stream) {
        element.srcObject = stream;
      }
    });
  }
}

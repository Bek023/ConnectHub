import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { Comment01Icon, FavouriteIcon, PinIcon } from '@hugeicons/core-free-icons';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, TranslatePipe, HugeiconsIconComponent, Avatar, RelativeTimePipe],
  template: `
    <article
      class="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div class="flex items-start gap-3">
        <app-avatar
          [src]="post().author.avatarUrl"
          [name]="post().author.displayName"
          [size]="40"
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {{ post().author.displayName }}
          </p>
          <p class="truncate text-xs text-zinc-500 dark:text-zinc-400">
            &#64;{{ post().author.username }} &middot; {{ post().createdAt | relativeTime }}
          </p>
        </div>
        @if (post().isPinned) {
          <span
            class="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-800 dark:bg-accent-500/15 dark:text-accent-300"
          >
            <hugeicons-icon [icon]="pinIcon" [size]="12" [strokeWidth]="2" />
            {{ 'posts.pinned' | translate }}
          </span>
        }
      </div>

      <a [routerLink]="['/posts', post().id]" class="mt-3 block">
        <p class="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
          {{ post().content }}
        </p>
      </a>

      @if (post().mediaUrls?.length) {
        <div
          class="mt-3 grid gap-2"
          [class]="post().mediaUrls!.length > 1 ? 'grid-cols-2' : 'grid-cols-1'"
        >
          @for (url of post().mediaUrls; track url) {
            <img
              [src]="url"
              alt=""
              loading="lazy"
              class="max-h-72 w-full rounded-xl object-cover"
            />
          }
        </div>
      }

      <div class="mt-3 flex items-center gap-1">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors active:scale-95"
          [class]="
            post().isLiked
              ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10'
              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
          "
          [attr.aria-pressed]="post().isLiked"
          (click)="likeToggled.emit(post())"
        >
          <hugeicons-icon [icon]="likeIcon" [size]="17" [strokeWidth]="1.8" />
          {{ post().likeCount }}
        </button>

        <a
          [routerLink]="['/posts', post().id]"
          class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <hugeicons-icon [icon]="commentIcon" [size]="17" [strokeWidth]="1.8" />
          {{ post().commentCount }}
        </a>
      </div>
    </article>
  `,
})
export class PostCard {
  readonly post = input.required<Post>();
  readonly likeToggled = output<Post>();

  protected readonly likeIcon = FavouriteIcon;
  protected readonly commentIcon = Comment01Icon;
  protected readonly pinIcon = PinIcon;
}

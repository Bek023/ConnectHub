import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, Home01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { PostsService } from '../../../../core/services/posts/posts.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PostCard } from '../../components/post-card/post-card';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, TranslatePipe, HugeiconsIconComponent, PostCard, EmptyState],
  template: `
    <div class="mx-auto w-full max-w-2xl animate-fade-up">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'nav.feed' | translate }}
        </h1>
        <a
          routerLink="/posts/create"
          class="inline-flex items-center gap-2 rounded-xl bg-accent-700 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-800 active:scale-[0.98] dark:bg-accent-500 dark:text-zinc-950 dark:hover:bg-accent-400"
        >
          <hugeicons-icon [icon]="plusIcon" [size]="16" [strokeWidth]="2" />
          {{ 'posts.create' | translate }}
        </a>
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1, 2, 3]; track i) {
            <div class="h-36 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
          }
        </div>
      } @else if (errorMessage()) {
        <p class="field-error" role="alert">
          <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
          {{ errorMessage() }}
        </p>
      } @else if (posts().length === 0) {
        <app-empty-state titleKey="posts.empty" hintKey="posts.emptyHint" [icon]="feedIcon" />
      } @else {
        <div class="space-y-3">
          @for (post of posts(); track post.id) {
            <app-post-card [post]="post" (likeToggled)="toggleLike($event)" />
          }
        </div>

        @if (hasMore()) {
          <button
            type="button"
            class="btn-secondary mt-4"
            [disabled]="loadingMore()"
            (click)="loadMore()"
          >
            {{ (loadingMore() ? 'common.loading' : 'common.loadMore') | translate }}
          </button>
        }
      }
    </div>
  `,
})
export class Feed {
  private readonly postsService = inject(PostsService);

  protected readonly plusIcon = PlusSignIcon;
  protected readonly feedIcon = Home01Icon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly posts = signal<Post[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly hasMore = signal(false);

  private page = 1;

  constructor() {
    this.load();
  }

  toggleLike(post: Post): void {
    const wasLiked = post.isLiked === true;
    this.patchPost(post.id, {
      isLiked: !wasLiked,
      likeCount: Math.max(0, post.likeCount + (wasLiked ? -1 : 1)),
    });

    const request = wasLiked
      ? this.postsService.unlike(post.id)
      : this.postsService.like(post.id);

    request.subscribe({
      error: () =>
        this.patchPost(post.id, { isLiked: wasLiked, likeCount: post.likeCount }),
    });
  }

  loadMore(): void {
    this.loadingMore.set(true);
    this.page += 1;
    this.postsService.feed({ page: this.page, limit: 20 }).subscribe({
      next: (result) => {
        this.posts.set([...this.posts(), ...result.items]);
        this.hasMore.set(result.page < result.totalPages);
        this.loadingMore.set(false);
      },
      error: () => {
        this.page -= 1;
        this.loadingMore.set(false);
      },
    });
  }

  private load(): void {
    this.postsService.feed({ page: 1, limit: 20 }).subscribe({
      next: (result) => {
        this.posts.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  private patchPost(id: string, patch: Partial<Post>): void {
    this.posts.set(this.posts().map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
}

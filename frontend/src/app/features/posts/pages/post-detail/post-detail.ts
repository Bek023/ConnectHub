import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  Comment01Icon,
  Delete02Icon,
  FavouriteIcon,
  PinIcon,
  SentIcon,
} from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { PostsService } from '../../../../core/services/posts/posts.service';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';
import { Comment, Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  host: { class: 'block' },
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    HugeiconsIconComponent,
    Avatar,
    RelativeTimePipe,
  ],
  template: `
    <div class="mx-auto w-full max-w-2xl animate-fade-up">
      <div class="mb-5 flex items-center gap-3">
        <a routerLink="/feed" class="btn-ghost-icon" [attr.aria-label]="'common.back' | translate">
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'posts.post' | translate }}
        </h1>
      </div>

      @if (loading()) {
        <div class="h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      } @else if (errorMessage()) {
        <p class="field-error" role="alert">
          <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
          {{ errorMessage() }}
        </p>
      } @else if (post(); as p) {
        <article
          class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div class="flex items-start gap-3">
            <app-avatar [src]="p.author.avatarUrl" [name]="p.author.displayName" [size]="40" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {{ p.author.displayName }}
              </p>
              <p class="truncate text-xs text-zinc-500 dark:text-zinc-400">
                &#64;{{ p.author.username }} &middot; {{ p.createdAt | relativeTime }}
              </p>
            </div>
            @if (p.isPinned) {
              <span
                class="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-800 dark:bg-accent-500/15 dark:text-accent-300"
              >
                <hugeicons-icon [icon]="pinIcon" [size]="12" [strokeWidth]="2" />
                {{ 'posts.pinned' | translate }}
              </span>
            }
          </div>

          <p
            class="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200"
          >
            {{ p.content }}
          </p>

          @if (p.mediaUrls?.length) {
            <div
              class="mt-3 grid gap-2"
              [class]="p.mediaUrls!.length > 1 ? 'grid-cols-2' : 'grid-cols-1'"
            >
              @for (url of p.mediaUrls; track url) {
                <img [src]="url" alt="" loading="lazy" class="w-full rounded-xl object-cover" />
              }
            </div>
          }

          <div class="mt-3 flex items-center gap-1 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors active:scale-95"
              [class]="
                liked()
                  ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
              "
              [attr.aria-pressed]="liked()"
              (click)="toggleLike()"
            >
              <hugeicons-icon [icon]="likeIcon" [size]="17" [strokeWidth]="1.8" />
              {{ p.likeCount }}
            </button>

            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-zinc-500 dark:text-zinc-400"
            >
              <hugeicons-icon [icon]="commentIcon" [size]="17" [strokeWidth]="1.8" />
              {{ p.commentCount }}
            </span>

            @if (isAuthor()) {
              <span class="flex-1"></span>
              <button
                type="button"
                class="btn-ghost-icon"
                [attr.aria-label]="(p.isPinned ? 'posts.unpin' : 'posts.pin') | translate"
                [title]="(p.isPinned ? 'posts.unpin' : 'posts.pin') | translate"
                (click)="togglePin()"
              >
                <hugeicons-icon [icon]="pinIcon" [size]="16" [strokeWidth]="1.8" />
              </button>
              <button
                type="button"
                class="btn-ghost-icon"
                [attr.aria-label]="'posts.delete' | translate"
                [title]="'posts.delete' | translate"
                (click)="removePost()"
              >
                <hugeicons-icon [icon]="deleteIcon" [size]="16" [strokeWidth]="1.8" />
              </button>
            }
          </div>

          @if (actionError()) {
            <p class="field-error animate-fade-in" role="alert">
              <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
              {{ actionError() }}
            </p>
          }
        </article>

        <form [formGroup]="commentForm" (ngSubmit)="submitComment()" class="mt-4 flex gap-2">
          <input
            formControlName="content"
            class="field-input flex-1"
            maxlength="2000"
            [placeholder]="'posts.commentPlaceholder' | translate"
          />
          <button
            type="submit"
            class="inline-flex shrink-0 items-center justify-center rounded-xl bg-accent-700 px-4 text-white transition-all hover:bg-accent-800 active:scale-[0.98] disabled:opacity-50 dark:bg-accent-500 dark:text-zinc-950 dark:hover:bg-accent-400"
            [disabled]="commentForm.invalid || sending()"
            [attr.aria-label]="'posts.send' | translate"
          >
            <hugeicons-icon [icon]="sendIcon" [size]="18" [strokeWidth]="1.8" />
          </button>
        </form>

        <section class="mt-4 space-y-3">
          @for (comment of comments(); track comment.id) {
            <div
              class="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <app-avatar
                [src]="comment.author?.avatarUrl ?? null"
                [name]="comment.author?.displayName ?? ''"
                [size]="32"
              />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {{ comment.author?.displayName }}
                  <span class="ml-1 text-xs font-normal text-zinc-500 dark:text-zinc-400">
                    {{ comment.createdAt | relativeTime }}
                  </span>
                </p>
                <p class="mt-1 whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200">
                  {{ comment.content }}
                </p>
              </div>
              @if (comment.authorId === currentUserId()) {
                <button
                  type="button"
                  class="btn-ghost-icon shrink-0"
                  [attr.aria-label]="'posts.deleteComment' | translate"
                  (click)="removeComment(comment)"
                >
                  <hugeicons-icon [icon]="deleteIcon" [size]="15" [strokeWidth]="1.8" />
                </button>
              }
            </div>
          }

          @if (nextCursor()) {
            <button
              type="button"
              class="btn-secondary"
              [disabled]="loadingComments()"
              (click)="loadComments()"
            >
              {{ (loadingComments() ? 'common.loading' : 'posts.loadMore') | translate }}
            </button>
          }
        </section>
      }
    </div>
  `,
})
export class PostDetail {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly likeIcon = FavouriteIcon;
  protected readonly commentIcon = Comment01Icon;
  protected readonly pinIcon = PinIcon;
  protected readonly deleteIcon = Delete02Icon;
  protected readonly sendIcon = SentIcon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly post = signal<Post | null>(null);
  protected readonly comments = signal<Comment[]>([]);
  protected readonly nextCursor = signal<string | null>(null);
  protected readonly liked = signal(false);
  protected readonly loading = signal(true);
  protected readonly loadingComments = signal(false);
  protected readonly sending = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  private readonly postId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly currentUserId = computed(() => this.authService.currentUser()?.id ?? null);
  protected readonly isAuthor = computed(() => this.post()?.authorId === this.currentUserId());

  protected readonly commentForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  constructor() {
    this.postsService.byId(this.postId).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });

    this.postsService.liked(this.postId).subscribe({
      next: (result) => this.liked.set(result.liked),
      error: () => undefined,
    });

    this.loadComments();
  }

  toggleLike(): void {
    const wasLiked = this.liked();
    this.liked.set(!wasLiked);
    this.adjustLikeCount(wasLiked ? -1 : 1);

    const request = wasLiked
      ? this.postsService.unlike(this.postId)
      : this.postsService.like(this.postId);

    request.subscribe({
      error: (err: Error) => {
        this.liked.set(wasLiked);
        this.adjustLikeCount(wasLiked ? 1 : -1);
        this.actionError.set(err.message);
      },
    });
  }

  togglePin(): void {
    const current = this.post();
    if (!current) {
      return;
    }
    this.actionError.set(null);
    const request = current.isPinned
      ? this.postsService.unpin(this.postId)
      : this.postsService.pin(this.postId);

    request.subscribe({
      next: (updated) => this.post.set({ ...current, ...updated }),
      error: (err: Error) => this.actionError.set(err.message),
    });
  }

  removePost(): void {
    this.actionError.set(null);
    this.postsService.remove(this.postId).subscribe({
      next: () => this.router.navigate(['/feed']),
      error: (err: Error) => this.actionError.set(err.message),
    });
  }

  submitComment(): void {
    if (this.commentForm.invalid) {
      return;
    }
    this.sending.set(true);
    this.actionError.set(null);

    this.postsService
      .addComment(this.postId, { content: this.commentForm.getRawValue().content })
      .subscribe({
        next: (comment) => {
          this.sending.set(false);
          this.commentForm.reset();
          this.comments.set([this.withAuthor(comment), ...this.comments()]);
          this.adjustCommentCount(1);
        },
        error: (err: Error) => {
          this.sending.set(false);
          this.actionError.set(err.message);
        },
      });
  }

  removeComment(comment: Comment): void {
    this.actionError.set(null);
    this.postsService.removeComment(this.postId, comment.id).subscribe({
      next: () => {
        this.comments.set(this.comments().filter((c) => c.id !== comment.id));
        this.adjustCommentCount(-1);
      },
      error: (err: Error) => this.actionError.set(err.message),
    });
  }

  loadComments(): void {
    this.loadingComments.set(true);
    const cursor = this.nextCursor();
    this.postsService.comments(this.postId, cursor ? { cursor } : {}).subscribe({
      next: (page) => {
        this.comments.set(cursor ? [...this.comments(), ...page.items] : page.items);
        this.nextCursor.set(page.nextCursor);
        this.loadingComments.set(false);
      },
      error: () => this.loadingComments.set(false),
    });
  }

  private withAuthor(comment: Comment): Comment {
    if (comment.author) {
      return comment;
    }
    const user = this.authService.currentUser();
    return user ? { ...comment, author: user } : comment;
  }

  private adjustLikeCount(delta: number): void {
    const current = this.post();
    if (current) {
      this.post.set({ ...current, likeCount: Math.max(0, current.likeCount + delta) });
    }
  }

  private adjustCommentCount(delta: number): void {
    const current = this.post();
    if (current) {
      this.post.set({ ...current, commentCount: Math.max(0, current.commentCount + delta) });
    }
  }
}

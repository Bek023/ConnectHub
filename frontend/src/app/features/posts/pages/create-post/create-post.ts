import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  Cancel01Icon,
  Image01Icon,
} from '@hugeicons/core-free-icons';
import { ChannelsService } from '../../../../core/services/channels/channels.service';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_MAX_BYTES,
  MediaService,
} from '../../../../core/services/media/media.service';
import { PostsService } from '../../../../core/services/posts/posts.service';
import { PostChatType } from '../../models/post.model';

interface TargetOption {
  value: string;
  label: string;
  chatType: PostChatType;
}

@Component({
  selector: 'app-create-post',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, HugeiconsIconComponent],
  template: `
    <div class="mx-auto w-full max-w-lg animate-fade-up">
      <div class="mb-6 flex items-center gap-3">
        <a routerLink="/feed" class="btn-ghost-icon" [attr.aria-label]="'common.back' | translate">
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'posts.create' | translate }}
        </h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
        <div>
          <label for="target" class="field-label">{{ 'posts.target' | translate }}</label>
          @if (targets().length === 0) {
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              {{ 'posts.noTargetsHint' | translate }}
            </p>
          } @else {
            <select id="target" formControlName="target" class="field-input">
              <option value="">{{ 'posts.selectTarget' | translate }}</option>
              @for (option of targets(); track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
          }
        </div>

        <div>
          <label for="content" class="field-label">{{ 'posts.content' | translate }}</label>
          <textarea
            id="content"
            formControlName="content"
            rows="5"
            maxlength="4000"
            class="field-input resize-none"
            [placeholder]="'posts.contentPlaceholder' | translate"
          ></textarea>
          <p class="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-400">
            {{ form.getRawValue().content.length }} / 4000
          </p>
        </div>

        <div>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            [disabled]="uploading()"
            (click)="fileInput.click()"
          >
            <hugeicons-icon [icon]="imageIcon" [size]="16" [strokeWidth]="1.8" />
            {{ (uploading() ? 'common.loading' : 'posts.addImage') | translate }}
          </button>
          <input
            #fileInput
            type="file"
            class="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp"
            (change)="onFileSelected($event)"
          />

          @if (mediaUrls().length) {
            <div class="mt-3 grid grid-cols-3 gap-2">
              @for (url of mediaUrls(); track url) {
                <div class="relative">
                  <img [src]="url" alt="" class="h-24 w-full rounded-xl object-cover" />
                  <button
                    type="button"
                    class="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/70 text-white transition-colors hover:bg-zinc-900"
                    [attr.aria-label]="'posts.removeImage' | translate"
                    (click)="removeMedia(url)"
                  >
                    <hugeicons-icon [icon]="cancelIcon" [size]="13" [strokeWidth]="2" />
                  </button>
                </div>
              }
            </div>
          }
        </div>

        @if (errorMessage()) {
          <p class="field-error animate-fade-in" role="alert">
            <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
            {{ errorMessage() }}
          </p>
        }

        <button type="submit" class="btn-primary" [disabled]="form.invalid || saving()">
          {{ (saving() ? 'common.loading' : 'posts.publish') | translate }}
        </button>
      </form>
    </div>
  `,
})
export class CreatePost {
  private readonly fb = inject(FormBuilder);
  private readonly postsService = inject(PostsService);
  private readonly groupsService = inject(GroupsService);
  private readonly channelsService = inject(ChannelsService);
  private readonly mediaService = inject(MediaService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly imageIcon = Image01Icon;
  protected readonly cancelIcon = Cancel01Icon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly targets = signal<TargetOption[]>([]);
  protected readonly mediaUrls = signal<string[]>([]);
  protected readonly saving = signal(false);
  protected readonly uploading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    target: ['', Validators.required],
    content: ['', [Validators.required, Validators.maxLength(4000)]],
  });

  constructor() {
    this.groupsService.my({ limit: 100 }).subscribe({
      next: (page) =>
        this.targets.set([
          ...this.targets(),
          ...page.items.map((g) => ({
            value: `group:${g.id}`,
            label: g.name,
            chatType: 'group' as PostChatType,
          })),
        ]),
      error: () => undefined,
    });

    this.channelsService.my({ limit: 100 }).subscribe({
      next: (page) =>
        this.targets.set([
          ...this.targets(),
          ...page.items.map((c) => ({
            value: `channel:${c.id}`,
            label: c.name,
            chatType: 'channel' as PostChatType,
          })),
        ]),
      error: () => undefined,
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    this.errorMessage.set(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      this.errorMessage.set(this.translate.instant('profile.avatarTypeError'));
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      this.errorMessage.set(this.translate.instant('profile.avatarSizeError'));
      return;
    }

    this.uploading.set(true);
    this.mediaService.upload(file, 'image').subscribe({
      next: (result) => {
        this.uploading.set(false);
        this.mediaUrls.set([...this.mediaUrls(), result.url]);
      },
      error: (err: Error) => {
        this.uploading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  removeMedia(url: string): void {
    this.mediaUrls.set(this.mediaUrls().filter((u) => u !== url));
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const { target, content } = this.form.getRawValue();
    const [chatType, chatId] = target.split(':') as [PostChatType, string];

    this.saving.set(true);
    this.errorMessage.set(null);

    const media = this.mediaUrls();
    this.postsService
      .create({ chatType, chatId, content, ...(media.length ? { mediaUrls: media } : {}) })
      .subscribe({
        next: (post) => {
          this.saving.set(false);
          this.router.navigate(['/posts', post.id]);
        },
        error: (err: Error) => {
          this.saving.set(false);
          this.errorMessage.set(err.message);
        },
      });
  }
}

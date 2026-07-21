import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  Camera01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_MAX_BYTES,
  MediaService,
} from '../../../../core/services/media/media.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { Avatar } from '../../../../shared/components/avatar/avatar';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, HugeiconsIconComponent, Avatar],
  template: `
    <div class="mx-auto w-full max-w-lg animate-fade-up">
      <div class="mb-6 flex items-center gap-3">
        <a routerLink="/profile" class="btn-ghost-icon" [attr.aria-label]="'common.back' | translate">
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'profile.edit' | translate }}
        </h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
        <div class="flex items-center gap-4">
          <app-avatar [src]="avatarUrl()" [name]="form.getRawValue().displayName" [size]="72" />
          <div>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition-all hover:border-zinc-400 hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              [disabled]="uploading()"
              (click)="fileInput.click()"
            >
              <hugeicons-icon [icon]="cameraIcon" [size]="16" [strokeWidth]="1.8" />
              {{ (uploading() ? 'common.loading' : 'profile.changeAvatar') | translate }}
            </button>
            <p class="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              {{ 'profile.avatarHint' | translate }}
            </p>
          </div>
          <input
            #fileInput
            type="file"
            class="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp"
            (change)="onFileSelected($event)"
          />
        </div>

        <div>
          <label for="displayName" class="field-label">{{ 'auth.displayName' | translate }}</label>
          <input id="displayName" formControlName="displayName" class="field-input" />
        </div>

        <div>
          <label for="bio" class="field-label">{{ 'profile.bio' | translate }}</label>
          <textarea
            id="bio"
            formControlName="bio"
            rows="4"
            maxlength="300"
            class="field-input resize-none"
            [placeholder]="'profile.bioPlaceholder' | translate"
          ></textarea>
          <p class="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-400">
            {{ form.getRawValue().bio.length }} / 300
          </p>
        </div>

        @if (errorMessage()) {
          <p class="field-error animate-fade-in" role="alert">
            <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
            {{ errorMessage() }}
          </p>
        }
        @if (savedMessage()) {
          <p
            class="flex animate-fade-in items-center gap-1.5 text-sm text-accent-700 dark:text-accent-400"
            role="status"
          >
            <hugeicons-icon [icon]="checkIcon" [size]="15" [strokeWidth]="1.9" />
            {{ savedMessage() }}
          </p>
        }

        <button type="submit" class="btn-primary" [disabled]="form.invalid || saving()">
          {{ (saving() ? 'common.loading' : 'common.save') | translate }}
        </button>
      </form>
    </div>
  `,
})
export class EditProfile {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly mediaService = inject(MediaService);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  protected readonly saving = signal(false);
  protected readonly uploading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly savedMessage = signal<string | null>(null);
  protected readonly avatarUrl = signal<string | null>(null);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly cameraIcon = Camera01Icon;
  protected readonly alertIcon = AlertCircleIcon;
  protected readonly checkIcon = CheckmarkCircle02Icon;

  protected readonly form = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    bio: ['', Validators.maxLength(300)],
  });

  constructor() {
    const current = this.authService.currentUser();
    if (current) {
      this.applyUser(current);
    }
    this.usersService.getMe().subscribe({
      next: (user) => this.applyUser(user),
      error: (err: Error) => this.errorMessage.set(err.message),
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
    this.savedMessage.set(null);

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
        this.avatarUrl.set(result.url);
      },
      error: (err: Error) => {
        this.uploading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving.set(true);
    this.errorMessage.set(null);
    this.savedMessage.set(null);

    const { displayName, bio } = this.form.getRawValue();
    const avatarUrl = this.avatarUrl();

    this.usersService
      .updateMe({ displayName, bio, ...(avatarUrl ? { avatarUrl } : {}) })
      .subscribe({
        next: (user) => {
          this.saving.set(false);
          this.authService.setCurrentUser(user);
          this.savedMessage.set(this.translate.instant('common.saved'));
          this.router.navigate(['/profile']);
        },
        error: (err: Error) => {
          this.saving.set(false);
          this.errorMessage.set(err.message);
        },
      });
  }

  private applyUser(user: {
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
  }): void {
    this.form.patchValue({ displayName: user.displayName, bio: user.bio ?? '' });
    if (!this.avatarUrl()) {
      this.avatarUrl.set(user.avatarUrl);
    }
  }
}

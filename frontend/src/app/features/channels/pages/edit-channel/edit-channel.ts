import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, ArrowLeft01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { ChannelsService } from '../../../../core/services/channels/channels.service';
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_MAX_BYTES,
  MediaService,
} from '../../../../core/services/media/media.service';
import { Avatar } from '../../../../shared/components/avatar/avatar';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, HugeiconsIconComponent, Avatar],
  template: `
    <div class="mx-auto w-full max-w-lg animate-fade-up">
      <div class="mb-6 flex items-center gap-3">
        <a
          [routerLink]="['/channels', channelId]"
          class="btn-ghost-icon"
          [attr.aria-label]="'common.back' | translate"
        >
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'channels.edit' | translate }}
        </h1>
      </div>

      @if (loading()) {
        <div class="h-64 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
          <div>
            <span class="field-label">{{ 'channels.avatar' | translate }}</span>
            <div class="flex items-center gap-3">
              <app-avatar [src]="avatarUrl()" [name]="form.getRawValue().name" [size]="56" />
              <button
                type="button"
                class="btn-secondary w-auto px-3 py-2 text-sm"
                [disabled]="uploading()"
                (click)="avatarInput.click()"
              >
                {{ (uploading() ? 'common.loading' : 'common.change') | translate }}
              </button>
            </div>
            <input
              #avatarInput
              type="file"
              class="hidden"
              [accept]="acceptImages"
              (change)="onImageSelected($event)"
            />
          </div>

          <div>
            <label for="name" class="field-label">{{ 'channels.name' | translate }}</label>
            <input id="name" formControlName="name" class="field-input" maxlength="200" />
          </div>

          <div>
            <label for="description" class="field-label">
              {{ 'goals.description' | translate }}
            </label>
            <textarea
              id="description"
              formControlName="description"
              rows="4"
              maxlength="1000"
              class="field-input resize-none"
            ></textarea>
          </div>

          @if (errorMessage()) {
            <p class="field-error" role="alert">
              <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
              {{ errorMessage() }}
            </p>
          }

          <button type="submit" class="btn-primary" [disabled]="form.invalid || saving()">
            {{ (saving() ? 'common.loading' : 'common.save') | translate }}
          </button>
        </form>

        <section
          class="mt-8 rounded-2xl border border-red-200 p-4 dark:border-red-500/30"
        >
          <h2 class="text-sm font-semibold text-red-700 dark:text-red-400">
            {{ 'channels.deleteTitle' | translate }}
          </h2>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {{ 'channels.deleteHint' | translate }}
          </p>

          @if (confirmingDelete()) {
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl bg-red-700 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-red-800 active:scale-[0.98] disabled:opacity-60"
                [disabled]="deleting()"
                (click)="remove()"
              >
                <hugeicons-icon [icon]="deleteIcon" [size]="14" [strokeWidth]="1.9" />
                {{ (deleting() ? 'common.loading' : 'common.confirm') | translate }}
              </button>
              <button
                type="button"
                class="btn-secondary w-auto px-3 py-2 text-sm"
                (click)="confirmingDelete.set(false)"
              >
                {{ 'common.cancel' | translate }}
              </button>
            </div>
          } @else {
            <button
              type="button"
              class="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 active:scale-[0.98] dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
              (click)="confirmingDelete.set(true)"
            >
              <hugeicons-icon [icon]="deleteIcon" [size]="14" [strokeWidth]="1.9" />
              {{ 'channels.delete' | translate }}
            </button>
          }
        </section>
      }
    </div>
  `,
})
export class EditChannel {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly channelsService = inject(ChannelsService);
  private readonly mediaService = inject(MediaService);
  private readonly translate = inject(TranslateService);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly alertIcon = AlertCircleIcon;
  protected readonly deleteIcon = Delete02Icon;
  protected readonly acceptImages = ALLOWED_IMAGE_TYPES.join(',');

  protected readonly channelId = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly uploading = signal(false);
  protected readonly deleting = signal(false);
  protected readonly confirmingDelete = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly avatarUrl = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.maxLength(1000)],
  });

  constructor() {
    this.channelsService.byId(this.channelId).subscribe({
      next: (channel) => {
        this.form.patchValue({
          name: channel.name,
          description: channel.description ?? '',
        });
        this.avatarUrl.set(channel.avatarUrl);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      },
    });
  }

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    this.errorMessage.set('');

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      this.errorMessage.set(this.translate.instant('chat.unsupportedType'));
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      this.errorMessage.set(
        this.translate.instant('chat.fileTooLarge', {
          size: Math.round(IMAGE_MAX_BYTES / (1024 * 1024)),
        }),
      );
      return;
    }

    this.uploading.set(true);
    this.mediaService.upload(file, 'image').subscribe({
      next: (result) => {
        this.uploading.set(false);
        this.avatarUrl.set(result.url);
      },
      error: (error: Error) => {
        this.uploading.set(false);
        this.errorMessage.set(error.message);
      },
    });
  }

  protected submit(): void {
    if (this.form.invalid || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.errorMessage.set('');

    const value = this.form.getRawValue();
    this.channelsService
      .update(this.channelId, {
        name: value.name,
        description: value.description || undefined,
        ...(this.avatarUrl() ? { avatarUrl: this.avatarUrl()! } : {}),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          void this.router.navigate(['/channels', this.channelId]);
        },
        error: (error: Error) => {
          this.saving.set(false);
          this.errorMessage.set(error.message);
        },
      });
  }

  protected remove(): void {
    if (this.deleting()) {
      return;
    }
    this.deleting.set(true);
    this.channelsService.remove(this.channelId).subscribe({
      next: () => {
        this.deleting.set(false);
        void this.router.navigate(['/channels']);
      },
      error: (error: Error) => {
        this.deleting.set(false);
        this.errorMessage.set(error.message);
      },
    });
  }
}

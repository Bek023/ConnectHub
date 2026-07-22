import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, ArrowLeft01Icon, Delete02Icon, Image01Icon } from '@hugeicons/core-free-icons';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_MAX_BYTES,
  MediaService,
} from '../../../../core/services/media/media.service';
import { Avatar } from '../../../../shared/components/avatar/avatar';

@Component({
  selector: 'app-edit-group',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, HugeiconsIconComponent, Avatar],
  template: `
    <div class="mx-auto w-full max-w-lg animate-fade-up">
      <div class="mb-6 flex items-center gap-3">
        <a
          [routerLink]="['/groups', groupId]"
          class="btn-ghost-icon"
          [attr.aria-label]="'common.back' | translate"
        >
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'groups.edit' | translate }}
        </h1>
      </div>

      @if (loading()) {
        <div class="h-64 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
          <div>
            <span class="field-label">{{ 'groups.cover' | translate }}</span>
            <div
              class="relative h-28 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
            >
              @if (coverUrl()) {
                <img [src]="coverUrl()" alt="" class="h-full w-full object-cover" />
              }
              <button
                type="button"
                class="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-medium text-zinc-800 shadow-sm transition-colors hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:bg-zinc-900"
                [disabled]="uploading()"
                (click)="coverInput.click()"
              >
                <hugeicons-icon [icon]="imageIcon" [size]="13" [strokeWidth]="1.9" />
                {{ 'common.change' | translate }}
              </button>
            </div>
            <input
              #coverInput
              type="file"
              class="hidden"
              [accept]="acceptImages"
              (change)="onImageSelected($event, 'cover')"
            />
          </div>

          <div>
            <span class="field-label">{{ 'groups.avatar' | translate }}</span>
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
              (change)="onImageSelected($event, 'avatar')"
            />
          </div>

          <div>
            <label for="name" class="field-label">{{ 'groups.name' | translate }}</label>
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

          <label class="flex items-center gap-2.5">
            <input
              type="checkbox"
              formControlName="isPrivate"
              class="h-4 w-4 rounded border-zinc-300 text-accent-700 focus:ring-accent-500 dark:border-zinc-700"
            />
            <span class="text-sm text-zinc-700 dark:text-zinc-300">
              {{ 'groups.private' | translate }}
            </span>
          </label>

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
            {{ 'groups.deleteTitle' | translate }}
          </h2>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {{ 'groups.deleteHint' | translate }}
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
              {{ 'groups.delete' | translate }}
            </button>
          }
        </section>
      }
    </div>
  `,
})
export class EditGroup {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupsService = inject(GroupsService);
  private readonly mediaService = inject(MediaService);
  private readonly translate = inject(TranslateService);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly alertIcon = AlertCircleIcon;
  protected readonly deleteIcon = Delete02Icon;
  protected readonly imageIcon = Image01Icon;
  protected readonly acceptImages = ALLOWED_IMAGE_TYPES.join(',');

  protected readonly groupId = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly uploading = signal(false);
  protected readonly deleting = signal(false);
  protected readonly confirmingDelete = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly avatarUrl = signal<string | null>(null);
  protected readonly coverUrl = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.maxLength(1000)],
    isPrivate: [false],
  });

  constructor() {
    this.groupsService.byId(this.groupId).subscribe({
      next: (group) => {
        this.form.patchValue({
          name: group.name,
          description: group.description ?? '',
          isPrivate: group.isPrivate,
        });
        this.avatarUrl.set(group.avatarUrl);
        this.coverUrl.set(group.coverUrl);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      },
    });
  }

  protected onImageSelected(event: Event, target: 'avatar' | 'cover'): void {
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
        if (target === 'avatar') {
          this.avatarUrl.set(result.url);
        } else {
          this.coverUrl.set(result.url);
        }
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
    this.groupsService
      .update(this.groupId, {
        name: value.name,
        description: value.description || undefined,
        isPrivate: value.isPrivate,
        ...(this.avatarUrl() ? { avatarUrl: this.avatarUrl()! } : {}),
        ...(this.coverUrl() ? { coverUrl: this.coverUrl()! } : {}),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          void this.router.navigate(['/groups', this.groupId]);
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
    this.groupsService.remove(this.groupId).subscribe({
      next: () => {
        this.deleting.set(false);
        void this.router.navigate(['/groups']);
      },
      error: (error: Error) => {
        this.deleting.set(false);
        this.errorMessage.set(error.message);
      },
    });
  }
}

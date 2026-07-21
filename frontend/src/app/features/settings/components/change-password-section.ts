import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Key01Icon,
  ViewIcon,
  ViewOffIcon,
} from '@hugeicons/core-free-icons';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-change-password-section',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, TranslatePipe, HugeiconsIconComponent],
  template: `
    <section
      class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div class="flex items-start gap-3">
        <span
          class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
        >
          <hugeicons-icon [icon]="keyIcon" [size]="18" [strokeWidth]="1.8" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ 'auth.changePassword' | translate }}
          </h2>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {{ 'settings.changePasswordHint' | translate }}
          </p>
          <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
            {{ 'settings.changePasswordLogoutNote' | translate }}
          </p>
        </div>
      </div>

      @if (open()) {
        <form
          [formGroup]="form"
          (ngSubmit)="submit()"
          class="mt-5 animate-fade-up space-y-4 border-t border-zinc-200 pt-5 dark:border-zinc-800"
        >
          <div>
            <label for="currentPassword" class="field-label">
              {{ 'settings.currentPassword' | translate }}
            </label>
            <div class="relative">
              <input
                id="currentPassword"
                [type]="visible() ? 'text' : 'password'"
                autocomplete="current-password"
                formControlName="currentPassword"
                class="field-input pr-11"
              />
              <button
                type="button"
                class="absolute right-1.5 top-1/2 -translate-y-1/2 btn-ghost-icon"
                [attr.aria-label]="
                  (visible() ? 'auth.hidePassword' : 'auth.showPassword') | translate
                "
                (click)="visible.set(!visible())"
              >
                <hugeicons-icon
                  [icon]="visible() ? viewOffIcon : viewIcon"
                  [size]="17"
                  [strokeWidth]="1.8"
                />
              </button>
            </div>
          </div>

          <div>
            <label for="newPassword" class="field-label">{{ 'auth.newPassword' | translate }}</label>
            <input
              id="newPassword"
              [type]="visible() ? 'text' : 'password'"
              autocomplete="new-password"
              formControlName="newPassword"
              class="field-input"
              [placeholder]="'auth.passwordPlaceholder' | translate"
            />
          </div>

          @if (errorMessage()) {
            <p class="field-error animate-fade-in" role="alert">
              <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
              {{ errorMessage() }}
            </p>
          }

          <div class="flex gap-2">
            <button type="submit" class="btn-primary" [disabled]="form.invalid || busy()">
              {{ (busy() ? 'common.loading' : 'common.save') | translate }}
            </button>
            <button type="button" class="btn-secondary" (click)="close()">
              {{ 'common.cancel' | translate }}
            </button>
          </div>
        </form>
      } @else {
        <button type="button" class="btn-secondary mt-4" (click)="open.set(true)">
          {{ 'auth.changePassword' | translate }}
        </button>
      }

      @if (successMessage()) {
        <p
          class="mt-2 flex animate-fade-in items-center gap-1.5 text-sm text-accent-700 dark:text-accent-400"
          role="status"
        >
          <hugeicons-icon [icon]="checkIcon" [size]="15" [strokeWidth]="1.9" />
          {{ successMessage() }}
        </p>
      }
    </section>
  `,
})
export class ChangePasswordSection {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  protected readonly open = signal(false);
  protected readonly busy = signal(false);
  protected readonly visible = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly keyIcon = Key01Icon;
  protected readonly viewIcon = ViewIcon;
  protected readonly viewOffIcon = ViewOffIcon;
  protected readonly alertIcon = AlertCircleIcon;
  protected readonly checkIcon = CheckmarkCircle02Icon;

  protected readonly form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.busy.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.changePassword(this.form.getRawValue()).subscribe({
      next: () => {
        this.busy.set(false);
        this.successMessage.set(this.translate.instant('settings.passwordChanged'));
        this.close();
        this.authService.logout().subscribe(() => this.router.navigate(['/login']));
      },
      error: (err: Error) => {
        this.busy.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  close(): void {
    this.open.set(false);
    this.errorMessage.set(null);
    this.visible.set(false);
    this.form.reset();
  }
}

import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AuthLayout } from '../../components/auth-layout/auth-layout';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, TranslatePipe, HugeiconsIconComponent, AuthLayout],
  template: `
    <app-auth-layout [title]="'auth.newPassword' | translate" backLink="/forgot-password">
      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <div>
          <label for="email" class="field-label">{{ 'auth.email' | translate }}</label>
          <input
            id="email"
            type="email"
            autocomplete="email"
            formControlName="email"
            class="field-input"
            [placeholder]="'auth.emailPlaceholder' | translate"
          />
        </div>

        <div>
          <label for="code" class="field-label">{{ 'auth.confirmationCode' | translate }}</label>
          <input
            id="code"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            formControlName="code"
            class="field-input text-center text-lg font-semibold tracking-[0.35em]"
            placeholder="000000"
          />
        </div>

        <div>
          <label for="newPassword" class="field-label">{{ 'auth.newPassword' | translate }}</label>
          <div class="relative">
            <input
              id="newPassword"
              [type]="passwordVisible() ? 'text' : 'password'"
              autocomplete="new-password"
              formControlName="newPassword"
              class="field-input pr-11"
              [placeholder]="'auth.passwordPlaceholder' | translate"
            />
            <button
              type="button"
              class="absolute right-1.5 top-1/2 -translate-y-1/2 btn-ghost-icon"
              [attr.aria-label]="
                (passwordVisible() ? 'auth.hidePassword' : 'auth.showPassword') | translate
              "
              (click)="passwordVisible.set(!passwordVisible())"
            >
              <hugeicons-icon
                [icon]="passwordVisible() ? viewOffIcon : viewIcon"
                [size]="17"
                [strokeWidth]="1.8"
              />
            </button>
          </div>
        </div>

        @if (errorMessage()) {
          <p class="field-error animate-fade-in" role="alert">
            <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
            {{ errorMessage() }}
          </p>
        }

        <button type="submit" class="btn-primary" [disabled]="form.invalid || loading()">
          {{ (loading() ? 'common.loading' : 'auth.changePassword') | translate }}
        </button>
      </form>
    </app-auth-layout>
  `,
})
export class ResetPassword {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly passwordVisible = signal(false);

  protected readonly viewIcon = ViewIcon;
  protected readonly viewOffIcon = ViewOffIcon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly form = this.fb.nonNullable.group({
    email: [
      (history.state as { email?: string })?.email ?? '',
      [Validators.required, Validators.email],
    ],
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.resetPassword(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}

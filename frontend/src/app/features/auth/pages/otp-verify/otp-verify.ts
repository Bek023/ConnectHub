import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AuthLayout } from '../../components/auth-layout/auth-layout';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, TranslatePipe, HugeiconsIconComponent, AuthLayout],
  template: `
    <app-auth-layout
      [title]="'auth.verifyEmail' | translate"
      [subtitle]="'auth.verifyEmailHint' | translate"
      backLink="/login"
    >
      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <div>
          <label for="code" class="field-label">{{ 'auth.confirmationCode' | translate }}</label>
          <input
            id="code"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            formControlName="code"
            class="field-input text-center text-xl font-semibold tracking-[0.4em]"
            placeholder="000000"
          />
        </div>

        @if (errorMessage()) {
          <p class="field-error animate-fade-in" role="alert">
            <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
            {{ errorMessage() }}
          </p>
        }
        @if (infoMessage()) {
          <p
            class="mt-1.5 flex animate-fade-in items-center gap-1.5 text-sm text-accent-700 dark:text-accent-400"
            role="status"
          >
            <hugeicons-icon [icon]="checkIcon" [size]="15" [strokeWidth]="1.9" />
            {{ infoMessage() }}
          </p>
        }

        <button
          type="submit"
          class="btn-primary"
          [disabled]="form.invalid || loading() || !userId"
        >
          {{ (loading() ? 'common.loading' : 'auth.verify') | translate }}
        </button>

        <button
          type="button"
          class="w-full py-1 text-center text-sm link-accent disabled:opacity-50"
          [disabled]="!userId"
          (click)="resend()"
        >
          {{ 'auth.resendCode' | translate }}
        </button>
      </form>
    </app-auth-layout>
  `,
})
export class OtpVerify {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly infoMessage = signal<string | null>(null);
  protected readonly userId: string | null =
    (history.state as { userId?: string })?.userId ?? null;

  protected readonly alertIcon = AlertCircleIcon;
  protected readonly checkIcon = CheckmarkCircle02Icon;

  protected readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  submit(): void {
    if (this.form.invalid || !this.userId) {
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .verifyEmail({ userId: this.userId, code: this.form.getRawValue().code })
      .subscribe({
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

  resend(): void {
    if (!this.userId) {
      return;
    }
    this.errorMessage.set(null);
    this.authService.resendVerification(this.userId).subscribe({
      next: () => this.infoMessage.set(this.translate.instant('auth.codeResent')),
      error: (err: Error) => this.errorMessage.set(err.message),
    });
  }
}

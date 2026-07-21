import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AuthLayout } from '../../components/auth-layout/auth-layout';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, TranslatePipe, HugeiconsIconComponent, AuthLayout],
  template: `
    <app-auth-layout
      [title]="'auth.resetPassword' | translate"
      [subtitle]="'auth.resetPasswordHint' | translate"
      backLink="/login"
    >
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

        @if (errorMessage()) {
          <p class="field-error animate-fade-in" role="alert">
            <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
            {{ errorMessage() }}
          </p>
        }

        <button type="submit" class="btn-primary" [disabled]="form.invalid || loading()">
          {{ (loading() ? 'common.loading' : 'auth.sendCode') | translate }}
        </button>
      </form>
    </app-auth-layout>
  `,
})
export class ForgotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);
    const email = this.form.getRawValue().email;

    this.authService.forgotPassword({ email }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/reset-password'], { state: { email } });
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AuthLayout } from '../../components/auth-layout/auth-layout';

@Component({
  selector: 'app-two-fa',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, TranslatePipe, HugeiconsIconComponent, AuthLayout],
  template: `
    <app-auth-layout
      [title]="'auth.twoFa' | translate"
      [subtitle]="'auth.twoFaHint' | translate"
      backLink="/login"
    >
      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <div>
          <label for="totpCode" class="field-label">{{ 'auth.confirmationCode' | translate }}</label>
          <input
            id="totpCode"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            formControlName="totpCode"
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

        <button
          type="submit"
          class="btn-primary"
          [disabled]="form.invalid || loading() || !twoFaToken"
        >
          {{ (loading() ? 'common.loading' : 'auth.verify') | translate }}
        </button>
      </form>
    </app-auth-layout>
  `,
})
export class TwoFa {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly twoFaToken: string | null =
    (history.state as { twoFaToken?: string })?.twoFaToken ?? null;

  protected readonly alertIcon = AlertCircleIcon;

  protected readonly form = this.fb.nonNullable.group({
    totpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  submit(): void {
    if (this.form.invalid || !this.twoFaToken) {
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .verify2FaLogin({ twoFaToken: this.twoFaToken, totpCode: this.form.getRawValue().totpCode })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/feed']);
        },
        error: (err: Error) => {
          this.loading.set(false);
          this.errorMessage.set(err.message);
        },
      });
  }
}

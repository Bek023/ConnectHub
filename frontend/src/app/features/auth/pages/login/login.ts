import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AuthLayout } from '../../components/auth-layout/auth-layout';
import { isLoginRequires2FA } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, HugeiconsIconComponent, AuthLayout],
  template: `
    <app-auth-layout [title]="'auth.login' | translate">
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
          <label for="password" class="field-label">{{ 'auth.password' | translate }}</label>
          <div class="relative">
            <input
              id="password"
              [type]="passwordVisible() ? 'text' : 'password'"
              autocomplete="current-password"
              formControlName="password"
              class="field-input pr-11"
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
          {{ (loading() ? 'common.loading' : 'auth.login') | translate }}
        </button>

        <div class="space-y-2 pt-1 text-center text-sm">
          <p class="text-zinc-600 dark:text-zinc-400">
            {{ 'auth.noAccount' | translate }}
            <a routerLink="/register" class="link-accent">{{ 'auth.register' | translate }}</a>
          </p>
          <p>
            <a routerLink="/forgot-password" class="link-accent">
              {{ 'auth.forgotPassword' | translate }}
            </a>
          </p>
        </div>
      </form>
    </app-auth-layout>
  `,
})
export class Login {
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
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (isLoginRequires2FA(response)) {
          this.router.navigate(['/two-fa'], { state: { twoFaToken: response.twoFaToken } });
        } else {
          this.router.navigate(['/feed']);
        }
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}

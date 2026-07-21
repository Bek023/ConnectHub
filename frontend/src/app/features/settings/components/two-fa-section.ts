import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, CheckmarkCircle02Icon, ShieldKeyIcon } from '@hugeicons/core-free-icons';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-two-fa-section',
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
          <hugeicons-icon [icon]="shieldIcon" [size]="18" [strokeWidth]="1.8" />
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ 'settings.twoFa' | translate }}
          </h2>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {{ 'settings.twoFaHint' | translate }}
          </p>
        </div>
        <span
          class="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
          [class]="
            enabled()
              ? 'bg-accent-100 text-accent-800 dark:bg-accent-500/15 dark:text-accent-300'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          "
        >
          {{ (enabled() ? 'settings.enabled' : 'settings.disabled') | translate }}
        </span>
      </div>

      @if (qrCodeUrl(); as qr) {
        <div class="mt-5 animate-fade-up space-y-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
          <p class="text-sm text-zinc-600 dark:text-zinc-400">
            {{ 'settings.twoFaScan' | translate }}
          </p>
          <img
            [src]="qr"
            alt=""
            class="h-44 w-44 rounded-xl bg-white p-2 ring-1 ring-zinc-200 dark:ring-zinc-700"
          />
          <div>
            <label for="setupSecret" class="field-label">{{ 'settings.twoFaSecret' | translate }}</label>
            <code
              id="setupSecret"
              class="block break-all rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {{ secret() }}
            </code>
          </div>
        </div>
      }

      @if (showCodeInput()) {
        <form
          [formGroup]="form"
          (ngSubmit)="confirm()"
          class="mt-5 animate-fade-up space-y-3 border-t border-zinc-200 pt-5 dark:border-zinc-800"
        >
          <div>
            <label for="totpCode" class="field-label">
              {{ 'auth.confirmationCode' | translate }}
            </label>
            <input
              id="totpCode"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              formControlName="totpCode"
              class="field-input text-center text-lg font-semibold tracking-[0.35em]"
              placeholder="000000"
            />
          </div>
          <div class="flex gap-2">
            <button type="submit" class="btn-primary" [disabled]="form.invalid || busy()">
              {{ (busy() ? 'common.loading' : 'common.confirm') | translate }}
            </button>
            <button type="button" class="btn-secondary" (click)="cancel()">
              {{ 'common.cancel' | translate }}
            </button>
          </div>
        </form>
      } @else {
        <button
          type="button"
          class="mt-4"
          [class]="enabled() ? 'btn-secondary' : 'btn-primary'"
          [disabled]="busy()"
          (click)="enabled() ? startDisable() : startSetup()"
        >
          {{
            (busy()
              ? 'common.loading'
              : enabled()
                ? 'settings.twoFaDisable'
                : 'settings.twoFaEnable'
            ) | translate
          }}
        </button>
      }

      @if (errorMessage()) {
        <p class="field-error animate-fade-in" role="alert">
          <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
          {{ errorMessage() }}
        </p>
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
export class TwoFaSection {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);

  protected readonly enabled = computed(
    () => this.authService.currentUser()?.twoFaEnabled ?? false,
  );
  protected readonly busy = signal(false);
  protected readonly secret = signal<string | null>(null);
  protected readonly qrCodeUrl = signal<string | null>(null);
  protected readonly showCodeInput = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly shieldIcon = ShieldKeyIcon;
  protected readonly alertIcon = AlertCircleIcon;
  protected readonly checkIcon = CheckmarkCircle02Icon;

  protected readonly form = this.fb.nonNullable.group({
    totpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  startSetup(): void {
    this.reset();
    this.busy.set(true);
    this.authService.setupTwoFa().subscribe({
      next: (result) => {
        this.busy.set(false);
        this.secret.set(result.secret);
        this.qrCodeUrl.set(result.qrCodeUrl);
        this.showCodeInput.set(true);
      },
      error: (err: Error) => {
        this.busy.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  startDisable(): void {
    this.reset();
    this.showCodeInput.set(true);
  }

  confirm(): void {
    if (this.form.invalid) {
      return;
    }
    this.busy.set(true);
    this.errorMessage.set(null);
    const totpCode = this.form.getRawValue().totpCode;

    if (this.enabled()) {
      this.authService.disableTwoFa({ totpCode }).subscribe({
        next: () => this.finish(false, 'settings.twoFaDisabled'),
        error: (err: Error) => this.fail(err),
      });
      return;
    }

    const secret = this.secret();
    if (!secret) {
      this.busy.set(false);
      return;
    }
    this.authService.enableTwoFa({ secret, totpCode }).subscribe({
      next: () => this.finish(true, 'settings.twoFaEnabled'),
      error: (err: Error) => this.fail(err),
    });
  }

  cancel(): void {
    this.reset();
  }

  private finish(enabled: boolean, messageKey: string): void {
    this.busy.set(false);
    this.successMessage.set(this.translate.instant(messageKey));
    this.showCodeInput.set(false);
    this.secret.set(null);
    this.qrCodeUrl.set(null);
    this.form.reset();

    const user = this.authService.currentUser();
    if (user) {
      this.authService.setCurrentUser({ ...user, twoFaEnabled: enabled });
    } else {
      this.authService.fetchMe().subscribe({ error: () => undefined });
    }
  }

  private fail(err: Error): void {
    this.busy.set(false);
    this.errorMessage.set(err.message);
  }

  private reset(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.secret.set(null);
    this.qrCodeUrl.set(null);
    this.showCodeInput.set(false);
    this.form.reset();
  }
}

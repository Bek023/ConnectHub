import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  Delete02Icon,
  Logout01Icon,
  Moon02Icon,
  PaintBoardIcon,
  Sun01Icon,
  TranslateIcon,
} from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import {
  Language,
  LanguageService,
  SUPPORTED_LANGUAGES,
} from '../../../../core/services/language/language.service';
import { Theme, ThemeService } from '../../../../core/services/theme/theme.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { ChangePasswordSection } from '../../components/change-password-section';
import { TwoFaSection } from '../../components/two-fa-section';
import { PushSection } from '../../components/push-section';

@Component({
  selector: 'app-settings',
  standalone: true,
  host: { class: 'block' },
  imports: [
    TranslatePipe,
    HugeiconsIconComponent,
    TwoFaSection,
    PushSection,
    ChangePasswordSection,
  ],
  template: `
    <div class="mx-auto w-full max-w-2xl animate-fade-up space-y-4">
      <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ 'nav.settings' | translate }}
      </h1>

      <section
        class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div class="flex items-start gap-3">
          <span
            class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
          >
            <hugeicons-icon [icon]="paintIcon" [size]="18" [strokeWidth]="1.8" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ 'common.theme' | translate }}
            </h2>
            <div class="mt-3 flex gap-2">
              @for (option of themeOptions; track option.value) {
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all active:scale-[0.98]"
                  [class]="
                    themeService.theme() === option.value
                      ? 'border-accent-500 bg-accent-50 text-accent-800 dark:border-accent-500/40 dark:bg-accent-500/10 dark:text-accent-300'
                      : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  "
                  [attr.aria-pressed]="themeService.theme() === option.value"
                  (click)="themeService.set(option.value)"
                >
                  <hugeicons-icon [icon]="option.icon" [size]="16" [strokeWidth]="1.8" />
                  {{ option.labelKey | translate }}
                </button>
              }
            </div>
          </div>
        </div>
      </section>

      <section
        class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div class="flex items-start gap-3">
          <span
            class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
          >
            <hugeicons-icon [icon]="translateIcon" [size]="18" [strokeWidth]="1.8" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ 'common.language' | translate }}
            </h2>
            <div class="mt-3 flex gap-2">
              @for (lang of languages; track lang) {
                <button
                  type="button"
                  class="rounded-xl border px-3 py-2 text-sm font-medium transition-all active:scale-[0.98]"
                  [class]="
                    languageService.current() === lang
                      ? 'border-accent-500 bg-accent-50 text-accent-800 dark:border-accent-500/40 dark:bg-accent-500/10 dark:text-accent-300'
                      : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  "
                  [attr.aria-pressed]="languageService.current() === lang"
                  (click)="languageService.use(lang)"
                >
                  {{ 'settings.lang.' + lang | translate }}
                </button>
              }
            </div>
          </div>
        </div>
      </section>

      <app-change-password-section />
      <app-two-fa-section />

      <app-push-section />

      <section
        class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <button
          type="button"
          class="flex w-full items-center gap-3 text-sm font-medium text-zinc-800 transition-colors hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
          (click)="logout()"
        >
          <hugeicons-icon [icon]="logoutIcon" [size]="18" [strokeWidth]="1.8" />
          {{ 'common.logout' | translate }}
        </button>
      </section>

      <section class="rounded-2xl border border-red-300 bg-white p-5 dark:border-red-900/50 dark:bg-zinc-900">
        <div class="flex items-start gap-3">
          <span
            class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
          >
            <hugeicons-icon [icon]="deleteIcon" [size]="18" [strokeWidth]="1.8" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ 'settings.deleteAccount' | translate }}
            </h2>
            <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {{ 'settings.deleteAccountHint' | translate }}
            </p>

            @if (confirmDelete()) {
              <div class="mt-4 animate-fade-up space-y-3">
                <p class="text-sm font-medium text-red-700 dark:text-red-400">
                  {{ 'settings.deleteAccountConfirm' | translate }}
                </p>
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="w-full rounded-xl bg-red-700 py-3 text-sm font-semibold text-white transition-all hover:bg-red-800 active:scale-[0.98] disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500"
                    [disabled]="deleting()"
                    (click)="deleteAccount()"
                  >
                    {{ (deleting() ? 'common.loading' : 'settings.deleteAccountYes') | translate }}
                  </button>
                  <button type="button" class="btn-secondary" (click)="confirmDelete.set(false)">
                    {{ 'common.cancel' | translate }}
                  </button>
                </div>
              </div>
            } @else {
              <button
                type="button"
                class="mt-4 rounded-xl border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-50 active:scale-[0.98] dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-500/10"
                (click)="confirmDelete.set(true)"
              >
                {{ 'settings.deleteAccount' | translate }}
              </button>
            }

            @if (errorMessage()) {
              <p class="field-error animate-fade-in" role="alert">
                <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
                {{ errorMessage() }}
              </p>
            }
          </div>
        </div>
      </section>
    </div>
  `,
})
export class Settings {
  protected readonly themeService = inject(ThemeService);
  protected readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);

  protected readonly confirmDelete = signal(false);
  protected readonly deleting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly paintIcon = PaintBoardIcon;
  protected readonly translateIcon = TranslateIcon;
  protected readonly logoutIcon = Logout01Icon;
  protected readonly deleteIcon = Delete02Icon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly languages: readonly Language[] = SUPPORTED_LANGUAGES;

  protected readonly themeOptions: {
    value: Theme;
    labelKey: string;
    icon: typeof Sun01Icon;
  }[] = [
    { value: 'light', labelKey: 'common.themeLight', icon: Sun01Icon },
    { value: 'dark', labelKey: 'common.themeDark', icon: Moon02Icon },
  ];

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/welcome']));
  }

  deleteAccount(): void {
    this.deleting.set(true);
    this.errorMessage.set(null);
    this.usersService.deleteMe().subscribe({
      next: () => {
        this.deleting.set(false);
        this.authService.logout().subscribe(() => this.router.navigate(['/welcome']));
      },
      error: (err: Error) => {
        this.deleting.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}

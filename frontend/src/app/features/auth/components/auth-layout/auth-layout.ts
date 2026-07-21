import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { LanguageSwitcher } from '../../../../shared/components/language-switcher/language-switcher';
import { ThemeToggle } from '../../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, HugeiconsIconComponent, TranslatePipe, ThemeToggle, LanguageSwitcher],
  template: `
    <div class="flex min-h-[100dvh] flex-col bg-zinc-50 dark:bg-zinc-950">
      <header class="flex items-center justify-between px-5 py-4">
        <a
          [routerLink]="backLink"
          class="btn-ghost-icon"
          [attr.aria-label]="'common.back' | translate"
        >
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <div class="flex items-center gap-2">
          <app-language-switcher />
          <app-theme-toggle />
        </div>
      </header>

      <main class="flex flex-1 items-center justify-center px-5 pb-16">
        <div class="w-full max-w-sm animate-fade-up">
          <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {{ title }}
          </h1>
          @if (subtitle) {
            <p class="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {{ subtitle }}
            </p>
          }
          <div class="mt-7">
            <ng-content />
          </div>
        </div>
      </main>
    </div>
  `,
})
export class AuthLayout {
  @Input({ required: true }) title = '';
  @Input() subtitle?: string;
  @Input() backLink = '/welcome';

  protected readonly backIcon = ArrowLeft01Icon;
}

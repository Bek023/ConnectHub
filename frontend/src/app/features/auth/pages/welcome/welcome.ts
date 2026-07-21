import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  BubbleChatIcon,
  HierarchyIcon,
  Target02Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { LanguageSwitcher } from '../../../../shared/components/language-switcher/language-switcher';
import { ThemeToggle } from '../../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-welcome',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, HugeiconsIconComponent, TranslatePipe, ThemeToggle, LanguageSwitcher],
  template: `
    <div class="flex min-h-[100dvh] flex-col bg-zinc-50 dark:bg-zinc-950">
      <header class="flex items-center justify-between px-5 py-4">
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-white dark:bg-accent-500 dark:text-zinc-950"
          >
            <hugeicons-icon [icon]="brandIcon" [size]="18" [strokeWidth]="2" />
          </div>
          <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ 'app.name' | translate }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <app-language-switcher />
          <app-theme-toggle />
        </div>
      </header>

      <main class="flex flex-1 items-center px-5 pb-12 pt-4">
        <div class="mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2">
          <div class="animate-fade-up">
            <h1
              class="text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 md:text-5xl dark:text-zinc-50"
            >
              {{ 'app.name' | translate }}
            </h1>
            <p
              class="mt-4 max-w-[42ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              {{ 'app.tagline' | translate }}
            </p>

            <div class="mt-8 flex flex-col gap-3 sm:max-w-xs">
              <a routerLink="/login" class="btn-primary text-center">
                {{ 'auth.login' | translate }}
              </a>
              <a routerLink="/register" class="btn-secondary text-center">
                {{ 'auth.register' | translate }}
              </a>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            @for (item of highlights; track item.key) {
              <div
                class="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <span
                  class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
                >
                  <hugeicons-icon [icon]="item.icon" [size]="18" [strokeWidth]="1.8" />
                </span>
                <span class="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {{ item.key | translate }}
                </span>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `,
})
export class Welcome {
  protected readonly brandIcon = HierarchyIcon;

  protected readonly highlights = [
    { key: 'nav.goals', icon: Target02Icon },
    { key: 'nav.groups', icon: UserGroupIcon },
    { key: 'nav.chat', icon: BubbleChatIcon },
  ];
}

import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { GlobalIcon } from '@hugeicons/core-free-icons';
import {
  Language,
  LanguageService,
  SUPPORTED_LANGUAGES,
} from '../../../core/services/language/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [HugeiconsIconComponent, TranslatePipe],
  template: `
    <div class="flex items-center gap-1">
      <hugeicons-icon
        [icon]="globalIcon"
        [size]="16"
        [strokeWidth]="1.8"
        class="text-zinc-400 dark:text-zinc-500"
        [attr.aria-label]="'common.language' | translate"
      />
      @for (lang of languages; track lang) {
        <button
          type="button"
          class="rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors"
          [class]="
            languageService.current() === lang
              ? 'bg-accent-100 text-accent-800 dark:bg-accent-500/15 dark:text-accent-300'
              : 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
          "
          [attr.aria-pressed]="languageService.current() === lang"
          (click)="languageService.use(lang)"
        >
          {{ lang }}
        </button>
      }
    </div>
  `,
})
export class LanguageSwitcher {
  protected readonly languageService = inject(LanguageService);
  protected readonly languages: readonly Language[] = SUPPORTED_LANGUAGES;
  protected readonly globalIcon = GlobalIcon;
}

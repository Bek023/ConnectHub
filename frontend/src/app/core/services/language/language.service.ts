import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'uz' | 'ru' | 'en';

export const SUPPORTED_LANGUAGES: readonly Language[] = ['uz', 'ru', 'en'] as const;

const STORAGE_KEY = 'connecthub_lang';
const DEFAULT_LANGUAGE: Language = 'uz';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  private readonly currentSignal = signal<Language>(DEFAULT_LANGUAGE);
  readonly current = this.currentSignal.asReadonly();

  init(): void {
    this.translate.addLangs([...SUPPORTED_LANGUAGES]);
    this.translate.setFallbackLang(DEFAULT_LANGUAGE);
    this.use(this.resolveInitialLanguage());
  }

  use(language: Language): void {
    this.currentSignal.set(language);
    this.translate.use(language);
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }

  private resolveInitialLanguage(): Language {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
    const browser = navigator.language.split('-')[0] as Language;
    return SUPPORTED_LANGUAGES.includes(browser) ? browser : DEFAULT_LANGUAGE;
  }
}

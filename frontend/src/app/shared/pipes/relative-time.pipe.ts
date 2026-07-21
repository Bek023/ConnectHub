import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, LanguageService } from '../../core/services/language/language.service';

const UNITS: [Intl.RelativeTimeFormatUnit, number, string][] = [
  ['year', 31536000, 'time.years'],
  ['month', 2592000, 'time.months'],
  ['week', 604800, 'time.weeks'],
  ['day', 86400, 'time.days'],
  ['hour', 3600, 'time.hours'],
  ['minute', 60, 'time.minutes'],
  ['second', 1, 'time.seconds'],
];

const INTL_CAPABLE_LOCALES: Language[] = ['ru', 'en'];

const JUST_NOW_THRESHOLD_SECONDS = 45;

@Pipe({ name: 'relativeTime', standalone: true, pure: false })
export class RelativeTimePipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const elapsed = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
    if (elapsed < JUST_NOW_THRESHOLD_SECONDS) {
      return this.translate.instant('time.justNow');
    }

    const locale = this.languageService.current();
    for (const [unit, secondsPerUnit, key] of UNITS) {
      if (elapsed >= secondsPerUnit) {
        const count = Math.floor(elapsed / secondsPerUnit);
        return INTL_CAPABLE_LOCALES.includes(locale)
          ? new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-count, unit)
          : this.translate.instant(key, { count });
      }
    }
    return this.translate.instant('time.justNow');
  }
}

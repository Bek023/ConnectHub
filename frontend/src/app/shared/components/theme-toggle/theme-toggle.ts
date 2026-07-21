import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { Moon02Icon, Sun01Icon } from '@hugeicons/core-free-icons';
import { ThemeService } from '../../../core/services/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [HugeiconsIconComponent, TranslatePipe],
  template: `
    <button
      type="button"
      class="btn-ghost-icon"
      [attr.aria-label]="'common.theme' | translate"
      [title]="'common.theme' | translate"
      (click)="themeService.toggle()"
    >
      <hugeicons-icon
        [icon]="themeService.theme() === 'dark' ? sunIcon : moonIcon"
        [size]="18"
        [strokeWidth]="1.8"
      />
    </button>
  `,
})
export class ThemeToggle {
  protected readonly themeService = inject(ThemeService);
  protected readonly sunIcon = Sun01Icon;
  protected readonly moonIcon = Moon02Icon;
}

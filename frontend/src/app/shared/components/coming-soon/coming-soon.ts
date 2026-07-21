import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { ToolsIcon } from '@hugeicons/core-free-icons';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  host: { class: 'block' },
  imports: [HugeiconsIconComponent, TranslatePipe],
  template: `
    <div class="flex min-h-[60vh] animate-fade-up flex-col items-center justify-center gap-4 px-6">
      <span
        class="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
      >
        <hugeicons-icon [icon]="toolsIcon" [size]="26" [strokeWidth]="1.7" />
      </span>
      <div class="text-center">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {{ titleKey() | translate }}
        </h2>
        <p class="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          {{ 'common.comingSoonHint' | translate }}
        </p>
      </div>
    </div>
  `,
})
export class ComingSoon {
  private readonly route = inject(ActivatedRoute);
  protected readonly toolsIcon = ToolsIcon;

  titleKey(): string {
    const path = this.route.snapshot.routeConfig?.path;
    return path ? `nav.${path}` : 'common.comingSoon';
  }
}

import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface SegmentedTab {
  value: string;
  labelKey: string;
}

@Component({
  selector: 'app-segmented-tabs',
  standalone: true,
  host: { class: 'block' },
  imports: [TranslatePipe],
  template: `
    <div
      class="inline-flex rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900"
      role="tablist"
    >
      @for (tab of tabs(); track tab.value) {
        <button
          type="button"
          role="tab"
          class="rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all active:scale-[0.98]"
          [class]="
            active() === tab.value
              ? 'bg-accent-600 text-white dark:bg-accent-500 dark:text-zinc-950'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
          "
          [attr.aria-selected]="active() === tab.value"
          (click)="changed.emit(tab.value)"
        >
          {{ tab.labelKey | translate }}
        </button>
      }
    </div>
  `,
})
export class SegmentedTabs {
  readonly tabs = input.required<SegmentedTab[]>();
  readonly active = input.required<string>();
  readonly changed = output<string>();
}

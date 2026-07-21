import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { InboxIcon } from '@hugeicons/core-free-icons';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  host: { class: 'block' },
  imports: [HugeiconsIconComponent, TranslatePipe],
  template: `
    <div class="flex animate-fade-up flex-col items-center justify-center gap-3 px-6 py-14">
      <span
        class="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
      >
        <hugeicons-icon [icon]="icon()" [size]="22" [strokeWidth]="1.7" />
      </span>
      <div class="text-center">
        <p class="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {{ titleKey() | translate }}
        </p>
        @if (hintKey()) {
          <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{{ hintKey()! | translate }}</p>
        }
      </div>
    </div>
  `,
})
export class EmptyState {
  readonly titleKey = input.required<string>();
  readonly hintKey = input<string | null>(null);
  readonly icon = input<typeof InboxIcon>(InboxIcon);
}

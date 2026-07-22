import { Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { ArrowDown01Icon, Loading03Icon } from '@hugeicons/core-free-icons';

@Component({
  selector: 'app-load-more',
  standalone: true,
  host: { class: 'block' },
  imports: [TranslatePipe, HugeiconsIconComponent],
  template: `
    @if (hasMore()) {
      <div class="mt-4 flex flex-col items-center gap-1.5">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition-all hover:border-zinc-400 hover:bg-zinc-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
          [disabled]="loading()"
          (click)="more.emit()"
        >
          <hugeicons-icon
            [icon]="loading() ? loadingIcon : arrowIcon"
            [size]="15"
            [strokeWidth]="2"
            [class.animate-spin]="loading()"
          />
          {{ (loading() ? 'common.loading' : 'common.loadMore') | translate }}
        </button>

        <p class="text-xs text-zinc-500 dark:text-zinc-500">
          {{ shown() }} / {{ total() }}
        </p>
      </div>
    }
  `,
})
export class LoadMore {
  readonly shown = input.required<number>();
  readonly total = input.required<number>();
  readonly loading = input(false);
  readonly more = output<void>();

  protected readonly arrowIcon = ArrowDown01Icon;
  protected readonly loadingIcon = Loading03Icon;

  protected readonly hasMore = computed(() => this.shown() < this.total());
}

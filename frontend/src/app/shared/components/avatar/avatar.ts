import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    @if (src() && !failed()) {
      <img
        [src]="src()"
        [alt]="name()"
        [style.width.px]="size()"
        [style.height.px]="size()"
        class="shrink-0 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
        (error)="failed.set(true)"
      />
    } @else {
      <span
        [style.width.px]="size()"
        [style.height.px]="size()"
        [style.fontSize.px]="size() * 0.38"
        class="flex shrink-0 items-center justify-center rounded-full bg-accent-100 font-semibold uppercase text-accent-800 ring-1 ring-accent-200 dark:bg-accent-500/15 dark:text-accent-300 dark:ring-accent-500/20"
      >
        {{ initials() }}
      </span>
    }
  `,
})
export class Avatar {
  readonly src = input<string | null>(null);
  readonly name = input('');
  readonly size = input(40);

  protected readonly failed = signal(false);

  protected readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return '?';
    }
    return parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  });
}

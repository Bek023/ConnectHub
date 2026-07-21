import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { GoalsService } from '../../../../core/services/goals/goals.service';
import { categoryIcon, categoryLabelKey } from '../../models/goal-category';
import { GOAL_CATEGORIES } from '../../models/goal.model';

@Component({
  selector: 'app-create-goal',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, HugeiconsIconComponent],
  template: `
    <div class="mx-auto w-full max-w-lg animate-fade-up">
      <div class="mb-6 flex items-center gap-3">
        <a routerLink="/goals" class="btn-ghost-icon" [attr.aria-label]="'common.back' | translate">
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'goals.create' | translate }}
        </h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
        <div>
          <label for="title" class="field-label">{{ 'goals.title' | translate }}</label>
          <input id="title" formControlName="title" class="field-input" maxlength="200" />
        </div>

        <div>
          <label class="field-label">{{ 'goals.categoryLabel' | translate }}</label>
          <div class="flex flex-wrap gap-2">
            @for (category of categories; track category) {
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all active:scale-[0.98]"
                [class]="
                  form.getRawValue().category === category
                    ? 'border-accent-500 bg-accent-50 text-accent-800 dark:border-accent-500/40 dark:bg-accent-500/10 dark:text-accent-300'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                "
                [attr.aria-pressed]="form.getRawValue().category === category"
                (click)="form.patchValue({ category })"
              >
                <hugeicons-icon [icon]="iconFor(category)" [size]="16" [strokeWidth]="1.8" />
                {{ labelFor(category) | translate }}
              </button>
            }
          </div>
        </div>

        <div>
          <label for="description" class="field-label">{{ 'goals.description' | translate }}</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            maxlength="1000"
            class="field-input resize-none"
          ></textarea>
        </div>

        @if (errorMessage()) {
          <p class="field-error animate-fade-in" role="alert">
            <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
            {{ errorMessage() }}
          </p>
        }

        <button type="submit" class="btn-primary" [disabled]="form.invalid || saving()">
          {{ (saving() ? 'common.loading' : 'common.save') | translate }}
        </button>
      </form>
    </div>
  `,
})
export class CreateGoal {
  private readonly fb = inject(FormBuilder);
  private readonly goalsService = inject(GoalsService);
  private readonly router = inject(Router);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly alertIcon = AlertCircleIcon;
  protected readonly categories = GOAL_CATEGORIES;

  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly iconFor = categoryIcon;
  protected readonly labelFor = categoryLabelKey;

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    category: ['other', Validators.required],
    description: ['', Validators.maxLength(1000)],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving.set(true);
    this.errorMessage.set(null);

    const { title, category, description } = this.form.getRawValue();
    this.goalsService
      .create({ title, category, ...(description ? { description } : {}) })
      .subscribe({
        next: (goal) => {
          this.saving.set(false);
          this.router.navigate(['/goals', goal.id]);
        },
        error: (err: Error) => {
          this.saving.set(false);
          this.errorMessage.set(err.message);
        },
      });
  }
}

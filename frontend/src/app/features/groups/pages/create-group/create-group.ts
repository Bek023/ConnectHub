import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { GoalsService } from '../../../../core/services/goals/goals.service';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import { Goal } from '../../../goals/models/goal.model';

@Component({
  selector: 'app-create-group',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, HugeiconsIconComponent],
  template: `
    <div class="mx-auto w-full max-w-lg animate-fade-up">
      <div class="mb-6 flex items-center gap-3">
        <a routerLink="/groups" class="btn-ghost-icon" [attr.aria-label]="'common.back' | translate">
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'groups.create' | translate }}
        </h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
        <div>
          <label for="goalId" class="field-label">{{ 'groups.goal' | translate }}</label>
          @if (goals().length === 0) {
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              {{ 'groups.noGoalsHint' | translate }}
            </p>
          } @else {
            <select id="goalId" formControlName="goalId" class="field-input">
              <option value="">{{ 'groups.selectGoal' | translate }}</option>
              @for (goal of goals(); track goal.id) {
                <option [value]="goal.id">{{ goal.title }}</option>
              }
            </select>
          }
        </div>

        <div>
          <label for="name" class="field-label">{{ 'groups.name' | translate }}</label>
          <input id="name" formControlName="name" class="field-input" maxlength="200" />
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

        <label class="flex items-center gap-3">
          <input
            type="checkbox"
            formControlName="isPrivate"
            class="h-4 w-4 rounded border-zinc-300 text-accent-600 focus:ring-accent-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <span class="text-sm text-zinc-800 dark:text-zinc-200">
            {{ 'groups.makePrivate' | translate }}
          </span>
        </label>

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
export class CreateGroup {
  private readonly fb = inject(FormBuilder);
  private readonly groupsService = inject(GroupsService);
  private readonly goalsService = inject(GoalsService);
  private readonly router = inject(Router);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly goals = signal<Goal[]>([]);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    goalId: ['', Validators.required],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.maxLength(1000)],
    isPrivate: [false],
  });

  constructor() {
    this.goalsService.list({ limit: 100 }).subscribe({
      next: (page) => this.goals.set(page.items),
      error: () => undefined,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving.set(true);
    this.errorMessage.set(null);

    const { goalId, name, description, isPrivate } = this.form.getRawValue();
    this.groupsService
      .create({ goalId, name, isPrivate, ...(description ? { description } : {}) })
      .subscribe({
        next: (group) => {
          this.saving.set(false);
          this.router.navigate(['/groups', group.id]);
        },
        error: (err: Error) => {
          this.saving.set(false);
          this.errorMessage.set(err.message);
        },
      });
  }
}

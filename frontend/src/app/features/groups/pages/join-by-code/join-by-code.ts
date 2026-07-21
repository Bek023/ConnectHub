import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { AlertCircleIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { GroupsService } from '../../../../core/services/groups/groups.service';

@Component({
  selector: 'app-join-by-code',
  standalone: true,
  host: { class: 'block' },
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, HugeiconsIconComponent],
  template: `
    <div class="mx-auto w-full max-w-md animate-fade-up">
      <div class="mb-6 flex items-center gap-3">
        <a routerLink="/groups" class="btn-ghost-icon" [attr.aria-label]="'common.back' | translate">
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'groups.joinByCode' | translate }}
        </h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <div>
          <label for="code" class="field-label">{{ 'groups.inviteCode' | translate }}</label>
          <input
            id="code"
            formControlName="code"
            class="field-input text-center font-mono text-lg tracking-widest"
            placeholder="a1b2c3d4"
            maxlength="12"
          />
        </div>

        @if (errorMessage()) {
          <p class="field-error animate-fade-in" role="alert">
            <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
            {{ errorMessage() }}
          </p>
        }

        <button type="submit" class="btn-primary" [disabled]="form.invalid || busy()">
          {{ (busy() ? 'common.loading' : 'groups.join') | translate }}
        </button>
      </form>
    </div>
  `,
})
export class JoinByCode {
  private readonly fb = inject(FormBuilder);
  private readonly groupsService = inject(GroupsService);
  private readonly router = inject(Router);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly busy = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(4)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.busy.set(true);
    this.errorMessage.set(null);

    this.groupsService.joinByCode(this.form.getRawValue().code.trim()).subscribe({
      next: (member) => {
        this.busy.set(false);
        this.router.navigate(['/groups', member.groupId]);
      },
      error: (err: Error) => {
        this.busy.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}

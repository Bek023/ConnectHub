import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  PencilEdit02Icon,
  ShieldKeyIcon,
} from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { User } from '../../../auth/models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, DatePipe, TranslatePipe, HugeiconsIconComponent, Avatar],
  template: `
    <div class="mx-auto w-full max-w-2xl animate-fade-up">
      @if (loading()) {
        <div class="space-y-4">
          <div class="h-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
          <div class="h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
        </div>
      } @else if (errorMessage()) {
        <p class="field-error" role="alert">
          <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
          {{ errorMessage() }}
        </p>
      } @else if (user(); as profile) {
        <section
          class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div class="flex items-start gap-4">
            <app-avatar [src]="profile.avatarUrl" [name]="profile.displayName" [size]="72" />
            <div class="min-w-0 flex-1">
              <h1 class="truncate text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {{ profile.displayName }}
              </h1>
              <p class="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400">
                &#64;{{ profile.username }}
              </p>
              @if (profile.bio) {
                <p class="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {{ profile.bio }}
                </p>
              }
            </div>
            <a
              routerLink="/profile/edit"
              class="btn-ghost-icon"
              [attr.aria-label]="'profile.edit' | translate"
              [title]="'profile.edit' | translate"
            >
              <hugeicons-icon [icon]="editIcon" [size]="18" [strokeWidth]="1.8" />
            </a>
          </div>
        </section>

        <section
          class="mt-4 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div class="flex items-center gap-3 p-4">
            <hugeicons-icon
              [icon]="mailIcon"
              [size]="18"
              [strokeWidth]="1.8"
              class="text-zinc-400 dark:text-zinc-500"
            />
            <span class="flex-1 text-sm text-zinc-700 dark:text-zinc-300">{{ profile.email }}</span>
            @if (profile.isVerified) {
              <span
                class="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-800 dark:bg-accent-500/15 dark:text-accent-300"
              >
                <hugeicons-icon [icon]="checkIcon" [size]="12" [strokeWidth]="2" />
                {{ 'profile.verified' | translate }}
              </span>
            }
          </div>

          <div class="flex items-center gap-3 p-4">
            <hugeicons-icon
              [icon]="shieldIcon"
              [size]="18"
              [strokeWidth]="1.8"
              class="text-zinc-400 dark:text-zinc-500"
            />
            <span class="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
              {{ 'settings.twoFa' | translate }}
            </span>
            <span class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {{ (profile.twoFaEnabled ? 'settings.enabled' : 'settings.disabled') | translate }}
            </span>
          </div>

          <div class="flex items-center gap-3 p-4">
            <span class="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
              {{ 'profile.joined' | translate }}
            </span>
            <span class="text-sm text-zinc-500 dark:text-zinc-400">
              {{ profile.createdAt | date: 'mediumDate' }}
            </span>
          </div>
        </section>
      }
    </div>
  `,
})
export class Profile {
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);

  protected readonly user = signal<User | null>(this.authService.currentUser());
  protected readonly loading = signal(!this.authService.currentUser());
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly editIcon = PencilEdit02Icon;
  protected readonly mailIcon = Mail01Icon;
  protected readonly shieldIcon = ShieldKeyIcon;
  protected readonly checkIcon = CheckmarkCircle02Icon;
  protected readonly alertIcon = AlertCircleIcon;

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(this.user() === null);
    this.usersService.getMe().subscribe({
      next: (user) => {
        this.user.set(user);
        this.authService.setCurrentUser(user);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.loading.set(false);
        if (!this.user()) {
          this.errorMessage.set(err.message);
        }
      },
    });
  }
}

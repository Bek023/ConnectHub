import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  Copy01Icon,
  CrownIcon,
  Shield01Icon,
  UserGroupIcon,
  UserRemove01Icon,
  Edit02Icon,
} from '@hugeicons/core-free-icons';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { GroupsService } from '../../../../core/services/groups/groups.service';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { Group, GroupMember, MemberRole } from '../../models/group.model';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  host: { class: 'block' },
  imports: [RouterLink, TranslatePipe, HugeiconsIconComponent, Avatar],
  template: `
    <div class="mx-auto w-full max-w-2xl animate-fade-up">
      <div class="mb-5 flex items-center gap-3">
        <a routerLink="/groups" class="btn-ghost-icon" [attr.aria-label]="'common.back' | translate">
          <hugeicons-icon [icon]="backIcon" [size]="18" [strokeWidth]="1.8" />
        </a>
        <h1 class="flex-1 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ 'nav.groups' | translate }}
        </h1>
        @if (isAdmin()) {
          <a
            [routerLink]="['/groups', groupId, 'edit']"
            class="btn-ghost-icon"
            [attr.aria-label]="'groups.edit' | translate"
            [title]="'groups.edit' | translate"
          >
            <hugeicons-icon [icon]="editIcon" [size]="18" [strokeWidth]="1.8" />
          </a>
        }
      </div>

      @if (loading()) {
        <div class="h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      } @else if (errorMessage()) {
        <p class="field-error" role="alert">
          <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
          {{ errorMessage() }}
        </p>
      } @else if (group(); as g) {
        <section
          class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div class="flex items-start gap-4">
            @if (g.avatarUrl) {
              <app-avatar [src]="g.avatarUrl" [name]="g.name" [size]="48" />
            } @else {
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400"
              >
                <hugeicons-icon [icon]="groupIcon" [size]="22" [strokeWidth]="1.8" />
              </span>
            }
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{{ g.name }}</h2>
              <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {{ g.memberCount }} / {{ g.maxMembers }}
                @if (g.isPrivate) {
                  <span aria-hidden="true">&middot;</span>
                  {{ 'groups.private' | translate }}
                }
              </p>
            </div>
          </div>

          @if (g.description) {
            <p class="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {{ g.description }}
            </p>
          }

          @if (isMember() && g.inviteCode) {
            <div
              class="mt-4 flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 dark:bg-zinc-800"
            >
              <span class="text-xs text-zinc-500 dark:text-zinc-400">
                {{ 'groups.inviteCode' | translate }}
              </span>
              <code class="flex-1 font-mono text-sm text-zinc-800 dark:text-zinc-200">
                {{ g.inviteCode }}
              </code>
              <button
                type="button"
                class="btn-ghost-icon"
                [attr.aria-label]="'groups.copyCode' | translate"
                (click)="copyCode(g.inviteCode!)"
              >
                <hugeicons-icon [icon]="copyIcon" [size]="16" [strokeWidth]="1.8" />
              </button>
            </div>
            @if (copied()) {
              <p class="mt-1.5 animate-fade-in text-xs text-accent-700 dark:text-accent-400">
                {{ 'groups.codeCopied' | translate }}
              </p>
            }
          }

          <button
            type="button"
            class="mt-5"
            [class]="isMember() ? 'btn-secondary' : 'btn-primary'"
            [disabled]="busy()"
            (click)="toggleMembership()"
          >
            {{
              (busy() ? 'common.loading' : isMember() ? 'groups.leave' : 'groups.join') | translate
            }}
          </button>

          @if (actionError()) {
            <p class="field-error animate-fade-in" role="alert">
              <hugeicons-icon [icon]="alertIcon" [size]="15" [strokeWidth]="1.9" />
              {{ actionError() }}
            </p>
          }
        </section>

        <section class="mt-4">
          <h3 class="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ 'groups.members' | translate }}
          </h3>
          <ul
            class="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900"
          >
            @for (member of members(); track member.id) {
              <li class="flex items-center gap-3 p-3">
                <app-avatar
                  [src]="member.user?.avatarUrl ?? null"
                  [name]="member.user?.displayName ?? ''"
                  [size]="36"
                />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {{ member.user?.displayName }}
                  </p>
                  <p class="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    &#64;{{ member.user?.username }}
                  </p>
                </div>
                <span
                  class="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                  [class]="
                    member.role === 'admin'
                      ? 'bg-accent-100 text-accent-800 dark:bg-accent-500/15 dark:text-accent-300'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  "
                >
                  @if (member.role === 'admin') {
                    <hugeicons-icon [icon]="crownIcon" [size]="12" [strokeWidth]="2" />
                  } @else if (member.role === 'moderator') {
                    <hugeicons-icon [icon]="shieldIcon" [size]="12" [strokeWidth]="2" />
                  }
                  {{ 'groups.role.' + member.role | translate }}
                </span>

                @if (isAdmin() && member.userId !== currentUserId()) {
                  <button
                    type="button"
                    class="btn-ghost-icon shrink-0"
                    [disabled]="changingRole() === member.userId"
                    [attr.aria-label]="
                      (member.role === 'admin' ? 'groups.demote' : 'groups.promote') | translate
                    "
                    [title]="
                      (member.role === 'admin' ? 'groups.demote' : 'groups.promote') | translate
                    "
                    (click)="toggleRole(member)"
                  >
                    <hugeicons-icon [icon]="shieldIcon" [size]="16" [strokeWidth]="1.8" />
                  </button>
                  <button
                    type="button"
                    class="btn-ghost-icon shrink-0"
                    [attr.aria-label]="'groups.removeMember' | translate"
                    [title]="'groups.removeMember' | translate"
                    (click)="removeMember(member)"
                  >
                    <hugeicons-icon [icon]="removeIcon" [size]="16" [strokeWidth]="1.8" />
                  </button>
                }
              </li>
            }
          </ul>
        </section>
      }
    </div>
  `,
})
export class GroupDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupsService = inject(GroupsService);
  private readonly authService = inject(AuthService);

  protected readonly backIcon = ArrowLeft01Icon;
  protected readonly groupIcon = UserGroupIcon;
  protected readonly copyIcon = Copy01Icon;
  protected readonly crownIcon = CrownIcon;
  protected readonly shieldIcon = Shield01Icon;
  protected readonly editIcon = Edit02Icon;
  protected readonly removeIcon = UserRemove01Icon;
  protected readonly alertIcon = AlertCircleIcon;

  protected readonly group = signal<Group | null>(null);
  protected readonly members = signal<GroupMember[]>([]);
  protected readonly loading = signal(true);
  protected readonly busy = signal(false);
  protected readonly copied = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);
  protected readonly changingRole = signal<string | null>(null);

  protected readonly groupId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly currentUserId = computed(() => this.authService.currentUser()?.id ?? null);

  protected readonly isMember = computed(() =>
    this.members().some((m) => m.userId === this.currentUserId()),
  );

  protected readonly isAdmin = computed(() =>
    this.members().some(
      (m) => m.userId === this.currentUserId() && (m.role as MemberRole) === 'admin',
    ),
  );

  constructor() {
    this.groupsService.byId(this.groupId).subscribe({
      next: (group) => {
        this.group.set(group);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
    this.loadMembers();
  }

  toggleMembership(): void {
    const wasMember = this.isMember();
    this.busy.set(true);
    this.actionError.set(null);

    const request: Observable<unknown> = wasMember
      ? this.groupsService.leave(this.groupId)
      : this.groupsService.join(this.groupId);

    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.loadMembers();
        this.refreshGroup();
      },
      error: (err: Error) => {
        this.busy.set(false);
        this.actionError.set(err.message);
      },
    });
  }

  toggleRole(member: GroupMember): void {
    if (this.changingRole()) {
      return;
    }
    const next: MemberRole = member.role === 'admin' ? 'member' : 'admin';
    this.changingRole.set(member.userId);
    this.actionError.set(null);
    this.groupsService.updateMemberRole(this.groupId, member.userId, next).subscribe({
      next: () => {
        this.members.set(
          this.members().map((m) => (m.userId === member.userId ? { ...m, role: next } : m)),
        );
        this.changingRole.set(null);
      },
      error: (err: Error) => {
        this.changingRole.set(null);
        this.actionError.set(err.message);
      },
    });
  }

  removeMember(member: GroupMember): void {
    this.actionError.set(null);
    this.groupsService.removeMember(this.groupId, member.userId).subscribe({
      next: () => {
        this.members.set(this.members().filter((m) => m.id !== member.id));
        this.refreshGroup();
      },
      error: (err: Error) => this.actionError.set(err.message),
    });
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(
      () => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      },
      () => undefined,
    );
  }

  private loadMembers(): void {
    this.groupsService.members(this.groupId, { limit: 100 }).subscribe({
      next: (page) => this.members.set(page.items),
      error: () => this.members.set([]),
    });
  }

  private refreshGroup(): void {
    this.groupsService.byId(this.groupId).subscribe({
      next: (group) => this.group.set(group),
      error: () => this.router.navigate(['/groups']),
    });
  }
}

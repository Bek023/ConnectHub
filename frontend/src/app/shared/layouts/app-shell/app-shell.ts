import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  ChildrenOutletContexts,
} from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import {
  BubbleChatIcon,
  Call02Icon,
  HierarchyIcon,
  Home01Icon,
  Logout01Icon,
  Megaphone01Icon,
  Notification01Icon,
  Settings01Icon,
  Target02Icon,
  UserCircleIcon,
  UserGroupIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LanguageSwitcher } from '../../components/language-switcher/language-switcher';
import { ThemeToggle } from '../../components/theme-toggle/theme-toggle';
import { listStagger, routeTransition } from '../../animations/route-animations';
import { IncomingCallOverlay } from '../../components/incoming-call-overlay/incoming-call-overlay';
import { NotificationsService } from '../../../core/services/notifications/notifications.service';
import { NotificationSocketService } from '../../../core/services/socket/notification-socket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  standalone: true,
  host: { class: 'block' },
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    HugeiconsIconComponent,
    ThemeToggle,
    LanguageSwitcher,
    IncomingCallOverlay,
  ],
  animations: [routeTransition, listStagger],
  template: `
    <app-incoming-call-overlay />

    <div class="flex min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950">
      <aside
        class="hidden w-60 shrink-0 flex-col border-r border-zinc-200 bg-white md:flex dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div class="flex items-center gap-2 px-5 py-5">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-white dark:bg-accent-500 dark:text-zinc-950"
          >
            <hugeicons-icon [icon]="brandIcon" [size]="18" [strokeWidth]="2" />
          </div>
          <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ 'app.name' | translate }}
          </span>
        </div>

        <nav class="flex-1 space-y-0.5 px-3">
          @for (item of navItems; track item.path) {
            <a
              @listStagger
              [routerLink]="item.path"
              routerLinkActive="bg-accent-50 text-accent-800 dark:bg-accent-500/10 dark:text-accent-300"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <hugeicons-icon [icon]="item.icon" [size]="18" [strokeWidth]="1.8" />
              <span class="flex-1">{{ item.labelKey | translate }}</span>
              @if (item.path === '/notifications' && unread() > 0) {
                <span
                  class="min-w-[20px] rounded-full bg-accent-700 px-1.5 py-0.5 text-center text-[11px] font-semibold leading-none text-white dark:bg-accent-500 dark:text-zinc-950"
                >
                  {{ unread() > 99 ? '99+' : unread() }}
                </span>
              }
            </a>
          }
        </nav>

        <div class="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.98] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            (click)="logout()"
          >
            <hugeicons-icon [icon]="logoutIcon" [size]="18" [strokeWidth]="1.8" />
            <span>{{ 'common.logout' | translate }}</span>
          </button>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div class="flex items-center gap-2 md:hidden">
            <div
              class="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600 text-white dark:bg-accent-500 dark:text-zinc-950"
            >
              <hugeicons-icon [icon]="brandIcon" [size]="16" [strokeWidth]="2" />
            </div>
            <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ 'app.name' | translate }}
            </span>
          </div>
          <div class="hidden md:block"></div>
          <div class="flex items-center gap-2">
            <app-language-switcher />
            <app-theme-toggle />
          </div>
        </header>

        <main class="route-stack flex-1 overflow-y-auto p-5" [@routeTransition]="routeKey()">
          <router-outlet />
        </main>

        <nav
          class="flex items-center justify-around border-t border-zinc-200 bg-white py-2 md:hidden dark:border-zinc-800 dark:bg-zinc-900"
        >
          @for (item of navItems.slice(0, 5); track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="text-accent-700 dark:text-accent-400"
              class="flex flex-col items-center gap-0.5 px-3 py-1 text-zinc-500 transition-colors dark:text-zinc-400"
            >
              <hugeicons-icon [icon]="item.icon" [size]="20" [strokeWidth]="1.8" />
              <span class="text-[10px] font-medium">{{ item.labelKey | translate }}</span>
            </a>
          }
        </nav>
      </div>
    </div>
  `,
})
export class AppShell {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly contexts = inject(ChildrenOutletContexts);
  private readonly notificationsService = inject(NotificationsService);
  private readonly notificationSocket = inject(NotificationSocketService);

  protected readonly unread = this.notificationsService.unread;

  protected readonly brandIcon = HierarchyIcon;
  protected readonly logoutIcon = Logout01Icon;

  constructor() {
    this.notificationsService.refreshUnread();
    void this.notificationSocket.connect();
    this.notificationSocket.notification
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.notificationsService.increment());
  }

  protected readonly navItems = [
    { path: '/feed', labelKey: 'nav.feed', icon: Home01Icon },
    { path: '/goals', labelKey: 'nav.goals', icon: Target02Icon },
    { path: '/groups', labelKey: 'nav.groups', icon: UserGroupIcon },
    { path: '/channels', labelKey: 'nav.channels', icon: Megaphone01Icon },
    { path: '/chat', labelKey: 'nav.chat', icon: BubbleChatIcon },
    { path: '/calls', labelKey: 'nav.calls', icon: Call02Icon },
    { path: '/search', labelKey: 'nav.search', icon: Search01Icon },
    { path: '/notifications', labelKey: 'nav.notifications', icon: Notification01Icon },
    { path: '/profile', labelKey: 'nav.profile', icon: UserCircleIcon },
    { path: '/settings', labelKey: 'nav.settings', icon: Settings01Icon },
  ];

  routeKey(): string {
    return this.contexts.getContext('primary')?.route?.snapshot?.routeConfig?.path ?? '';
  }

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/welcome']));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiEndpoints } from '../api/api-endpoints';
import { Paginated, apiDelete, apiGet, apiPut } from '../api/api-envelope';
import { AppNotification } from '../../../features/notifications/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);

  readonly unread = signal(0);

  list(page = 1, unreadOnly = false): Observable<Paginated<AppNotification>> {
    const query: Record<string, string | number> = { page };
    if (unreadOnly) {
      query['unreadOnly'] = 'true';
    }
    return apiGet<Paginated<AppNotification>>(this.http, ApiEndpoints.notifications.root, query);
  }

  refreshUnread(): void {
    apiGet<{ count: number }>(this.http, ApiEndpoints.notifications.unreadCount).subscribe({
      next: ({ count }) => this.unread.set(count),
      error: () => undefined,
    });
  }

  markRead(id: string): Observable<{ message: string }> {
    return apiPut<{ message: string }>(this.http, ApiEndpoints.notifications.read(id), {}).pipe(
      tap(() => this.unread.update((count) => Math.max(0, count - 1))),
    );
  }

  markAllRead(): Observable<{ message: string }> {
    return apiPut<{ message: string }>(this.http, ApiEndpoints.notifications.readAll, {}).pipe(
      tap(() => this.unread.set(0)),
    );
  }

  remove(id: string): Observable<{ message: string }> {
    return apiDelete<{ message: string }>(this.http, ApiEndpoints.notifications.byId(id));
  }

  increment(): void {
    this.unread.update((count) => count + 1);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../api/api-endpoints';
import { CursorPage, apiDelete, apiGet, apiPost, apiPut } from '../api/api-envelope';
import { ChatType, Message } from '../../../features/chat/models/message.model';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private readonly http = inject(HttpClient);

  history(
    chatType: ChatType,
    chatId: string,
    params: { cursor?: string; limit?: number } = {},
  ): Observable<CursorPage<Message>> {
    const query: Record<string, string | number> = {};
    if (params.cursor) query['cursor'] = params.cursor;
    if (params.limit) query['limit'] = params.limit;
    return apiGet<CursorPage<Message>>(
      this.http,
      ApiEndpoints.messages.byChat(chatType, chatId),
      query,
    );
  }

  edit(id: string, content: string): Observable<Message> {
    return apiPut<Message>(this.http, ApiEndpoints.messages.byId(id), { content });
  }

  remove(id: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.messages.byId(id));
  }

  react(id: string, emoji: string): Observable<unknown> {
    return apiPost(this.http, ApiEndpoints.messages.react(id), { emoji });
  }

  readBy(id: string): Observable<unknown> {
    return apiGet(this.http, ApiEndpoints.messages.readBy(id));
  }
}

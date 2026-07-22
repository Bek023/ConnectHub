import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../api/api-endpoints';
import { Paginated, apiDelete, apiGet, apiPost } from '../api/api-envelope';
import { Call, CallParticipant, CallType } from '../../../features/calls/models/call.model';

@Injectable({ providedIn: 'root' })
export class CallsService {
  private readonly http = inject(HttpClient);

  initiate(chatId: string, type: CallType): Observable<Call> {
    return apiPost<Call>(this.http, ApiEndpoints.calls.initiate, { chatId, type });
  }

  activeForChat(chatId: string): Observable<Call | null> {
    return apiGet<Call | null>(this.http, ApiEndpoints.calls.active, { chatId });
  }

  join(id: string): Observable<Call> {
    return apiPost<Call>(this.http, ApiEndpoints.calls.join(id), {});
  }

  leave(id: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.calls.leave(id));
  }

  end(id: string): Observable<Call> {
    return apiPost<Call>(this.http, ApiEndpoints.calls.end(id), {});
  }

  participants(id: string): Observable<CallParticipant[]> {
    return apiGet<CallParticipant[]>(this.http, ApiEndpoints.calls.participants(id));
  }

  history(page = 1): Observable<Paginated<Call>> {
    return apiGet<Paginated<Call>>(this.http, ApiEndpoints.calls.history, { page });
  }
}

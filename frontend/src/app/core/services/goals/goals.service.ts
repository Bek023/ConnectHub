import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../api/api-endpoints';
import { Paginated, apiDelete, apiGet, apiPost, apiPut } from '../api/api-envelope';
import { CreateGoalRequest, Goal } from '../../../features/goals/models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalsService {
  private readonly http = inject(HttpClient);

  list(params: { page?: number; limit?: number; category?: string; q?: string } = {}): Observable<
    Paginated<Goal>
  > {
    const query: Record<string, string | number> = {};
    if (params.page) query['page'] = params.page;
    if (params.limit) query['limit'] = params.limit;
    if (params.category) query['category'] = params.category;
    if (params.q) query['q'] = params.q;
    return apiGet<Paginated<Goal>>(this.http, ApiEndpoints.goals.root, query);
  }

  trending(limit?: number): Observable<Goal[]> {
    return apiGet<Goal[]>(this.http, ApiEndpoints.goals.trending, limit ? { limit } : undefined);
  }

  my(): Observable<Goal[]> {
    return apiGet<Goal[]>(this.http, ApiEndpoints.goals.my);
  }

  byId(id: string): Observable<Goal> {
    return apiGet<Goal>(this.http, ApiEndpoints.goals.byId(id));
  }

  create(payload: CreateGoalRequest): Observable<Goal> {
    return apiPost<Goal>(this.http, ApiEndpoints.goals.root, payload);
  }

  update(id: string, payload: Partial<CreateGoalRequest>): Observable<Goal> {
    return apiPut<Goal>(this.http, ApiEndpoints.goals.byId(id), payload);
  }

  remove(id: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.goals.byId(id));
  }

  join(id: string): Observable<unknown> {
    return apiPost(this.http, ApiEndpoints.goals.join(id));
  }

  leave(id: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.goals.leave(id));
  }
}

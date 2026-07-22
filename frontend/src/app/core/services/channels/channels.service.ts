import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../api/api-endpoints';
import { Paginated, apiDelete, apiGet, apiPost, apiPut } from '../api/api-envelope';
import {
  Channel,
  ChannelStats,
  ChannelSubscriber,
  CreateChannelRequest,
  UpdateChannelRequest,
} from '../../../features/channels/models/channel.model';

@Injectable({ providedIn: 'root' })
export class ChannelsService {
  private readonly http = inject(HttpClient);

  list(params: { goalId?: string; page?: number; limit?: number } = {}): Observable<
    Paginated<Channel>
  > {
    const query: Record<string, string | number> = {};
    if (params.goalId) query['goalId'] = params.goalId;
    if (params.page) query['page'] = params.page;
    if (params.limit) query['limit'] = params.limit;
    return apiGet<Paginated<Channel>>(this.http, ApiEndpoints.channels.root, query);
  }

  my(params: { page?: number; limit?: number } = {}): Observable<Paginated<Channel>> {
    const query: Record<string, string | number> = {};
    if (params.page) query['page'] = params.page;
    if (params.limit) query['limit'] = params.limit;
    return apiGet<Paginated<Channel>>(this.http, ApiEndpoints.channels.my, query);
  }

  byId(id: string): Observable<Channel> {
    return apiGet<Channel>(this.http, ApiEndpoints.channels.byId(id));
  }

  create(payload: CreateChannelRequest): Observable<Channel> {
    return apiPost<Channel>(this.http, ApiEndpoints.channels.root, payload);
  }

  update(id: string, payload: UpdateChannelRequest): Observable<Channel> {
    return apiPut<Channel>(this.http, ApiEndpoints.channels.byId(id), payload);
  }

  remove(id: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.channels.byId(id));
  }

  subscribe(id: string): Observable<ChannelSubscriber> {
    return apiPost<ChannelSubscriber>(this.http, ApiEndpoints.channels.subscribe(id));
  }

  unsubscribe(id: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.channels.unsubscribe(id));
  }

  subscribers(id: string, params: { page?: number; limit?: number } = {}): Observable<
    Paginated<ChannelSubscriber>
  > {
    const query: Record<string, string | number> = {};
    if (params.page) query['page'] = params.page;
    if (params.limit) query['limit'] = params.limit;
    return apiGet<Paginated<ChannelSubscriber>>(
      this.http,
      ApiEndpoints.channels.subscribers(id),
      query,
    );
  }

  stats(id: string): Observable<ChannelStats> {
    return apiGet<ChannelStats>(this.http, ApiEndpoints.channels.stats(id));
  }
}

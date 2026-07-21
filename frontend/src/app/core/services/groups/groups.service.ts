import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../api/api-endpoints';
import { Paginated, apiDelete, apiGet, apiPost, apiPut } from '../api/api-envelope';
import {
  CreateGroupRequest,
  Group,
  GroupMember,
  MemberRole,
} from '../../../features/groups/models/group.model';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private readonly http = inject(HttpClient);

  list(params: { goalId?: string; page?: number; limit?: number } = {}): Observable<
    Paginated<Group>
  > {
    const query: Record<string, string | number> = {};
    if (params.goalId) query['goalId'] = params.goalId;
    if (params.page) query['page'] = params.page;
    if (params.limit) query['limit'] = params.limit;
    return apiGet<Paginated<Group>>(this.http, ApiEndpoints.groups.root, query);
  }

  my(params: { page?: number; limit?: number } = {}): Observable<Paginated<Group>> {
    const query: Record<string, string | number> = {};
    if (params.page) query['page'] = params.page;
    if (params.limit) query['limit'] = params.limit;
    return apiGet<Paginated<Group>>(this.http, ApiEndpoints.groups.my, query);
  }

  byId(id: string): Observable<Group> {
    return apiGet<Group>(this.http, ApiEndpoints.groups.byId(id));
  }

  create(payload: CreateGroupRequest): Observable<Group> {
    return apiPost<Group>(this.http, ApiEndpoints.groups.root, payload);
  }

  update(id: string, payload: Partial<CreateGroupRequest>): Observable<Group> {
    return apiPut<Group>(this.http, ApiEndpoints.groups.byId(id), payload);
  }

  remove(id: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.groups.byId(id));
  }

  join(id: string): Observable<GroupMember> {
    return apiPost<GroupMember>(this.http, ApiEndpoints.groups.join(id));
  }

  joinByCode(code: string): Observable<GroupMember> {
    return apiPost<GroupMember>(this.http, ApiEndpoints.groups.joinByCode(code));
  }

  leave(id: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.groups.leave(id));
  }

  members(id: string, params: { page?: number; limit?: number } = {}): Observable<
    Paginated<GroupMember>
  > {
    const query: Record<string, string | number> = {};
    if (params.page) query['page'] = params.page;
    if (params.limit) query['limit'] = params.limit;
    return apiGet<Paginated<GroupMember>>(this.http, ApiEndpoints.groups.members(id), query);
  }

  updateMemberRole(id: string, userId: string, role: MemberRole): Observable<unknown> {
    return apiPut(this.http, ApiEndpoints.groups.member(id, userId), { role });
  }

  removeMember(id: string, userId: string): Observable<unknown> {
    return apiDelete(this.http, ApiEndpoints.groups.member(id, userId));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../api/api-endpoints';
import { apiDelete, apiGet, apiPut } from '../api/api-envelope';
import { PublicUser, UpdateProfileRequest, User } from '../../../features/auth/models/auth.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  getMe(): Observable<User> {
    return apiGet<User>(this.http, ApiEndpoints.users.me);
  }

  updateMe(payload: UpdateProfileRequest): Observable<User> {
    return apiPut<User>(this.http, ApiEndpoints.users.me, payload);
  }

  deleteMe(): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.users.me);
  }

  getById(id: string): Observable<PublicUser> {
    return apiGet<PublicUser>(this.http, ApiEndpoints.users.byId(id));
  }
}

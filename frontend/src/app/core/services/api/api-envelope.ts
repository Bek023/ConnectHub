import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string | string[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

export const EMPTY_PAGE: Paginated<never> = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    const message = Array.isArray(response.message) ? response.message.join(', ') : response.message;
    throw new Error(message);
  }
  return response.data;
}

export function apiGet<T>(http: HttpClient, url: string, params?: Record<string, string | number | boolean>): Observable<T> {
  return http.get<ApiResponse<T>>(url, { params }).pipe(map(unwrap));
}

export function apiPost<T>(http: HttpClient, url: string, body?: unknown): Observable<T> {
  return http.post<ApiResponse<T>>(url, body ?? {}).pipe(map(unwrap));
}

export function apiPut<T>(http: HttpClient, url: string, body?: unknown): Observable<T> {
  return http.put<ApiResponse<T>>(url, body ?? {}).pipe(map(unwrap));
}

export function apiDelete<T>(http: HttpClient, url: string): Observable<T> {
  return http.delete<ApiResponse<T>>(url).pipe(map(unwrap));
}

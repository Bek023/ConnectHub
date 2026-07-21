import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../api/api-endpoints';
import { CursorPage, Paginated, apiDelete, apiGet, apiPost, apiPut } from '../api/api-envelope';
import {
  Comment,
  CreateCommentRequest,
  CreatePostRequest,
  Post,
} from '../../../features/posts/models/post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);

  feed(params: { page?: number; limit?: number } = {}): Observable<Paginated<Post>> {
    const query: Record<string, number> = {};
    if (params.page) query['page'] = params.page;
    if (params.limit) query['limit'] = params.limit;
    return apiGet<Paginated<Post>>(this.http, ApiEndpoints.posts.feed, query);
  }

  byId(id: string): Observable<Post> {
    return apiGet<Post>(this.http, ApiEndpoints.posts.byId(id));
  }

  create(payload: CreatePostRequest): Observable<Post> {
    return apiPost<Post>(this.http, ApiEndpoints.posts.root, payload);
  }

  update(id: string, content: string): Observable<Post> {
    return apiPut<Post>(this.http, ApiEndpoints.posts.byId(id), { content });
  }

  remove(id: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.posts.byId(id));
  }

  like(id: string): Observable<{ message: string }> {
    return apiPost(this.http, ApiEndpoints.posts.like(id));
  }

  unlike(id: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.posts.like(id));
  }

  liked(id: string): Observable<{ liked: boolean }> {
    return apiGet<{ liked: boolean }>(this.http, ApiEndpoints.posts.liked(id));
  }

  comments(id: string, params: { cursor?: string; limit?: number } = {}): Observable<
    CursorPage<Comment>
  > {
    const query: Record<string, string | number> = {};
    if (params.cursor) query['cursor'] = params.cursor;
    if (params.limit) query['limit'] = params.limit;
    return apiGet<CursorPage<Comment>>(this.http, ApiEndpoints.posts.comments(id), query);
  }

  addComment(id: string, payload: CreateCommentRequest): Observable<Comment> {
    return apiPost<Comment>(this.http, ApiEndpoints.posts.comments(id), payload);
  }

  removeComment(id: string, commentId: string): Observable<{ message: string }> {
    return apiDelete(this.http, ApiEndpoints.posts.comment(id, commentId));
  }

  pin(id: string): Observable<Post> {
    return apiPost<Post>(this.http, ApiEndpoints.posts.pin(id));
  }

  unpin(id: string): Observable<Post> {
    return apiDelete<Post>(this.http, ApiEndpoints.posts.pin(id));
  }
}

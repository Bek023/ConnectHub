import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiEndpoints } from '../api/api-endpoints';
import { ApiResponse } from '../api/api-envelope';

export type MediaType = 'image' | 'video' | 'voice' | 'file';

export interface UploadResult {
  url: string;
  key: string;
  processingJobId?: string;
}

export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly http = inject(HttpClient);

  upload(file: File, type: MediaType): Observable<UploadResult> {
    const form = new FormData();
    form.append('file', file);
    form.append('type', type);

    return this.http
      .post<ApiResponse<UploadResult>>(ApiEndpoints.media.upload, form)
      .pipe(
        map((response) => {
          if (!response.success) {
            const message = Array.isArray(response.message)
              ? response.message.join(', ')
              : response.message;
            throw new Error(message);
          }
          return response.data;
        }),
      );
  }
}

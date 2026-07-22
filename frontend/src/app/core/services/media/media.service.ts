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

export const MEDIA_RULES: Record<MediaType, { mimes: string[]; maxBytes: number }> = {
  image: { mimes: ALLOWED_IMAGE_TYPES, maxBytes: IMAGE_MAX_BYTES },
  video: {
    mimes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxBytes: 100 * 1024 * 1024,
  },
  voice: {
    mimes: ['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4'],
    maxBytes: 20 * 1024 * 1024,
  },
  file: {
    mimes: [
      'application/pdf',
      'application/zip',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    maxBytes: 50 * 1024 * 1024,
  },
};

export const ACCEPT_ALL_MEDIA = Object.values(MEDIA_RULES)
  .flatMap((rule) => rule.mimes)
  .join(',');

export function detectMediaType(mimeType: string): MediaType | null {
  for (const [type, rule] of Object.entries(MEDIA_RULES)) {
    if (rule.mimes.includes(mimeType)) {
      return type as MediaType;
    }
  }
  return null;
}

export function mediaTypeToMessageType(type: MediaType): 'image' | 'video' | 'voice' | 'file' {
  return type;
}

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

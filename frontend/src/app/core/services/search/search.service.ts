import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../api/api-endpoints';
import { apiGet } from '../api/api-envelope';
import { SearchResults } from '../../../features/search/models/search.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);

  searchAll(q: string): Observable<SearchResults> {
    return apiGet<SearchResults>(this.http, ApiEndpoints.search.root, { q });
  }
}

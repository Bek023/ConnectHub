import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { TokenStorage } from '../services/token-storage/token-storage';
import { AUTH_SKIP_URLS, API_BASE_URL } from '../services/api/api-endpoints';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorage);
  const authService = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = req.url.startsWith(API_BASE_URL);
  const isSkippedEndpoint = AUTH_SKIP_URLS.some((url) => req.url.startsWith(url));

  const accessToken = tokenStorage.getAccessToken();
  const authorizedReq =
    isApiRequest && accessToken && !isSkippedEndpoint
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

  return next(authorizedReq).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        isApiRequest &&
        !isSkippedEndpoint
      ) {
        return authService.refreshAccessToken().pipe(
          switchMap((newAccessToken) => {
            const retriedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` },
            });
            return next(retriedReq);
          }),
          catchError((refreshError) => {
            router.navigate(['/welcome']);
            return throwError(() => refreshError);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};

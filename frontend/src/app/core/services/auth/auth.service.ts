import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { ApiEndpoints } from '../api/api-endpoints';
import { apiGet, apiPost } from '../api/api-envelope';
import { TokenStorage } from '../token-storage/token-storage';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  LoginSuccess,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  TwoFaDisableRequest,
  TwoFaEnableRequest,
  TwoFaSetupResponse,
  User,
  Verify2FALoginRequest,
  VerifyEmailRequest,
  isLoginRequires2FA,
} from '../../../features/auth/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorage);

  private readonly currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  private refreshInFlight$: Observable<string> | null = null;
  private readonly sessionTeardowns = new Set<() => void>();

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return apiPost<RegisterResponse>(this.http, ApiEndpoints.auth.register, payload);
  }

  verifyEmail(payload: VerifyEmailRequest): Observable<{ message: string }> {
    return apiPost(this.http, ApiEndpoints.auth.verifyEmail, payload);
  }

  resendVerification(userId: string): Observable<{ message: string }> {
    return apiPost(this.http, ApiEndpoints.auth.resendVerification, { userId });
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return apiPost<LoginResponse>(this.http, ApiEndpoints.auth.login, payload).pipe(
      tap((response) => {
        if (!isLoginRequires2FA(response)) {
          this.persistSession(response);
        }
      }),
    );
  }

  verify2FaLogin(payload: Verify2FALoginRequest): Observable<LoginSuccess> {
    return apiPost<LoginSuccess>(this.http, ApiEndpoints.auth.verify2FaLogin, payload).pipe(
      tap((response) => this.persistSession(response)),
    );
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<{ message: string }> {
    return apiPost(this.http, ApiEndpoints.auth.forgotPassword, payload);
  }

  resetPassword(payload: ResetPasswordRequest): Observable<{ message: string }> {
    return apiPost(this.http, ApiEndpoints.auth.resetPassword, payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<{ message: string }> {
    return apiPost(this.http, ApiEndpoints.auth.changePassword, payload);
  }

  setupTwoFa(): Observable<TwoFaSetupResponse> {
    return apiPost(this.http, ApiEndpoints.auth.twoFaSetup);
  }

  enableTwoFa(payload: TwoFaEnableRequest): Observable<{ message: string }> {
    return apiPost(this.http, ApiEndpoints.auth.twoFaEnable, payload);
  }

  disableTwoFa(payload: TwoFaDisableRequest): Observable<{ message: string }> {
    return apiPost(this.http, ApiEndpoints.auth.twoFaDisable, payload);
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);
  }

  fetchMe(): Observable<User> {
    return apiGet<User>(this.http, ApiEndpoints.auth.me).pipe(
      tap((user) => this.currentUserSignal.set(user)),
    );
  }

  logout(): Observable<unknown> {
    return apiPost(this.http, ApiEndpoints.auth.logout).pipe(
      catchError(() => of(null)),
      tap(() => this.clearSession()),
    );
  }

  refreshAccessToken(): Observable<string> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    const userId = this.tokenStorage.getUserId();
    const refreshToken = this.tokenStorage.getRefreshToken();
    if (!userId || !refreshToken) {
      this.clearSession();
      throw new Error('No refresh session available');
    }

    this.refreshInFlight$ = apiPost<RefreshResponse>(this.http, ApiEndpoints.auth.refresh, {
      userId,
      refreshToken,
    }).pipe(
      switchMap((response) => {
        this.tokenStorage.setAccessToken(response.accessToken);
        this.tokenStorage.setRefreshToken(response.refreshToken);
        this.tokenStorage.setUserId(response.userId);
        return of(response.accessToken);
      }),
      tap({ error: () => this.clearSession() }),
      finalize(() => {
        this.refreshInFlight$ = null;
      }),
      shareReplay(1),
    );

    return this.refreshInFlight$;
  }

  restoreSession(): Observable<User | null> {
    if (!this.tokenStorage.hasSession()) {
      return of(null);
    }
    return this.refreshAccessToken().pipe(
      switchMap(() => this.fetchMe()),
      catchError(() => {
        this.clearSession();
        return of(null);
      }),
    );
  }

  private persistSession(response: LoginSuccess): void {
    this.tokenStorage.setAccessToken(response.accessToken);
    this.tokenStorage.setRefreshToken(response.refreshToken);
    this.tokenStorage.setUserId(response.userId);
    this.currentUserSignal.set(response.user);
  }

  private clearSession(): void {
    this.tokenStorage.clear();
    this.currentUserSignal.set(null);
    for (const teardown of this.sessionTeardowns) {
      teardown();
    }
  }

  registerSessionTeardown(teardown: () => void): void {
    this.sessionTeardowns.add(teardown);
  }
}

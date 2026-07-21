import { Injectable } from '@angular/core';

const REFRESH_TOKEN_KEY = 'connecthub_refresh_token';
const USER_ID_KEY = 'connecthub_user_id';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private accessToken: string | null = null;

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string | null): void {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  }

  setUserId(userId: string | null): void {
    if (userId) {
      localStorage.setItem(USER_ID_KEY, userId);
    } else {
      localStorage.removeItem(USER_ID_KEY);
    }
  }

  hasSession(): boolean {
    return !!this.getRefreshToken();
  }

  clear(): void {
    this.accessToken = null;
    this.setRefreshToken(null);
    this.setUserId(null);
  }
}

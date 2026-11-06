import { Injectable } from '@angular/core';
import type { AuthResponse, AuthUser } from '../../shared/models/auth.models';

const TOKEN_KEY = 'freelancehub.access-token';
const REFRESH_TOKEN_KEY = 'freelancehub.refresh-token';
const USER_KEY = 'freelancehub.user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  save(auth: AuthResponse): void {
    sessionStorage.setItem(TOKEN_KEY, auth.accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const value = sessionStorage.getItem(USER_KEY);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as AuthUser;
    } catch {
      this.clear();
      return null;
    }
  }

  clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
}

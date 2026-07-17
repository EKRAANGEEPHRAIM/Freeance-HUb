import { Injectable } from '@angular/core';
import type { AuthResponse, AuthUser } from '../../shared/models/auth.models';

const TOKEN_KEY = 'freelancehub.access-token';
const USER_KEY = 'freelancehub.user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  save(auth: AuthResponse): void {
    sessionStorage.setItem(TOKEN_KEY, auth.accessToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
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
    sessionStorage.removeItem(USER_KEY);
  }
}

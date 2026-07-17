import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_URL } from './api-url.token';
import { TokenStorageService } from './token-storage.service';
import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from '../../shared/models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly tokenStorage = inject(TokenStorageService);

  readonly user = signal<AuthUser | null>(this.tokenStorage.getUser());

  login(credentials: LoginCredentials) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(tap((response) => this.setSession(response)));
  }

  register(credentials: RegisterCredentials) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, credentials)
      .pipe(tap((response) => this.setSession(response)));
  }

  logout(): void {
    this.tokenStorage.clear();
    this.user.set(null);
  }

  isAuthenticated(): boolean {
    return this.tokenStorage.getToken() !== null;
  }

  private setSession(response: AuthResponse): void {
    this.tokenStorage.save(response);
    this.user.set(response.user);
  }
}

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { from, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

let refreshPromise: Promise<string> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenStorage = inject(TokenStorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = tokenStorage.getToken();

  if (!token) {
    return next(request);
  }

  const authenticatedRequest = request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // On tente un refresh uniquement sur les erreurs 401 (hors endpoint refresh)
      const isRefreshRequest = request.url.includes('/auth/refresh');

      if (
        error.status === 401 &&
        !isRefreshRequest &&
        tokenStorage.getRefreshToken()
      ) {
        return from(refreshTokenPromise(authService, tokenStorage)).pipe(
          switchMap((newToken) =>
            next(
              request.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              }),
            ),
          ),
          catchError(() => {
            authService.logout();
            void router.navigate(['/auth/login']);
            return throwError(() => error);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};

/**
 * Rafraîchit le token en évitant les requêtes concurrentes :
 * si plusieurs requêtes échouent en même temps avec un 401,
 * elles attendent toutes le même refresh.
 */
function refreshTokenPromise(
  authService: AuthService,
  tokenStorage: TokenStorageService,
): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = authService
    .refreshToken()
    .toPromise()
    .then((response) => {
      if (!response) {
        throw new Error('Impossible de rafraîchir le token');
      }
      return response.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}


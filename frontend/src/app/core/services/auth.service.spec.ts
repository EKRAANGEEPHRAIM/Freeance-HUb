import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from './api-url.token';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

const authResponse = {
  accessToken: 'access-token',
  user: {
    id: '6502f79b-4c80-4f6b-9658-b14a35c45575',
    email: 'ada@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let tokenStorage: TokenStorageService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: 'http://api.test/api' },
      ],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenStorage = TestBed.inject(TokenStorageService);
  });

  afterEach(() => httpController.verify());

  it('logs in and stores the returned session', () => {
    let result: typeof authResponse | undefined;
    service.login({ email: authResponse.user.email, password: 'secure-password' }).subscribe((response) => result = response);

    const request = httpController.expectOne('http://api.test/api/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: authResponse.user.email, password: 'secure-password' });
    request.flush(authResponse);

    expect(result).toEqual(authResponse);
    expect(tokenStorage.getToken()).toBe(authResponse.accessToken);
    expect(service.user()).toEqual(authResponse.user);
  });

  it('registers a user and stores the returned session', () => {
    service.register({ email: authResponse.user.email, password: 'secure-password', firstName: 'Ada', lastName: 'Lovelace' }).subscribe();

    const request = httpController.expectOne('http://api.test/api/auth/register');
    expect(request.request.method).toBe('POST');
    request.flush(authResponse);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.user()).toEqual(authResponse.user);
  });

  it('logs out by clearing the stored session', () => {
    tokenStorage.save(authResponse);
    service.user.set(authResponse.user);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
  });
});

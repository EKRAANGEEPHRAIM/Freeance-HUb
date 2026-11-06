import { TokenStorageService } from './token-storage.service';

const auth = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    id: '6502f79b-4c80-4f6b-9658-b14a35c45575',
    email: 'ada@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('TokenStorageService', () => {
  const service = new TokenStorageService();

  beforeEach(() => sessionStorage.clear());

  it('stores and retrieves an authentication session', () => {
    service.save(auth);

    expect(service.getToken()).toBe(auth.accessToken);
    expect(service.getRefreshToken()).toBe(auth.refreshToken);
    expect(service.getUser()).toEqual(auth.user);
  });

  it('clears an invalid stored user', () => {
    sessionStorage.setItem('freelancehub.user', '{invalid-json');

    expect(service.getUser()).toBeNull();
    expect(sessionStorage.getItem('freelancehub.user')).toBeNull();
  });

  it('clears the complete authentication session', () => {
    service.save(auth);
    service.clear();

    expect(service.getToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
    expect(service.getUser()).toBeNull();
  });
});

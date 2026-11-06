import type { AuthenticatedUser } from '../users/users.types';

export type JwtPayload = {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
};

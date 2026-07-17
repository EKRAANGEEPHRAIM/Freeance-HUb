import type { AuthenticatedUser } from '../users/users.types';

export type JwtPayload = {
  sub: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthenticatedUser;
};

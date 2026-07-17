import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import type { AuthenticatedUser } from '../users/users.types';

const authenticatedUser: AuthenticatedUser = {
  id: '6502f79b-4c80-4f6b-9658-b14a35c45575',
  email: 'ada@example.com',
  firstName: 'Ada',
  lastName: 'Lovelace',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('AuthService', () => {
  const usersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };
  const jwtService = { signAsync: jest.fn() };
  const service = new AuthService(
    usersService as unknown as UsersService,
    jwtService as unknown as JwtService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a user with a hashed password and returns an access token', async () => {
    usersService.create.mockResolvedValue(authenticatedUser);
    jwtService.signAsync.mockResolvedValue('access-token');

    const result = await service.register({
      email: authenticatedUser.email,
      password: 'secure-password',
      firstName: authenticatedUser.firstName,
      lastName: authenticatedUser.lastName,
    });

    const createdUser = usersService.create.mock.calls[0][0] as { password: string };
    expect(createdUser.password).not.toBe('secure-password');
    expect(await bcrypt.compare('secure-password', createdUser.password)).toBe(true);
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: authenticatedUser.id,
      email: authenticatedUser.email,
    });
    expect(result).toEqual({ accessToken: 'access-token', user: authenticatedUser });
  });

  it('returns a token for valid login credentials', async () => {
    const password = await bcrypt.hash('secure-password', 4);
    usersService.findByEmail.mockResolvedValue({ ...authenticatedUser, password });
    usersService.findById.mockResolvedValue(authenticatedUser);
    jwtService.signAsync.mockResolvedValue('access-token');

    await expect(
      service.login({ email: authenticatedUser.email, password: 'secure-password' }),
    ).resolves.toEqual({ accessToken: 'access-token', user: authenticatedUser });
  });

  it('rejects login with an unknown email or invalid password', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: authenticatedUser.email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});

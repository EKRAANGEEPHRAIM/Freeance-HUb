import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { LoginDto, RefreshDto, RegisterDto } from './dto/auth.dto';
import type { AuthResponse, JwtPayload } from './auth.types';
import { UsersService } from '../users/users.service';
import type { AuthenticatedUser } from '../users/users.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<AuthResponse> {
    const password = await bcrypt.hash(data.password, 12);
    const user = await this.usersService.create({ ...data, password });

    return this.createAuthResponse(user);
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(data.email);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const authenticatedUser = await this.usersService.findById(user.id);

    if (!authenticatedUser) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    return this.createAuthResponse(authenticatedUser);
  }

  async refreshToken(data: RefreshDto): Promise<AuthResponse> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        data.refreshToken,
      );
    } catch {
      throw new UnauthorizedException(
        'Token de rafraîchissement invalide ou expiré',
      );
    }

    // Le refresh token doit contenir le type "refresh"
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }

    const authenticatedUser = await this.usersService.findById(payload.sub);

    if (!authenticatedUser) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    return this.createAuthResponse(authenticatedUser);
  }

  private async createAuthResponse(
    user: AuthenticatedUser,
  ): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'access',
    };
    const refreshPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(refreshPayload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken, user };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { LoginDto, RegisterDto } from './dto/auth.dto';
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
      throw new UnauthorizedException('Invalid email or password');
    }

    const authenticatedUser = await this.usersService.findById(user.id);

    if (!authenticatedUser) {
      throw new UnauthorizedException('User not found');
    }

    return this.createAuthResponse(authenticatedUser);
  }

  private async createAuthResponse(
    user: AuthenticatedUser,
  ): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, user };
  }
}

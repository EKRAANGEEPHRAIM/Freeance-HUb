import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { loginSchema, refreshSchema, registerSchema } from './dto/auth.dto';
import type { LoginDto, RefreshDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  register(@Body(new ZodValidationPipe(registerSchema)) data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  login(@Body(new ZodValidationPipe(loginSchema)) data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('refresh')
  refresh(@Body(new ZodValidationPipe(refreshSchema)) data: RefreshDto) {
    return this.authService.refreshToken(data);
  }
}

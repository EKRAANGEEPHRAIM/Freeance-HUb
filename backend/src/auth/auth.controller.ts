import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { loginSchema, registerSchema } from './dto/auth.dto';
import type { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(new ZodValidationPipe(registerSchema)) data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body(new ZodValidationPipe(loginSchema)) data: LoginDto) {
    return this.authService.login(data);
  }
}

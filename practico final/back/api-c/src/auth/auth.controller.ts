import { Controller, Post, Body, Get, Headers, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { ResendDto } from './dto/resend.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.auth.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.auth.login(body.email, body.password);
  }

  @Get('me')
  async me(@Headers('authorization') auth?: string) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing token');
    return this.auth.meFromToken(token);
  }

  @Post('verify-email')
  async verify(@Body() body: VerifyDto) {
    return this.auth.verifyEmail(body.token);
  }

  @Post('resend-verification')
  async resend(@Body() body: ResendDto, @Headers('authorization') auth?: string) {
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (token) {
      await this.auth.resendVerification(token);
      return { message: 'Email reenviado' };
    }
    if (body?.email) {
      await this.auth.resendVerification(body.email);
      return { message: 'Email reenviado' };
    }
    throw new UnauthorizedException('Missing token or email');
  }

  @Post('forgot-password')
  async requestReset(@Body() body: ForgotDto) {
    await this.auth.requestPasswordReset(body.email);
    return { message: 'Si el email existe, recibirás un link' };
  }

  @Post('reset-password')
  async reset(@Body() body: ResetDto) {
    await this.auth.resetPassword(body.token, body.password);
    return { message: 'Contraseña actualizada' };
  }
}

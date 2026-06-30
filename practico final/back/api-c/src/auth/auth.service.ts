import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from './entities/user-token.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MailerService } from './mailer.service';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class AuthService {
  private mailer = new MailerService();
  private jwtSecret = process.env.JWT_SECRET || 'changeme';

  constructor(private usersService: UsersService) {}

  async register(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const created = await this.usersService.create({ email, password: hashed, emailVerified: false });
    if (!created) throw new BadRequestException('Unable to create user');

    await this.sendVerificationEmail((created as any).id, (created as any).email);

    const token = this.signToken((created as any).id as any);
    return { access_token: token, user: { id: (created as any).id, email: (created as any).email, emailVerified: (created as any).emailVerified } };
  }

  private safeUser(user: any) {
    const { password, ...rest } = user as any;
    return rest;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const ok = await bcrypt.compare(password, (user as any).password || '');
    if (!ok) throw new BadRequestException('Invalid credentials');

    if (!(user as any).emailVerified) throw new BadRequestException('Email not verified');

    const token = this.signToken(user.id as any);
    return { access_token: token, user: this.safeUser(user) };
  }

  signToken(userId: number) {
    return jwt.sign({ sub: userId }, this.jwtSecret, { expiresIn: '7d' });
  }

  async meFromToken(token: string) {
    try {
      const payload: any = jwt.verify(token, this.jwtSecret);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) throw new NotFoundException('User not found');
      return this.safeUser(user);
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
  }

  async sendVerificationEmail(userId: number, email: string) {
    const token = randomUUID();
    const expiry = Date.now() + 1000 * 60 * 60 * 24; // 24h

    await this.usersService.update(userId, { verificationToken: token, isVerified: false });

    const link = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/verify-email?token=${token}`;
    const html = `Pulsa el enlace para verificar tu email: <a href="${link}">${link}</a>`;
    await this.mailer.sendMail(email, 'Verifica tu correo', html);
  }

  async verifyEmail(tokenStr: string) {
    const user = await this.usersService.findByVerificationToken(tokenStr);
    if (!user) throw new BadRequestException('Token inválido o expirado');
    await this.usersService.update(user.id, { isVerified: true, emailVerified: true, verificationToken: null });
    return { message: 'Email verificado correctamente' };
  }

  async resendVerification(tokenOrEmail: string) {
    // If an email was provided, resend by lookup
    if (tokenOrEmail && tokenOrEmail.includes && tokenOrEmail.includes('@')) {
      const userByEmail = await this.usersService.findByEmail(tokenOrEmail);
      if (!userByEmail) throw new NotFoundException('User not found');
      if ((userByEmail as any).isVerified || (userByEmail as any).emailVerified) throw new BadRequestException('Email already verified');
      await this.sendVerificationEmail((userByEmail as any).id, userByEmail.email);
      return;
    }

    // Otherwise, assume a JWT token was provided
    const user = await this.meFromToken(tokenOrEmail);
    if (!user) throw new BadRequestException('Usuario inválido');
    if (user.isVerified || user.emailVerified) throw new BadRequestException('Email already verified');
    await this.sendVerificationEmail(user.id, user.email);
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return; // don't reveal
    const token = randomUUID();
    const expiry = Date.now() + 1000 * 60 * 60; // 1h
    await this.usersService.update(user.id, { resetPasswordToken: token, resetPasswordExpires: expiry });
    const link = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password?token=${token}`;
    const html = `Pulsa para resetear tu contraseña: <a href="${link}">${link}</a>`;
    await this.mailer.sendMail(user.email, 'Resetear contraseña', html);
  }

  async resetPassword(tokenStr: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(tokenStr);
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) throw new BadRequestException('Token inválido o expirado');
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, { password: hashed, resetPasswordToken: null, resetPasswordExpires: null });
  }
}

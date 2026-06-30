import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  loading = signal(false);
  success = signal('');
  error = signal('');
  private usersService = inject(UsersService);
  private toast = inject(ToastService);

  // change password form
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  // change email form
  newEmail = '';
  emailPassword = '';
  

  async resend(): Promise<void> {
    this.error.set('');
    this.success.set('');
    this.loading.set(true);
    try {
      await firstValueFrom(this.auth.resendVerification());
      this.toast.success('Email reenviado');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al reenviar el email');
    } finally {
      this.loading.set(false);
    }
  }

  async changePassword(): Promise<void> {
    this.toast.info('');
    if (this.newPassword !== this.confirmNewPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }
    try {
      const { firstValueFrom } = await import('rxjs');
      await firstValueFrom(this.usersService.changeMyPassword({ currentPassword: this.currentPassword, newPassword: this.newPassword }));
      this.toast.success('Contraseña actualizada');
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar contraseña');
    }
  }

  async changeEmail(): Promise<void> {
    try {
      const { firstValueFrom } = await import('rxjs');
      await firstValueFrom(this.usersService.changeMyEmail({ newEmail: this.newEmail, password: this.emailPassword }));
      this.toast.success('Email actualizado');
      this.newEmail = '';
      this.emailPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar email');
    }
  }
}

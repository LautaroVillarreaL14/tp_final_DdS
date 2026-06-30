import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.html',
})
export class ResetPasswordPage {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private router = inject(Router);

  token = this.route.snapshot.queryParamMap.get('token') || '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  loading = signal(false);
  private toast = inject(ToastService);

  async submit(): Promise<void> {
    this.error = '';
    this.success = '';

    if (!this.token) {
      this.error = 'Token inválido';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.loading.set(true);
    try {
      await firstValueFrom(this.auth.resetPassword(this.token, this.password));
      this.toast.success('Contraseña actualizada');
      this.password = '';
      this.confirmPassword = '';
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al resetear contraseña');
    } finally {
      this.loading.set(false);
    }
  }
}

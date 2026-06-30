import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPasswordPage {
  private auth = inject(AuthService);

  email = '';
  error = '';
  message = '';
  loading = signal(false);
  private toast = inject(ToastService);

  async submit(): Promise<void> {
    this.error = '';
    this.message = '';
    if (!this.email) {
      this.error = 'Ingresá tu email';
      return;
    }

    this.loading.set(true);
    try {
      await firstValueFrom(this.auth.requestPasswordReset(this.email));
      this.toast.info('Si el email existe, recibirás un link');
      this.email = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al solicitar recuperación');
    } finally {
      this.loading.set(false);
    }
  }
}

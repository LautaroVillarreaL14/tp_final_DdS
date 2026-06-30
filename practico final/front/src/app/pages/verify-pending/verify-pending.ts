import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-pending',
  imports: [RouterLink],
  templateUrl: './verify-pending.html',
})
export class VerifyPendingPage {
  auth = inject(AuthService);
  loading = signal(false);
  success = signal('');
  error = signal('');
  private toast = inject(ToastService);

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
}

import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify',
  imports: [RouterLink],
  templateUrl: './verify.html',
})
export class VerifyPage {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  status = signal('Verificando...');
  private toast = inject(ToastService);

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!token) {
      this.status.set('Token no provisto');
    } else {
      this.auth.verifyEmail(token).subscribe({
        next: () => {
          this.status.set('Email verificado correctamente');
          this.toast.success('Email verificado correctamente');
        },
        error: () => {
          this.status.set('Token inválido o expirado');
          this.toast.error('Token inválido o expirado');
        },
      });
    }
  }
}

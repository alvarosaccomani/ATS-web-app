import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sso-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sso-callback.component.html',
  styleUrl: './sso-callback.component.scss',
})
export class SsoCallbackComponent implements OnInit {
  public status: 'loading' | 'success' | 'error' = 'loading';
  public errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.status = 'error';
      this.errorMessage = 'No se proporcionó un token de intercambio válido para la autenticación SSO.';
      return;
    }

    this.verifyToken(token);
  }

  private verifyToken(token: string): void {
    this.status = 'loading';
    this.authService.verifySSOToken(token).subscribe({
      next: () => {
        this.status = 'success';
        // Redirigir al backoffice tras verificar la identidad correctamente
        setTimeout(() => {
          this.router.navigate(['/user/backoffice-suite']);
        }, 1200);
      },
      error: (err: any) => {
        this.status = 'error';
        this.errorMessage = err.error?.error || err.error?.message || 'El token de intercambio SSO es inválido o ya ha expirado.';
      }
    });
  }

  public retryLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}

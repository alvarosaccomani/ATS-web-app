import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-confirm-account',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.scss'
})
export class ConfirmAccountComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) {
        this.status = 'error';
        this.errorMessage = 'El token de confirmación no fue proporcionado en la dirección web.';
        return;
      }
      this.confirmToken(token);
    });
  }

  private confirmToken(token: string): void {
    this.status = 'loading';
    this.authService.confirmAccount(token).subscribe({
      next: (response) => {
        this.status = 'success';
      },
      error: (error) => {
        this.status = 'error';
        this.errorMessage = error.error?.error || error.error?.message || 'El token de confirmación es inválido o ha expirado.';
      }
    });
  }
}

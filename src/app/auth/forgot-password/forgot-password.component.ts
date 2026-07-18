import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.forgotForm = this.fb.group({
      usr_email: ['', [Validators.required, Validators.email]]
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    const { usr_email } = this.forgotForm.value;

    this.authService.forgotPassword(usr_email).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Te enviamos las instrucciones para restablecer tu contraseña a tu casilla de correo.';
        this.forgotForm.reset();
        this.submitted = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || error.error?.message || 'No se pudo procesar la solicitud de recuperación.';
      }
    });
  }
}

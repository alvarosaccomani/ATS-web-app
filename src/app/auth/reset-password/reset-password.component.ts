import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  submitted = false;
  token = '';
  tokenMissing = false;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.tokenMissing = true;
        this.errorMessage = 'El token de restauración de contraseña es inválido o no se encuentra en la dirección web.';
      }
    });
    this.initForm();
  }

  private initForm(): void {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validador personalizado para comprobar que las contraseñas coinciden
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.resetForm.invalid || this.tokenMissing) {
      return;
    }

    this.loading = true;
    const { newPassword } = this.resetForm.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = '¡Tu contraseña ha sido restablecida con éxito! Ya podés iniciar sesión con tus nuevas credenciales.';
        this.resetForm.reset();
        this.submitted = false;
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || error.error?.message || 'Ocurrió un error al restablecer la contraseña. El token puede haber expirado.';
      }
    });
  }
}

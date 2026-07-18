import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  loading = false;

  // Estados para feedback visual de disponibilidad en tiempo real
  nickChecking = false;
  nickExists = false;
  emailChecking = false;
  emailExists = false;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      usr_name: ['', [Validators.required, Validators.minLength(2)]],
      usr_surname: ['', [Validators.required, Validators.minLength(2)]],
      usr_nick: ['', [Validators.required, Validators.minLength(3)]],
      usr_email: ['', [Validators.required, Validators.email]],
      usr_password: ['', [Validators.required, Validators.minLength(6)]],
      usr_confirm_password: ['', [Validators.required]],
      // Campos opcionales o con valores por defecto del sistema
      usr_image: [''],
      usr_bio: [''],
      usr_sysadmin: [false]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validador personalizado para comprobar que las contraseñas coinciden
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('usr_password');
    const confirmPassword = control.get('usr_confirm_password');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // Verifica disponibilidad de nick en el blur del input
  public onNickBlur(): void {
    const nickControl = this.registerForm.get('usr_nick');
    if (nickControl && nickControl.valid) {
      this.nickChecking = true;
      this._authService.checkNickExist(nickControl.value).subscribe({
        next: (res) => {
          this.nickChecking = false;
          this.nickExists = res.data;
          if (res.data) {
            nickControl.setErrors({ nickTaken: true });
          }
        },
        error: () => {
          this.nickChecking = false;
        }
      });
    }
  }

  // Verifica disponibilidad de email en el blur del input
  public onEmailBlur(): void {
    const emailControl = this.registerForm.get('usr_email');
    if (emailControl && emailControl.valid) {
      this.emailChecking = true;
      this._authService.checkEmailExist(emailControl.value).subscribe({
        next: (res) => {
          this.emailChecking = false;
          this.emailExists = res.data;
          if (res.data) {
            emailControl.setErrors({ emailTaken: true });
          }
        },
        error: () => {
          this.emailChecking = false;
        }
      });
    }
  }

  // Envía el formulario de registro
  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = { ...this.registerForm.value };
    delete formValue.usr_confirm_password; // El backend no requiere la confirmación

    this._authService.register(formValue).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = '¡Cuenta creada con éxito! Revisa tu email para confirmar tu cuenta.';
        this.registerForm.reset();
        this.submitted = false;
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/public/home']);
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || error.error?.message || 'Ocurrió un error al registrar la cuenta.';
      }
    });
  }
}

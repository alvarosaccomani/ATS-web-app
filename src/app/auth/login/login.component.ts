import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      usr_user: ['', [Validators.required]],
      usr_password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.loading = false;
        // Redirigir a la landing page o al dashboard tras un login exitoso
        this.router.navigate(['/user/backoffice-suite']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || err.error?.message || 'Usuario o contraseña incorrectos.';
      }
    });
  }
}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  if (_authService.isLoggedIn()) {
    return true;
  }

  // Redirigir al login si el usuario no está autenticado
  router.navigate(['/auth/login']);
  return false;
};

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Verificamos si window y localStorage están disponibles (para SSR)
  if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    // Si hay un token, permitimos el acceso a la ruta
    return true;
  } else {
    // Si no hay token, redirigimos al login
    router.navigate(['/login']);
    return false;
  }
};
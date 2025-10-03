import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const router = inject(Router);

  if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    return true; // deja pasar
  } else {
    return router.createUrlTree(['/login']); // redirige a login si no está autenticado
  }
};

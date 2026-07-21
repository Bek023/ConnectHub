import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorage } from '../services/token-storage/token-storage';

export const authGuard: CanActivateFn = () => {
  const tokenStorage = inject(TokenStorage);
  const router = inject(Router);

  if (tokenStorage.hasSession()) {
    return true;
  }

  router.navigate(['/welcome']);
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const tokenStorage = inject(TokenStorage);
  const router = inject(Router);

  if (!tokenStorage.hasSession()) {
    return true;
  }

  router.navigate(['/feed']);
  return false;
};

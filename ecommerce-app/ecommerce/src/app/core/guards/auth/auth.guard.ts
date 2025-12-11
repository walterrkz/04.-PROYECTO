import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../../store/auth/auth.selectors';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);

  let isAuth = false;

  store
    .select(selectIsAuthenticated)
    .pipe(take(1))
    .subscribe({
      next: (isAuthenticated) => {
        isAuth = isAuthenticated;
      },
    });

  if (isAuth) return true;

  router.navigateByUrl('/login');
  return false;
};

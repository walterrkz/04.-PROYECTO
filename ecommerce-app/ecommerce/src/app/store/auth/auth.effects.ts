import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth/auth.service';
import { ProfileService } from '../../core/services/profile/profile.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          tap((res) => {
            // ✅ guardar tokens para que el interceptor los use
            localStorage.setItem('token', res.token);
            localStorage.setItem('refreshToken', res.refreshToken);
          }),
          map(() => AuthActions.loginSuccess()),
          catchError((error) => {
            this.authService.emitLoginError(error);
            return of(AuthActions.loginFailure({ error }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigateByUrl('/')),
      map(() => AuthActions.loadUser())
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUser),
      mergeMap(() => {
        if (!this.authService.isLoggedIn()) {
          return of(AuthActions.logout());
        }

        return this.profileService.getProfile().pipe(
          map((response) =>
            AuthActions.loadUserSuccess({ user: response.user })
          ),
          catchError((error) => of(AuthActions.loadUserFailure({ error })))
        );
      })
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.authService.logout()),
        tap(() => this.router.navigateByUrl('/login'))
      ),
    { dispatch: false }
  );
}

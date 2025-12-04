import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProfileService } from '../../core/services/profile/profile.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);

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
        map(() => this.authService.logout())
      ),
    { dispatch: false }
  );
}

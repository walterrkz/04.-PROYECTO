import { createAction, props } from '@ngrx/store';
import type { User } from '../../core/types/User';
import type { UserCredentials } from '../../core/types/User';

export const loadUser = createAction('[Auth] Load User');

export const loadUserSuccess = createAction(
  '[Auth] Load User Success',
  props<{ user: User }>()
);

export const loadUserFailure = createAction(
  '[Auth] Load User Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: UserCredentials }>()
);

export const loginSuccess = createAction('[Auth] Login Success');

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

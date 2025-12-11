import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialAuthState } from './auth.models';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
  })),

  on(AuthActions.loadUserFailure, (state) => ({
    ...state,
    user: null,
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
  }))
);

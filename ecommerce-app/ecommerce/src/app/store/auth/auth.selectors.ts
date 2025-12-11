import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { AuthState } from './auth.models';

export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(selectAuth, (state) => state.user);

export const selectIsAuthenticated = createSelector(selectUser, (user) => !!user);

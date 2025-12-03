import type { User } from "../../core/types/User";

export interface AuthState {
  user: User | null;
}

export const initialAuthState: AuthState = {
  user: null,
};
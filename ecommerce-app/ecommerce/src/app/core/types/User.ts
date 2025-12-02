export type UserRole = 'admin' | 'user' | 'guest';

/** Versión “pública” (lo que debería llegar al frontend). */
export type User = {
  _id: string;
  displayName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

/** Versión “interna” de servidor (incluye hashPassword). */
export type UserDoc = User & {
  hashPassword: string;
};
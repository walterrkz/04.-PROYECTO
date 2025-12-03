export type UserRole = 'admin' | 'user' | 'guest';

export type User = {
  _id: string;
  displayName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type UserDoc = User & {
  hashPassword: string;
};

export type ProfileResponse = {
  message: string;
  user: User;
};
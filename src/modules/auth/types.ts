/**
 * Auth module types
 */

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  createdAt: Date;
}

export interface Session {
  userId: string;
  email: string;
  expiresAt: Date;
}

export interface AuthError {
  code: string;
  message: string;
}

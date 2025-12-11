export interface AuthenticatedUser {
  id: number;
  email: string;
  username: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
}
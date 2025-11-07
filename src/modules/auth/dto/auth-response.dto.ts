// auth-response.dto.ts
export class AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export interface JwtPayloadDto {
  sub: string;   // always string
  email: string;
}
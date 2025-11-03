// auth-response.dto.ts
export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}
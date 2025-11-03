import { isEmail, IsEmail, IsOptional, IsString } from "class-validator";

export class LoginUserDTO {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    id_token?: string;
}
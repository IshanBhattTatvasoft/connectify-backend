import { IsDefined, isEmail, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Trim } from 'src/decorators';
import { ErrorType } from 'src/helper/enum';
import { ErrorMessages } from 'src/helper/messages';

export class LoginUserDTO {
  @Trim()
  @IsEmail({}, { message: ErrorMessages[ErrorType.InvalidEmail] })
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  password: string;

  @IsOptional()
  @IsString()
  id_token?: string;
}

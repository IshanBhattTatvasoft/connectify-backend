import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength
} from 'class-validator';
import { Trim } from 'src/decorators';
import { ErrorMessages, ErrorType } from 'src/helper';
import { RESET_PASSWORD_REGEX } from 'src/helper/constants';

export class SendOtpDto {
  @Trim()
  @IsEmail({}, { message: ErrorMessages[ErrorType.InvalidEmail] })
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  email: string;
}

export class VerifyOtpDto {
  @Trim()
  @IsEmail({}, { message: ErrorMessages[ErrorType.InvalidEmail] })
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @Trim()
  @Length(6, 6)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  otp: string;
}

export class ResetPasswordDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  token: string;

  @Trim()
  @Matches(RESET_PASSWORD_REGEX, {
    message: ErrorMessages[ErrorType.InvalidPassword]
  })
  @IsNotEmpty()
  @IsDefined()
  password: string;
}

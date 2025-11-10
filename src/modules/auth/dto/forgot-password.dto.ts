import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength
} from 'class-validator';
import { Trim } from 'src/decorators';
import { ErrorMessages, ErrorType } from 'src/helper';

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

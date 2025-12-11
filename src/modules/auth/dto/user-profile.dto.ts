import { IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf, ValidationArguments } from "class-validator";
import { Trim } from "src/decorators";
import { ErrorMessages, ErrorType, MOBILE_NUMBER_REGEX } from "src/helper";

export class GetProfileResponseDto {
    username: string;
    email: string;
    mobile_no?: string;
    address?: string;
    created_date: Date;
    communities?: string[];
}

export class UpdateProfileDto {
  @Trim()
  @Matches(MOBILE_NUMBER_REGEX, {
    message: (args: ValidationArguments) =>
      `${args.property}: ${ErrorMessages[ErrorType.InvalidMobileNumber]}`
  })
  @MaxLength(20)
  @MinLength(10)
  @IsString()
  @IsOptional()
  mobile_number?: string;

  @MaxLength(100)
  @MinLength(10)
  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateProfileResponseDto{
    username: string;
    email: string;
    mobile_no?: string;
    address?: string;
}
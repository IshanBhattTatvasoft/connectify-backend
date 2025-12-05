import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  ValidationArguments,
  IsDefined,
  Length,
  ValidateIf,
  IsOptional
} from 'class-validator';
import { Trim } from 'src/decorators';
import {
  ALPHABETS_UNDERSCORE_REGEX,
  ALPHANUMERIC_SPACE_DASH_REGEX,
  ErrorMessages,
  ErrorType
} from 'src/helper';

export class AddLookupDetailDto {
  @Trim()
  @Matches(ALPHANUMERIC_SPACE_DASH_REGEX, {
    message: (args: ValidationArguments) =>
      `${args.property}: ${ErrorMessages[ErrorType.OnlyAlphaNumericSpaceDashAllowed]}`
  })
  @ValidateIf((obj: AddLookupDetailDto) => obj.name !== '')
  @Length(3, 100)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @Trim()
  @Matches(ALPHABETS_UNDERSCORE_REGEX, {
    message: (args: ValidationArguments) =>
      `${args.property}: ${ErrorMessages[ErrorType.OnlyAlphabetsUnderscoreAllowed]}`
  })
  @ValidateIf((obj: AddLookupDetailDto) => obj.code !== '')
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  code: string;
}
import { IsDefined, IsNotEmpty, IsOptional, IsString, Length, Matches, ValidationArguments } from "class-validator";
import { Trim } from "src/decorators";
import { ALPHABETS_ONLY_REGEX, ALPHABETS_UNDERSCORE_REGEX, ALPHANUMERIC_SPACE_DASH_REGEX, ErrorMessages, ErrorType } from "src/helper";

export class CreateCommunityDto {
    @Trim()
    @Matches(ALPHABETS_UNDERSCORE_REGEX, {
        message: (args: ValidationArguments) =>
            `${args.property}: ${ErrorMessages[ErrorType.OnlyAlphabetsUnderscoreAllowed]}`
    })
    @Length(3, 30)
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    name: string;

    @Trim()
    @Matches(ALPHABETS_ONLY_REGEX, {
        message: (args: ValidationArguments) =>
            `${args.property}: ${ErrorMessages[ErrorType.OnlyAlphabetsAllowed]}`
    })
    @Length(5, 50)
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    subTitle: string;

    @Trim()
    @Matches(ALPHANUMERIC_SPACE_DASH_REGEX, {
        message: (args: ValidationArguments) =>
            `${args.property}: ${ErrorMessages[ErrorType.OnlyAlphaNumericSpaceDashAllowed]}`
    })
    @IsString()
    @IsOptional()
    @Length(20, 200)
    description: string;

    @Trim()
    @Matches(ALPHABETS_UNDERSCORE_REGEX, {
        message: (args: ValidationArguments) =>
            `${args.property}: ${ErrorMessages[ErrorType.OnlyAlphabetsUnderscoreAllowed]}`
    })
    @Length(4, 20)
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    category: string;
}
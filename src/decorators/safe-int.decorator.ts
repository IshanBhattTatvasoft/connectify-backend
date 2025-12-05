import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { ErrorMessages, ErrorType } from "src/helper";
import { SAFE_INTEGER_RANGE } from "src/helper/constants";

export function SafeInt(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'SafeInt',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'number' || !Number.isInteger(value)) {
            return false;
          }
          return value >= 0 && value <= SAFE_INTEGER_RANGE;
        },
        defaultMessage(args: ValidationArguments) {
          return ErrorMessages[ErrorType.SafeIntError]
            .replace('[#PROPERTY_NAME#]', args.property)
            .replace('[#SAFE_INTEGER_RANGE#]', SAFE_INTEGER_RANGE.toString());
        }
      }
    });
  };
}
export const RESET_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/; // eslint-disable-line no-useless-escape
export const ALPHABETS_ONLY_REGEX = /^[A-Za-z]+$/;
export const MOBILE_NUMBER_REGEX = /^\+?\d+$/;
export const ALPHA_SPACE_REGEX = /^[a-zA-Z\s]+$/;
export const AlPHA_NUMERIC_SPECIAL_CHARACTERS_REGEX =
  /^[a-zA-Z0-9\s\-\_',.#\/\\]+$/; // eslint-disable-line no-useless-escape
export const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9\s]+$/;
export const ALPHANUMERIC_SPACE_DASH_REGEX = /^[A-Za-z0-9\- ]+$/;
export const ALPHABETS_UNDERSCORE_REGEX = /^[A-Za-z_]+$/;

export const SAFE_INTEGER_RANGE = 2147483647;
export enum ErrorType {
  // Common Errors
  NotFound = 'Common.NotFound',
  BadRequest = 'Common.BadRequest',
  Unauthorized = 'Common.Unauthorized',
  Conflict = 'Common.Conflict',
  InternalServerError = 'Common.InternalServerError',
  SafeIntError = 'Common.SafeIntError',
  OnlyAlphaNumericSpaceDashAllowed = 'Commmon.OnlyAlphaNumericSpaceDashAllowed',
  OnlyAlphabetsUnderscoreAllowed = 'Common.OnlyAlphabetsUnderscoreAllowed',

  // Auth Errors
  InvalidEmail = 'Auth.InvalidEmail',
  InvalidCredentials = 'Auth.InvalidCredentials',
  InvalidGoogleToken = 'Auth.InvalidGoogleToken',
  AccountNotActive = 'Auth.AccountNotActive',
  InvalidPassword = 'Auth.InvalidPassword',
  EmailPasswordRequired = 'Auth.EmailPasswordRequired',
  UserNotFound = 'Auth.UserNotFound',

  // Lookup Errors
  LookupNotFound = 'Lookup.LookupNotFound',
  LookupValueExists = 'Lookup.LookupValueExists'
}

// Namespace grouping for dot-style usage
export namespace ErrorType {
  export const Common = {
    NotFound: ErrorType.NotFound,
    BadRequest: ErrorType.BadRequest,
    Unauthorized: ErrorType.Unauthorized,
    Conflict: ErrorType.Conflict,
    InternalServerError: ErrorType.InternalServerError,
    SafeIntError: ErrorType.SafeIntError,
    OnlyAlphaNumericSpaceDashAllowed: ErrorType.OnlyAlphaNumericSpaceDashAllowed,
    OnlyAlphabetsUnderscoreAllowed: ErrorType.OnlyAlphabetsUnderscoreAllowed
  };

  export const Auth = {
    InvalidEmail: ErrorType.InvalidEmail,
    InvalidCredentials: ErrorType.InvalidCredentials,
    InvalidGoogleToken: ErrorType.InvalidGoogleToken,
    AccountNotActive: ErrorType.AccountNotActive,
    InvalidPassword: ErrorType.InvalidPassword,
    EmailPasswordRequired: ErrorType.EmailPasswordRequired,
    UserNotFound: ErrorType.UserNotFound
  };

  export const Lookup = {
    LookupNotFound: ErrorType.LookupNotFound,
    LookupValueExists: ErrorType.LookupValueExists
  }
}

export enum UsersOperation {
  LOGIN = 'USER_LOGIN',
  SIGNUP = 'SIGNUP',
  OTP_SENT = 'OTP_SENT',
  RESET_PASSWORD = 'RESET_PASSWORD'
}

export enum LookupsOperation {
  CREATED = 'CREATED'
}
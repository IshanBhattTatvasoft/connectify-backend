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
  OnlyAlphabetsAllowed = 'Common.OnlyAlphabetsAllowed',
  InvalidMobileNumber = 'Common.InvalidMobileNumber',
  InvalidAddress = 'Common.InvalidAddress',

  // Auth Errors
  InvalidEmail = 'Auth.InvalidEmail',
  InvalidCredentials = 'Auth.InvalidCredentials',
  InvalidGoogleToken = 'Auth.InvalidGoogleToken',
  AccountNotActive = 'Auth.AccountNotActive',
  InvalidPassword = 'Auth.InvalidPassword',
  EmailPasswordRequired = 'Auth.EmailPasswordRequired',
  UserNotFound = 'Auth.UserNotFound',
  ExpiredOtp = 'Auth.ExpiredOtp',
  InvalidOtp = 'Auth.InvalidOtp',
  InvalidToken = 'Auth.InvalidToken',

  // Lookup Errors
  LookupNotFound = 'Lookup.LookupNotFound',
  LookupValueExists = 'Lookup.LookupValueExists',

  // Community Errors
  CommunityAlreadyExists = 'Community.CommunityAlreadyExists',
  CategoryNotFound = 'Community.CategoryNotFound'
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
    OnlyAlphabetsUnderscoreAllowed: ErrorType.OnlyAlphabetsUnderscoreAllowed,
    OnlyAlphabetsAllowed: ErrorType.OnlyAlphabetsAllowed,
    InvalidMobileNumber: ErrorType.InvalidMobileNumber,
    InvalidAddress: ErrorType.InvalidAddress
  };

  export const Auth = {
    InvalidEmail: ErrorType.InvalidEmail,
    InvalidCredentials: ErrorType.InvalidCredentials,
    InvalidGoogleToken: ErrorType.InvalidGoogleToken,
    AccountNotActive: ErrorType.AccountNotActive,
    InvalidPassword: ErrorType.InvalidPassword,
    EmailPasswordRequired: ErrorType.EmailPasswordRequired,
    UserNotFound: ErrorType.UserNotFound,
    ExpiredOtp: ErrorType.ExpiredOtp,
    InvalidOtp: ErrorType.InvalidOtp,
    InvalidToken: ErrorType.InvalidToken,
  };

  export const Community = {
    CommunityAlreadyExists: ErrorType.CommunityAlreadyExists,
    CategoryNotFound: ErrorType.CategoryNotFound
  }

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

export enum CommunityOperation {
  CREATE = 'Community created successfully'
}

export enum Lookup {
  ACCOUNT_STATUS = 'ACCOUNT_STATUS',
  POST_TYPE = 'POST_TYPE',
  ROLE = 'ROLE'
}

export enum LookupDetails {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  OWNER = 'OWNER',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER'
}
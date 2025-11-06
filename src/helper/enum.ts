export enum ErrorType {
  NotFound = 'NotFound',
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  Conflict = 'Conflict',
  InternalServerError = 'InternalServerError',
  InvalidEmail = 'InvalidEmail',
  InvalidCredentials = 'InvalidCredentials',
  InvalidGoogleToken = 'InvalidGoogleToken'
}

export enum UsersOperation {
  LOGIN = 'USER_LOGIN',
  SIGNUP = 'SIGNUP'
}
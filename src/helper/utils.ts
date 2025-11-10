import { UsersOperation } from "./enum";
import { Messages } from "./messages";

export function getDateAndTime(): Date {
    return new Date();
}

export function getMessageByCode(messageKey: string): string {
  switch (messageKey) {
    case UsersOperation.LOGIN:
      return Messages.UserMessages.Login;
    case UsersOperation.SIGNUP:
      return Messages.UserMessages.Signup;
    case UsersOperation.OTP_SENT:
      return Messages.UserMessages.Otp_Sent;

    default:
      return Messages.InternalServerError;
  }
}
import { User } from 'src/modules/users/model/users.model';
import { LookupsOperation, UsersOperation } from './enum';
import { Messages } from './messages';
import { Mailer } from './mailer';
import * as crypto from 'crypto';
import bcrypt from "bcrypt";
import { LookupDetail } from 'src/modules/lookups/interface/lookup_detail.interface';

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
    case UsersOperation.RESET_PASSWORD:
      return Messages.UserMessages.ResetPassword
    
    case LookupsOperation.CREATED:
      return Messages.LookupMessages.Created;

    default:
      return Messages.InternalServerError;
  }
}

export async function sendVerificationEmail(
  user: User,
  email: string,
  generatedOTP: string,
  expiresIn: string,
) {
  const subject = 'Your Password Reset Verification Code';
  const htmlMessage = `
    <p>Dear ${user.username},</p>
    <p>You have requested to reset your password.<br>Your verification code is: <strong>${generatedOTP}</strong></p>
    <p>This code is valid for <strong>${expiresIn}</strong> only. For security reasons, please do not share this code with anyone.</p>
    <p>Thank you,<br>Connectify Support Team</p>
  `;
  await Mailer.sendMail(email, subject, htmlMessage);
}

export const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString(); // 6-digit OTP
};

export const hashOtp = async (otp: string, saltRounds = 10) => {
  return bcrypt.hash(otp, saltRounds);
};

export const verifyOtpHash = async (otp: string, hash: string) => {
  return bcrypt.compare(otp, hash);
};

export function toLookupDetailResponse(doc: any): LookupDetail {
  return {
    id: doc._id,
    code: doc.code,
    name: doc.name,
  };
}

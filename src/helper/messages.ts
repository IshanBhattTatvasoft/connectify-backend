import { ErrorType } from './enum';

export const ErrorMessages: Record<ErrorType, string> = {
  [ErrorType.NotFound]:
    'Requested resource not found or you do not have permission to access.',
  [ErrorType.BadRequest]: 'Invalid input provided.',
  [ErrorType.Conflict]: 'A conflict occurred with existing data.',
  [ErrorType.Unauthorized]: 'You are not authorized to perform this action.',
  [ErrorType.InternalServerError]:
    'There was some technical error processing this request. Please try again.',
  [ErrorType.InvalidEmail]: 'Please enter a valid email address.',
  [ErrorType.InvalidCredentials]: 'Invalid credentials',
  [ErrorType.InvalidGoogleToken]: 'Invalid Google Token',
  [ErrorType.AccountNotEnabled]:
    'Your account is not enabled. Please contact your system administrator.',
};

export const Messages = {
  InternalServerError:
    'There was some technical error processing this request. Please try again.',
  UserMessages: {
    Login: 'Login successful',
    Signup: 'Sign up successful',
    Otp_Sent: 'Verification OTP sent successfully',
    UpdatePassword: 'Password updated successfully',
    ResetPassword: 'Password reset successfully',
    Fetched: 'User details fetched successfully',
    User_Update: 'User details updated successfully',
    Fetched_Users_List: 'Users list fetched successfully',
    ResendPassword: 'Password setup link has been resent successfully.',
    UserCreated: 'User added successfully.',
    UserStatusUpdated: 'User Status updated successfully.',
    Deleted: 'User Deleted Successfully.'
  }
};
/* eslint-disable prettier/prettier */

import * as crypto from 'crypto';
import * as otpGenerator from 'otp-generator';

// reset token for reset password request
export function generateResetToken(): string {
  const tokenLength = 20; // Adjust the desired token length
  const resetToken = crypto.randomBytes(tokenLength).toString('hex');
  return resetToken;
}

/* eslint-disable prettier/prettier */

import * as crypto from 'crypto';
import * as otpGenerator from 'otp-generator';

// reset token for reset password request
export function generateResetToken(): string {
  const tokenLength = 20; // Adjust the desired token length
  const resetToken = crypto.randomBytes(tokenLength).toString('hex');
  return resetToken;
}

// otp generator, will be used in sign-up
export function generateOTP(): string {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: true,
    upperCase: true,
    specialChars: false,
  });
}

// otp expiry function
export function calculateOTPExpiry(otpExpiration: Date) {
  const currentDate = new Date();
  const otpExpirationTime = new Date(otpExpiration).getTime();
  const currentTime = currentDate.getTime();
  const otpValidate = (otpExpirationTime - currentTime) / (1000 * 60); // Calculate the difference in minutes
  const minutes = Math.floor(Math.abs(otpValidate)); // Round down to get the minutes
  const isExpired = minutes > 1; // Check if OTP is expired

  return { minutes, isExpired };
}

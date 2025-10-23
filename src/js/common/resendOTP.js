
import { sendOtp } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";

export function initResendOtp(resendBtn, getEmail) {

  if (!resendBtn) {
    return;
  }

  resendBtn.addEventListener("click", () => handleResendOtp(getEmail));
}

export async function handleResendOtp(getEmail) {
  const email = getEmail();

  if (!email) {
    showError("Email not found");
    return;
  }

  try {
    await processOtpResend(email);

  } catch (err) {
    // console.error(err);
    showError(err.message || "An error occurred while resending OTP");
  }
}

export async function processOtpResend(email) {
  const response = await sendOtp(email);

  if (response.success) {
    showSuccess(response.message);
  } else {
    showError(response.error);
  }
}

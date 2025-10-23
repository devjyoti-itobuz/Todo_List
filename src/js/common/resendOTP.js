// import { getResendButton } from "../utils/domHandler.js";
import { sendOtp } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";
import { common } from "../utils/domHandler.js";

export function initResendOtp(resendBtnId, getEmail) {
  const resendBtn = common.getResendButton(resendBtnId);

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
    console.error(err);
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

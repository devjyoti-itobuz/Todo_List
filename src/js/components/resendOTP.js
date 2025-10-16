import { sendOTP } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";

export function initResendOTP(resendBtnId, getEmail) {
  document.getElementById(resendBtnId).addEventListener("click", async (e) => {
    e.preventDefault();

    const email = getEmail();

    if (!email) {
      showError("Email not found");
      return;
    }

    try {
      await sendOTP(email);
      showSuccess("OTP resent successfully!");
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to resend OTP");
    }
  });
}

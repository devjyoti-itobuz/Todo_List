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
      const response = await sendOTP(email);
      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess(data.message || "OTP resent successfully!");
      } else {
        showError(data.message || "Failed to resend OTP");
      }

    } catch (err) {
      console.error(err);
      showError("An error occurred while resending OTP");
    }
  });
}

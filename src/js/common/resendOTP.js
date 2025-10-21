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

      if (response.success) {
        showSuccess(response.message);
      } 
      else {
        showError(response.error);
      }

    } catch (err) {
      console.error(err);
      showError("An error occurred while resending OTP");
    }
  });
}

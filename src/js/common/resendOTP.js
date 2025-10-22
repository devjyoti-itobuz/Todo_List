import { sendOtp } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";

export function initResendOtp(resendBtnId, getEmail) {
  document.getElementById(resendBtnId).addEventListener("click", async (e) => {

    const email = getEmail();

    if (!email) {
      showError("Email not found");
      return;
    }

    try {
      const response = await sendOtp(email);

      if (response.success) {
        showSuccess(response.message);
      } 
      else {
        showError(response.error);
      }

    } catch (err) {
      console.error(err);
      showError(err.message || "An error occurred while resending OTP");
    }
  });
}

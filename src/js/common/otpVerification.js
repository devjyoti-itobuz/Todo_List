import { verifyOTP, getOTPFromInputs } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";
import * as bootstrap from "bootstrap";

export function initOTPVerification(verifyBtnId, modalId, getEmail) {
  document.getElementById(verifyBtnId).addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = getEmail();
    const otp = getOTPFromInputs();

    if (otp.length !== 6) {
      showError("Please enter the full OTP");
      return;
    }

    try {
      const data = await verifyOTP(email, otp);

      if (data.success) {

        showSuccess(
          data.message || "Email verified successfully! You can now log in."
        );

        const modalEl = document.getElementById(modalId);
        const modal = bootstrap.Modal.getInstance(modalEl);

        if (modal) {
          modal.hide();
        } 
        else {
          modalEl.classList.remove("show");
          modalEl.style.display = "none";
          document.body.classList.remove("modal-open");
          const backdrop = document.querySelector(".modal-backdrop");

          if (backdrop) {
            backdrop.remove();
          }
        }
        sessionStorage.removeItem("signupEmail");

      } else {
        showError(data.error || "OTP verification failed.");
      }
      
    } catch (error) {
      showError(error.message || "An error occurred during OTP verification.");
    }
  });
}
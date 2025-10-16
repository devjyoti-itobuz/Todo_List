import { verifyOTP, getOTPFromInputs } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";
import * as bootstrap from "bootstrap";

export function initOTPVerification(verifyBtnId, modalId, getEmail) {
  document.getElementById(verifyBtnId).addEventListener("click", async () => {
    const email = getEmail();
    const otp = getOTPFromInputs();

    if (otp.length !== 6) {
      showError("Please enter the full OTP");
      return;
    }

    try {
      await verifyOTP(email, otp);

      showSuccess("Email verified successfully! You can now log in.");

      const modalEl = document.getElementById(modalId);
      // const modal = new bootstrap.Modal(modalEl);
      // modal.hide();
      modalEl.classList.remove("show");
      modalEl.style.display = "none";
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      
      if (backdrop) {
        backdrop.remove();
      }

      sessionStorage.removeItem("signupEmail");
    } catch (error) {
      console.error(error);
      showError("OTP verification failed.");
    }
  });
}

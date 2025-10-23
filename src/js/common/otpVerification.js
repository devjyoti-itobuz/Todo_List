import { verifyOtp, getOtpFromInputs } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";
import * as bootstrap from "bootstrap";

export function initOtpVerification(verifyFormId, modalId, getEmail) {
  verifyFormId
    .addEventListener("submit", (e) => otpVerify(e, modalId, getEmail));
} 

export async function otpVerify(e, modalId, getEmail) {
  e.preventDefault();

  const email = getEmail();
  const otp = getOtpFromInputs();

  if (otp.length !== 6) {
    showError("Please enter the full OTP");
    return;
  }

  try {
    const data = await verifyOtp(email, otp);

    if (data.success) {
      showSuccess(data.message);

      // const modalEl = document.getElementById(modalId);
      const modal = bootstrap.Modal.getInstance(modalId);

      if (modal) {
        modal.hide();
      } else {
        modalId.classList.remove("show");
        modalId.style.display = "none";
        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");

        if (backdrop) {
          backdrop.remove();
        }
      }
      sessionStorage.removeItem("signupEmail");
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError(error.message || "An error occurred during OTP verification.");
  }
};
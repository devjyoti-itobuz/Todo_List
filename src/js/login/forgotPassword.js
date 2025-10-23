import { showError, showSuccess } from "../utils/toastHelper.js";
import displayTemplates from "../utils/utilFn.js";
import * as bootstrap from "bootstrap";

export function initForgotPassword(
  sendResetOtpId,
  resetPasswordBtnId,
  resetEmailInputId,
  otpInputId,
  newPasswordInputId,
  forgotPasswordModalId,
  resetPasswordModalId
) {

  async function handleSendOtp(e) {
    e.preventDefault();
    const email = resetEmailInputId.value.trim();

    if (!email) {
      showError("Please enter your email.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/user/auth/forgot-password/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        window.emailForVerification = email;
        showSuccess(data.message);

        const forgotModal = bootstrap.Modal.getInstance(forgotPasswordModalId);
        forgotModal.hide();

        const resetModal =
          bootstrap.Modal.getOrCreateInstance(resetPasswordModalId);

        resetModal.show();
      } else {
        showError(data.error);
      }

    } catch (error) {
      // console.error(error);
      showError("Something went wrong while sending OTP.");
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();

    const otp = otpInputId.value.trim();
    const newPassword = newPasswordInputId.value.trim();

    if (!otp || !newPassword) {
      showError("Please fill in all fields.");
      return;
    }

    try {
      const resetRes = await fetch(
        "http://localhost:3000/user/auth/forgot-password/reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: window.emailForVerification,
            otp,
            newPassword,
          }),
        }
      );

      const resetData = await resetRes.json();

      if (resetRes.ok) {
        showSuccess(resetData.message);

        const resetModal =
          bootstrap.Modal.getOrCreateInstance(resetPasswordModalId);
        resetModal.hide();

        document
          .querySelectorAll(".modal-backdrop")
          .forEach((el) => el.remove());
      } else {
        showError(resetData.error);
      }

    } catch (error) {
      // console.error(error);
      showError("An error occurred while resetting your password.");
    }
  }

  sendResetOtpId.addEventListener("submit", handleSendOtp);
  resetPasswordBtnId.addEventListener("submit", handleResetPassword);
}

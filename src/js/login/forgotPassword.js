import { showError, showSuccess } from "../utils/toastHelper.js";
import * as bootstrap from "bootstrap";
import { sendForgotPasswordOtp, resetForgotPassword } from "../api/userApi.js";

export function initForgotPassword(
  sendResetOtpForm,
  resetPasswordForm,
  resetEmailInput,
  otpInput,
  newPasswordInput,
  forgotPasswordModal,
  resetPasswordModal
) {
  async function handleSendOtp(e) {
    e.preventDefault();
    const email = resetEmailInput.value.trim();

    if (!email) {
      showError("Please enter your email.");
      return;
    }

    try {
      const { ok, data } = await sendForgotPasswordOtp(email);

      if (ok) {
        window.emailForVerification = email;
        showSuccess(data.message);

        bootstrap.Modal.getInstance(forgotPasswordModal)?.hide();
        bootstrap.Modal.getOrCreateInstance(resetPasswordModal).show();
      } else {
        showError(data.error);
      }
    } catch (error) {
      showError(error.message || "Something went wrong while sending OTP.");
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    const otp = otpInput.value.trim();
    const newPassword = newPasswordInput.value.trim();

    if (!otp || !newPassword) {
      showError("Please fill in all fields.");
      return;
    }

    try {
      const { ok, data } = await resetForgotPassword(
        window.emailForVerification,
        otp,
        newPassword
      );

      if (ok) {
        showSuccess(data.message);

        const modal = bootstrap.Modal.getOrCreateInstance(resetPasswordModal);
        modal.hide();
        document
          .querySelectorAll(".modal-backdrop")
          .forEach((el) => el.remove());
      } else {
        showError(data.error);
      }
    } catch (error) {
      showError(
        error.message || "An error occurred while resetting your password."
      );
    }
  }

  sendResetOtpForm.addEventListener("submit", handleSendOtp);
  resetPasswordForm.addEventListener("submit", handleResetPassword);
}

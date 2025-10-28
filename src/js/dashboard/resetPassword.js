import { resetPassword } from "../utils/domHandler.js";
import { resetUserPassword } from "../api/userApi.js";
import { showError, showSuccess } from "../utils/toastHelper.js";
import * as bootstrap from "bootstrap";

export function initResetPassword() {
  resetPassword.resetPasswordForm.addEventListener(
    "submit",
    handleResetPasswordSubmit
  );
}

async function handleResetPasswordSubmit(e) {
  e.preventDefault();

  const email = localStorage.getItem("userEmail");
  const accessToken = localStorage.getItem("access_token");
  const currentPassword = resetPassword.resetCurrentPassword.value.trim();
  const newPassword = resetPassword.resetNewPassword.value.trim();

  if (!email || !accessToken) {
    showError("Authentication expired. Please log in again.");
    return;
  }

  if (!currentPassword || !newPassword) {
    showError("Please fill out both current and new password fields.");
    return;
  }

  try {
    const { ok, data } = await resetUserPassword(currentPassword, newPassword);

    if (ok && data.success) {
      showSuccess(data.message);

      const modal = bootstrap.Modal.getInstance(
        resetPassword.resetPasswordModal
      );
      modal.hide();

      resetPassword.resetPasswordForm.reset();
    } else {
      showError(data.error || "Failed to reset password.");
    }
  } catch (error) {
    showError(error.message || "An error occurred. Please try again later.");
  }
}

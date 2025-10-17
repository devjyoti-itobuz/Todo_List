import fetchWithAuth from "../api/fetchWithAuth.js";
import { showError, showSuccess } from "../utils/toastHelper.js";
import * as bootstrap from "bootstrap";

export function initResetPassword() {
  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = localStorage.getItem("userEmail");
      const accessToken = localStorage.getItem("access-token");
      const currentPassword = document
        .getElementById("resetCurrentPassword")
        .value.trim();

      const newPassword = document
        .getElementById("resetNewPassword")
        .value.trim();

      if (!email || !accessToken) {
        showError("Authentication expired. Please log in again.");
        return;
      }

      if (!currentPassword || !newPassword) {
        showError("Please fill out both current and new password fields.");
        return;
      }

      try {
        const response = await fetchWithAuth(
          "http://localhost:3000/auth/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentPassword, newPassword }),
          }
        );
        const data = await response.json();

        if (response.ok && data.success) {
          showSuccess(data.message || "Password reset successfully.");

          const modal = bootstrap.Modal.getInstance(
            document.getElementById("resetPasswordModal")
          );
          modal.hide();

          document.getElementById("resetPasswordForm").reset();
        } else {
          showError(data.message || "Failed to reset password.");
        }
      } catch (error) {
        console.error("Error resetting password:", error);

        showError("An error occurred. Please try again later.");
      }
    });
}

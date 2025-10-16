import { showError, showSuccess } from "../utils/toastHelper.js";
import * as bootstrap from "bootstrap";

export function initResetPassword() {
  document
    .getElementById("submitResetPassword")
    .addEventListener("click", async () => {

      const email = localStorage.getItem("userEmail");
      const currentPassword = document
        .getElementById("resetCurrentPassword")
        .value.trim();
      const newPassword = document
        .getElementById("resetNewPassword")
        .value.trim();

      if (!email) {
        showError("User email not found. Please log in again.");
        return;
      }

      if (!currentPassword || !newPassword) {
        showError("Please fill out both current and new password fields.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/auth/reset-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, currentPassword, newPassword }),
          }
        );
        const data = await response.json();

        if (response.ok && data.success) {
          showSuccess(data.message);
          
          const modal = bootstrap.Modal.getInstance(
            document.getElementById("resetPasswordModal")
          );
          modal.hide();
          document.getElementById("resetPasswordForm").reset();
        } 
        else {
          showError("Failed to reset password.");
        }

      } catch (error) {
        console.error("Error resetting password:", error);
        showError("An error occurred. Please try again later.");
      }
    });
}

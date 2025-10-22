import { showError, showSuccess } from "../utils/toastHelper.js";
import displayTemplates from "../utils/utilFn.js";
import * as bootstrap from "bootstrap";

const templates = new displayTemplates();

export function initForgotPassword({
  sendResetOtpId,
  resetPasswordBtnId,
  resetEmailInputId,
  otpInputId,
  newPasswordInputId,
  forgotPasswordModalId,
  resetPasswordModalId,
}) {
  let resetEmailGlobal = "";

  document
    .getElementById(sendResetOtpId)
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById(resetEmailInputId).value.trim();

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
          resetEmailGlobal = email;
          showSuccess(data.message);

          const forgotModal = bootstrap.Modal.getInstance(
            document.getElementById(forgotPasswordModalId)
          );
          forgotModal.hide();

          const resetModal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById(resetPasswordModalId)
          );

          resetModal.show();
        } else {
          showError(data.error);
        }
      } 
      catch (error) {
        console.error(error);
        showError("Something went wrong while sending OTP.");
      }
    });

  document
    .getElementById(resetPasswordBtnId)
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const otp = document.getElementById(otpInputId).value.trim();
      const newPassword = document
        .getElementById(newPasswordInputId)
        .value.trim();

      if (!otp || !newPassword) {
        showError("Please fill in all fields.");
        return;
      }

      try {
        // const verifyRes = await fetch(
        //   "http://localhost:3000/user/auth/forgot-password/verify-otp",
        //   {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email: resetEmailGlobal, otp }),
        //   }
        // );

        // const verifyData = await verifyRes.json();

        // if (!verifyRes.ok) {
        //   showError(verifyData.error);
        //   return;
        // }

        const resetRes = await fetch(
          "http://localhost:3000/user/auth/forgot-password/reset",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: resetEmailGlobal,
              otp,
              newPassword,
            }),
          }
        );

        const resetData = await resetRes.json();

        if (resetRes.ok) {
          showSuccess(resetData.message);

          const resetModalElement =
            document.getElementById(resetPasswordModalId);
          const resetModal =
            bootstrap.Modal.getOrCreateInstance(resetModalElement);
          resetModal.hide();
          document
            .querySelectorAll(".modal-backdrop")
            .forEach((el) => el.remove());
        } else {
          showError(resetData.error);
        }
      } catch (error) {
        console.error(error);
        showError("An error occurred while resetting your password.");
      }
    });
}

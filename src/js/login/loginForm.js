import { sendOTP, showOTPModal } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";

export function initLoginForm(formId) {
  document.getElementById(formId).addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // const errorMessage = data?.message || data?.error;

        switch (res.status) {
          case 403:
            showError(
              data.error || "User not verified. Please verify your email."
            );

            await sendOTP(email);

            showOTPModal(email);

            window.emailForVerification = email;
            return;

          case 401:
            showError(data.error || "Login failed, wrong credentials.");
            return;

          case 404:
            showError(data.error || "User not found.");
            return;

          default:
            showError(data.error || "Login failed. Please try again.");
            return;
        }
      }

      localStorage.setItem("access-token", data.accessToken);
      localStorage.setItem("refresh-token", data.refreshToken);
      localStorage.setItem("userEmail", email);

      showSuccess(data.message || "Login successful!");

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1000);
      
    } catch (err) {
      console.error("Unexpected login error:", err);
      showError("An unexpected error occurred during login.");
    }
  });
}

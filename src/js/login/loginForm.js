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
        
        if (res.status === 403) {

          showError("User not verified. Please verify your email.");

          await sendOTP(email);

          showOTPModal(email);
          window.emailForVerification = email;
          return;
        }

        if (res.status === 401) {
          showError("Login failed, wrong credentials.");
          return;
        }

        if (res.status === 404) {
          showError("User not found.");
          return;
        }

        showError("Login failed.");
        return;
      }

      localStorage.setItem("access-token", data.accessToken);
      localStorage.setItem("refresh-token", data.refreshToken);
      localStorage.setItem("userEmail", email);

      showSuccess("Login successful!");

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1000);

    } catch (err) {
      console.error(err);

      showError("Login failed");
    }
  });
}

import { sendOtp, showOtpModal } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";
import { login } from "../utils/domHandler.js";

export function initLoginForm() {
  login.loginForm.addEventListener("submit", handleLoginSubmit);
}

export async function handleLoginSubmit(e) {
  e.preventDefault();

  const email = login.loginEmail.value;
  const password = login.loginPassword.value;

  try {
    const res = await fetch("http://localhost:3000/user/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 403) {
        showError(data.error || "User not verified. Please verify your email.");

        await sendOtp(email);

        showOtpModal(email);

        window.emailForVerification = email;
      } else {
        showError(data.error || "Login failed.");
      }
      return;
    }

    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("userEmail", email);

    showSuccess(data.message);

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  } catch (err) {
    console.error("Unexpected login error:", err);
    showError("An unexpected error occurred during login.");
  }
}

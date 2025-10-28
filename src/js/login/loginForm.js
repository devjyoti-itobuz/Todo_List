import { loginUser, sendOtp } from "../api/userApi.js";
import { showOtpModal } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";
import { login } from "../utils/domHandler.js";

export function initLoginForm() {
  login.loginForm.addEventListener("submit", handleLoginSubmit);
}

export async function handleLoginSubmit(e) {
  e.preventDefault();

  const email = login.loginEmail.value.trim();
  const password = login.loginPassword.value.trim();

  if (!email || !password) {
    showError("Please enter both email and password.");
    return;
  }

  try {
    const { ok, status, data } = await loginUser(email, password);

    if (!ok) {
      
      if (status === 403) {
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
    
  } catch (error) {
    showError(error.message || "An unexpected error occurred during login.");
  }
}

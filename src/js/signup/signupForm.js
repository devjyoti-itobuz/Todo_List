import { registerUser, sendOtp } from "../api/userApi.js";
import { showOtpModal } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";
import { signup } from "../utils/domHandler.js";

export function initSignupForm() {
  signup.signupForm.addEventListener("submit", handleSignupSubmit);
}

export async function handleSignupSubmit(e) {
  e.preventDefault();

  const email = signup.signupEmail.value.trim();
  const password = signup.signupPassword.value.trim();

  if (!email || !password) {
    showError("Please enter both email and password.");
    return;
  }

  try {
    const { ok, data } = await registerUser(email, password);

    if (!ok) {
      showError(data.error || "Signup failed.");
      return;
    }

    showSuccess(data.message);

    await sendOtp(email);

    sessionStorage.setItem("signupEmail", email);

    showOtpModal(email);
    
  } catch (error) {
    showError(error.message || "Something went wrong. Please try again.");
  }
}

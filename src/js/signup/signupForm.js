import { sendOtp, showOtpModal } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";
import { signup } from "../utils/domHandler.js";

export function initSignupForm() {
  signup.signupForm.addEventListener("submit", handleSignupSubmit);
}

export async function handleSignupSubmit(e) {
  e.preventDefault();

  const email = signup.signupEmail.value;
  const password = signup.signupPassword.value;

  try {
    const res = await fetch("http://localhost:3000/user/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error);
      return;
    }

    showSuccess(data.message);

    await sendOtp(email);

    sessionStorage.setItem("signupEmail", email);

    showOtpModal(email);

  } catch (err) {
    // console.error(err);
    showError("Something went wrong. Please try again.");
  }
}

import { sendOTP, showOTPModal } from "../utils/otpUtils.js";
import { showSuccess, showError } from "../utils/toastHelper.js";

export function initSignupForm(formId) {
  document.getElementById(formId).addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || "Registration failed");
        return;
      }

      showSuccess("User registered.");

      await sendOTP(email);

      sessionStorage.setItem("signupEmail", email);
      showOTPModal(email);
      
    } catch (err) {
      console.error(err);
      showError("User already exists...");
    }
  });
}

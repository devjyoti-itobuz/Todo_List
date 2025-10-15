import {
  sendOTP,
  verifyOTP,
  showOTPModal,
  getOTPFromInputs,
} from "./utils/otpUtils.js";
import { showModal } from "./utils/utilFn.js";


document
  .getElementById("toggleSignupPassword")
  .addEventListener("click", function () {
    togglePasswordVisibility("signupPassword", this);
  });

function togglePasswordVisibility(inputId, button) {
  const passwordInput = document.getElementById(inputId);
  const icon = button.querySelector("i");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

const otpInputs = document.querySelectorAll('[id^="otp"]');
otpInputs.forEach((input, index) => {
  input.addEventListener("input", function () {
    if (this.value.length === 1 && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Backspace" && this.value === "" && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
});

document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const registerRes = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        alert(registerData.message || "Registration failed");
        return;
      }

      await sendOTP(email);
      sessionStorage.setItem("signupEmail", email);
      showOTPModal(email);
    } catch (err) {
      console.error(err);
      showModal("User already exists...");
      return;
    }
  });

document
  .getElementById("verifyOTPBtn")
  .addEventListener("click", async function () {
    const email = sessionStorage.getItem("signupEmail");
    const otp = getOTPFromInputs();

    if (otp.length !== 6) {
      alert("Please enter the full OTP");
      return;
    }

    try {
      await verifyOTP(email, otp);
      alert("Email verified successfully! Please login.");
      sessionStorage.removeItem("signupEmail");
      window.location.href = "login.html";
    } catch (err) {
      console.error(err);
      alert(err.message || "Invalid OTP");
    }
  });

document
  .getElementById("resendOTP")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const email =
      sessionStorage.getItem("signupEmail") || window.emailForVerification;

    if (!email) return alert("Email not found");

    try {
      await sendOTP(email);
      alert("OTP resent successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to resend OTP");
    }
  });


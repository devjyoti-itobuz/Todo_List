import {
  sendOTP,
  verifyOTP,
  showOTPModal,
  getOTPFromInputs,
} from "./utils/otpUtils.js";

const accessToken = localStorage.getItem("access-token");
if (accessToken) {
  window.location.href = "/index.html";
}

document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("loginPassword");
    const icon = this.querySelector("i");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });

document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("newPassword");
    const icon = this.querySelector("i");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });

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
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
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
        if (data.message === "Email not verified") {
          try {
            await sendOTP(email);
            showOTPModal(email);
            window.emailForVerification = email;
          } catch (otpError) {
            console.error(otpError);
            alert(otpError.message || "Failed to send OTP");
          }
          return;
        }

        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("access-token", data.accessToken);
      localStorage.setItem("refresh-token", data.refreshToken);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isLoggedIn", "true");

      // if (accessToken) {
      window.location.href = "/index.html";
      // }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  });

let resetEmailGlobal = ""; // Store the email across modals

document
  .getElementById("sendResetOTP")
  .addEventListener("click", async function () {
    const email = document.getElementById("resetEmail").value.trim();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/auth/forgot-password/sendOTP",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        resetEmailGlobal = email; // Save for later
        alert("OTP sent to your email.");

        const forgotModal = bootstrap.Modal.getInstance(
          document.getElementById("forgotPasswordModal")
        );
        forgotModal.hide();

        const resetModal = new bootstrap.Modal(
          document.getElementById("resetPasswordModal")
        );
        resetModal.show();
      } else {
        alert(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while sending OTP.");
    }
  });

document
  .getElementById("resetPasswordBtn")
  .addEventListener("click", async function () {
    const otp = document.getElementById("otpInput").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    if (!otp || !newPassword) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const verifyRes = await fetch(
        "http://localhost:3000/auth/forgot-password/verifyOTP",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmailGlobal, otp }),
        }
      );

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        alert(verifyData.message || "Invalid or expired OTP.");
        return;
      }

      const resetRes = await fetch(
        "http://localhost:3000/auth/forgot-password/reset",
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
        alert("Password reset successful. Please log in.");
        const resetModal = bootstrap.Modal.getInstance(
          document.getElementById("resetPasswordModal")
        );
        resetModal.hide();
      } else {
        alert(resetData.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while resetting your password.");
    }
  });

document
  .getElementById("verifyOTPBtn")
  .addEventListener("click", async function () {
    const otp = [...Array(6).keys()]
      .map((i) => document.getElementById(`otp${i + 1}`).value.trim())
      .join("");

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    const email = window.emailForVerification;

    try {
      const res = await fetch("http://localhost:3000/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Email verified successfully! You can now log in.");

        // Close the modal
        bootstrap.Modal.getInstance(
          document.getElementById("verifyEmailModal")
        ).hide();
      } else {
        alert(data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during OTP verification.");
    }
  });
document
  .getElementById("verifyOTPBtn")
  .addEventListener("click", async function () {
    const email = window.emailForVerification;
    const otp = getOTPFromInputs();

    if (otp.length !== 6) {
      alert("Please enter the full OTP");
      return;
    }

    try {
      await verifyOTP(email, otp);
      alert("Email verified successfully! You can now log in.");
      bootstrap.Modal.getInstance(
        document.getElementById("verifyEmailModal")
      ).hide();
    } catch (error) {
      console.error(error);
      alert(error.message || "OTP verification failed.");
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

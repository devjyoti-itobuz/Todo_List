import { initPasswordToggle } from "../components/passwordToggle.js";
import { initOTPInputs } from "../components/otpInputs.js";
import { initLoginForm } from "../components/loginForm.js";
import { initOTPVerification } from "../components/otpVerification.js";
import { initResendOTP } from "../components/resendOTP.js";
import { initResetPassword } from "../components/forgotPassword.js";

if (localStorage.getItem("access-token")) {
  window.location.href = "/index.html";
}

initPasswordToggle("togglePassword", ["loginPassword", "newPassword"]);

initOTPInputs();

initLoginForm("loginForm");

initOTPVerification(
  "verifyOTPBtn",
  "verifyEmailModal",
  () => window.emailForVerification
);

initResendOTP(
  "resendOTP",
  () => sessionStorage.getItem("signupEmail") || window.emailForVerification
);

initResetPassword({
  sendResetOTPId: "sendResetOTP",
  resetPasswordBtnId: "resetPasswordBtn",
  resetEmailInputId: "resetEmail",
  otpInputId: "otpInput",
  newPasswordInputId: "newPassword",
  forgotPasswordModalId: "forgotPasswordModal",
  resetPasswordModalId: "resetPasswordModal",
});
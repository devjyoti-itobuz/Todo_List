import { initPasswordToggle } from "../common/passwordToggle.js";
import { initOTPInputs } from "../common/otpInputs.js";
import { initLoginForm } from "./loginForm.js";
import { initOTPVerification } from "../common/otpVerification.js";
import { initResendOTP } from "../common/resendOTP.js";
import { initResetPassword } from "./forgotPassword.js";

if (localStorage.getItem("access-token")) {
  window.location.href = "/index.html";
}

initPasswordToggle("togglePassword", "loginPassword");
initPasswordToggle("togglePasswords", "newPassword");

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

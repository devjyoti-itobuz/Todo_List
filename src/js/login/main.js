import { initPasswordToggle } from "../common/passwordToggle.js";
import { initOtpInputs } from "../common/otpInputs.js";
import { initLoginForm } from "./loginForm.js";
import { initOtpVerification } from "../common/otpVerification.js";
import { initResendOtp } from "../common/resendOtp.js";
import { initForgotPassword } from "./forgotPassword.js";

if (localStorage.getItem("access-token")) {
  window.location.href = "/index.html";
}

initPasswordToggle("togglePassword", "loginPassword");
initPasswordToggle("togglePasswords", "newPassword");

initOtpInputs();

initLoginForm("loginForm");

initOtpVerification(
  "verifyOtpForm",
  "verifyEmailModal",
  () => window.emailForVerification
);

initResendOtp(
  "resendOtp",
  () => window.emailForVerification
);

initForgotPassword({
  sendResetOtpId: "forgotPasswordForm",
  resetPasswordBtnId: "resetPasswordForm",
  resetEmailInputId: "resetEmail",
  otpInputId: "otpInput",
  newPasswordInputId: "newPassword",
  forgotPasswordModalId: "forgotPasswordModal",
  resetPasswordModalId: "resetPasswordModal",
});

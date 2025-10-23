import { initPasswordToggle } from "../common/passwordToggle.js";
import { initOtpInputs } from "../common/otpInputs.js";
import { initLoginForm } from "./loginForm.js";
import { initOtpVerification } from "../common/otpVerification.js";
import { initResendOtp } from "../common/resendOtp.js";
import { initForgotPassword } from "./forgotPassword.js";
import { common, forgotPassword } from "../utils/domHandler.js";

if (localStorage.getItem("access_token")) {
  window.location.href = "/index.html";
}

initPasswordToggle("togglePassword", "loginPassword");
initPasswordToggle("togglePasswords", "newPassword");

initOtpInputs();

initLoginForm();

initOtpVerification(
  common.verifyOtpForm,
  common.verifyEmailModal,
  () => window.emailForVerification
);
 
initResendOtp(common.resendBtnId, () => window.emailForVerification);

initForgotPassword(
  forgotPassword.sendResetOtpId,
  forgotPassword.resetPasswordBtnId,
  forgotPassword.resetEmailInputId,
  forgotPassword.otpInputId,
  forgotPassword.newPasswordInputId,
  forgotPassword.forgotPasswordModalId,
  forgotPassword.resetPasswordModalId
);

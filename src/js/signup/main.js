import { initPasswordToggle } from "../common/passwordToggle.js";
import { initOtpInputs } from "../common/otpInputs.js";
import { initSignupForm } from "./signupForm.js";
import { initOtpVerification } from "../common/otpVerification.js";
import { initResendOtp } from "../common/resendOtp.js";
import { common } from "../utils/domHandler.js";

initPasswordToggle("toggleSignupPassword", "signupPassword");
initPasswordToggle("toggleConfirmPassword", "confirmPassword");

initOtpInputs();

initSignupForm();

initOtpVerification(common.verifyOtpForm, common.verifyEmailModal, () =>
  sessionStorage.getItem("signupEmail")
);

initResendOtp(common.resendBtnId, () => sessionStorage.getItem("signupEmail"));

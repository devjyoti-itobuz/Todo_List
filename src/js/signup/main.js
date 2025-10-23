import * as bootstrap from "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/+esm";

import { initPasswordToggle } from "../common/passwordToggle.js";
import { initOtpInputs } from "../common/otpInputs.js";
import { initSignupForm } from "./signupForm.js";
import { initOtpVerification } from "../common/otpVerification.js";
import { initResendOtp } from "../common/resendOtp.js";

initPasswordToggle("toggleSignupPassword", "signupPassword");
initPasswordToggle("toggleConfirmPassword", "confirmPassword");

initOtpInputs();

initSignupForm();

initOtpVerification("verifyOtpForm", "verifyEmailModal", () =>
  sessionStorage.getItem("signupEmail")
);

initResendOtp("resendOtp", () => sessionStorage.getItem("signupEmail"));

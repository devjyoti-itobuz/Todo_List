import * as bootstrap from "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/+esm";

import { initPasswordToggle } from "../common/passwordToggle.js";
import { initOTPInputs } from "../common/otpInputs.js";
import { initSignupForm } from "./signupForm.js";
import { initOTPVerification } from "../common/otpVerification.js";
import { initResendOTP } from "../common/resendOTP.js";

initPasswordToggle("toggleSignupPassword", "signupPassword");

initOTPInputs();

initSignupForm("signupForm");

initOTPVerification("verifyOTPForm", "verifyEmailModal", () =>
  sessionStorage.getItem("signupEmail")
);

initResendOTP("resendOTP", () => sessionStorage.getItem("signupEmail"));

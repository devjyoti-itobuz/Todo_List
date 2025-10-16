import * as bootstrap from "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/+esm";

import { initPasswordToggle } from "../components/passwordToggle.js";
import { initOTPInputs } from "../components/otpInputs.js";
import { initSignupForm } from "../components/signupForm.js";
import { initOTPVerification } from "../components/otpVerification.js";
import { initResendOTP } from "../components/resendOTP.js";

initPasswordToggle("toggleSignupPassword", ["signupPassword"]);

initOTPInputs();

initSignupForm("signupForm");

initOTPVerification("verifyOTPBtn", "verifyEmailModal", () =>
  sessionStorage.getItem("signupEmail")
);

initResendOTP("resendOTP", () => sessionStorage.getItem("signupEmail"));

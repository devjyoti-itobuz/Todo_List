import * as bootstrap from "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/+esm"; // Only for modules

import { initPasswordToggle } from "./components/passwordToggle.js";
import { initOTPInputs } from "./components/otpInputs.js";
import { initSignupForm } from "./components/signupForm.js";
import { initOTPVerification } from "./components/otpVerification.js";
import { initResendOTP } from "./components/resendOTP.js";

initPasswordToggle("toggleSignupPassword", ["signupPassword"]);
initOTPInputs();

initSignupForm("signupForm");

initOTPVerification("verifyOTPBtn", "verifyEmailModal", () =>
  sessionStorage.getItem("signupEmail")
);

initResendOTP("resendOTP", () => sessionStorage.getItem("signupEmail"));

// import { verifyOTP, getOTPFromInputs } from "../utils/otpUtils.js";
// import { showSuccess, showError } from "../utils/toastHelper.js";
// import * as bootstrap from "bootstrap";

// export function initOTPVerification(verifyBtnId, modalId, getEmail) {
//   document.getElementById(verifyBtnId).addEventListener("click", async () => {
//     const email = getEmail();
//     const otp = getOTPFromInputs();

//     if (otp.length !== 6) {
//       showError("Please enter the full OTP");
//       return;
//     }

//     try {
//       await verifyOTP(email, otp);
//       showSuccess("Email verified successfully! You can now log in.");
//       bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
//       sessionStorage.removeItem("signupEmail");
//     } catch (error) {
//       if (error.message === "User is already registered and verified") {
//         showError("User is already registered and verified.");
//       } else {
//         console.error(error);
//         showError(error.message || "OTP verification failed.");
//       }
//     }
//   });
// }

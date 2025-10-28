import * as bootstrap from "bootstrap";

export function showOtpModal(email) {
  document.getElementById("verificationEmail").textContent = email;
  const modal = new bootstrap.Modal(
    document.getElementById("verifyEmailModal")
  );
  modal.show();
}

export function getOtpFromInputs() {
  return Array.from(document.querySelectorAll('[id^="otp"]'))
    .map((input) => input.value.trim())
    .join("");
}
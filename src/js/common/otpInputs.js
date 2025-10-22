import { otpInputs } from "../utils/domHandler";

export function initOtpInputs(prefix = "otp") {
  // const otpInputs = document.querySelectorAll(`[id^="${prefix}"]`);

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => otpCheck(index));

    input.addEventListener("keydown", (e) => keyCheck(e, index));
  });
}

export function otpCheck(index) {
  if (otpInputs[index].value.length === 1 && index < otpInputs.length - 1) {
    otpInputs[index + 1].focus();
  }
}

export function keyCheck(e, index) {
  if (e.key === "Backspace" && otpInputs[index].value === "" && index > 0) {
    otpInputs[index - 1].focus();
  }
}

import { common } from "../utils/domHandler.js";

export function initOtpInputs(prefix = "otp") {
  // const otpInputs = document.querySelectorAll(`[id^="${prefix}"]`);

  common.otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => otpCheck(index));

    input.addEventListener("keydown", (e) => keyCheck(e, index));
  });
}

export function otpCheck(index) {
  if (
    common.otpInputs[index].value.length === 1 &&
    index < common.otpInputs.length - 1
  ) {
    common.otpInputs[index + 1].focus();
  }
}

export function keyCheck(e, index) {
  if (
    e.key === "Backspace" &&
    common.otpInputs[index].value === "" &&
    index > 0
  ) {
    common.otpInputs[index - 1].focus();
  }
}

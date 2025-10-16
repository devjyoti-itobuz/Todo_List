export function initOTPInputs(prefix = "otp") {
  const otpInputs = document.querySelectorAll(`[id^="${prefix}"]`);

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      if (this.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && this.value === "" && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
}

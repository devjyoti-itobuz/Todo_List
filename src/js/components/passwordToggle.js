export function initPasswordToggle(toggleBtnId, inputIds = []) {
  const toggleBtn = document.getElementById(toggleBtnId);

  toggleBtn.addEventListener("click", function () {
    inputIds.forEach((inputId) => {
      const passwordInput = document.getElementById(inputId);
      if (!passwordInput) return;
      const icon = this.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });
}

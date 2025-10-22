export function initPasswordToggle(toggleBtnId, inputId) {
  const toggleBtn = document.getElementById(toggleBtnId);

  if (!toggleBtn) {
    return;
  }

  toggleBtn.addEventListener("click", function () {
    const passwordInput = document.getElementById(inputId);

    if (!passwordInput) {
      return;
    }

    const icon = this.querySelector("i");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon?.classList.replace("fa-eye", "fa-eye-slash");
    } 
    else {
      passwordInput.type = "password";
      icon?.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}

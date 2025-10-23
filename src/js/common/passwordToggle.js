import { common } from "../utils/domHandler.js";

export function initPasswordToggle(toggleBtnId, inputId) {
  const { toggleBtn, passwordInput } = common.getPasswordToggleElements(
    toggleBtnId,
    inputId
  );

  if (!toggleBtn || !passwordInput) {
    return;
  }

  toggleBtn.addEventListener("click", () =>
    handlePasswordToggle(passwordInput, toggleBtn)
  );
}

export function handlePasswordToggle(passwordInput, toggleBtn) {
  const icon = toggleBtn.querySelector("i");

  if (passwordInput.type === "password") {
    showPassword(passwordInput, icon);
  } else {
    hidePassword(passwordInput, icon);
  }
}

export function showPassword(passwordInput, icon) {
  passwordInput.type = "text";
  icon?.classList.replace("fa-eye", "fa-eye-slash");
}

export function hidePassword(passwordInput, icon) {
  passwordInput.type = "password";
  icon?.classList.replace("fa-eye-slash", "fa-eye");
}

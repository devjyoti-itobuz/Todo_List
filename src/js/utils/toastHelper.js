import * as bootstrap from "bootstrap";
import displayTemplates from "./utilFn.js";

const templates = new displayTemplates();

export function showToast(message, type = "success") {
  const toastSection = document.getElementById("toastSection");

  if (!toastSection) {
    console.error(
      'Toast container not found. Add <div id="toastSection"></div> to your HTML'
    );
    return;
  }

  const toastHTML =
    type === "success"
      ? templates.successToast(message)
      : templates.errorToast(message);

  toastSection.innerHTML = toastHTML;

  const toastElement = toastSection.querySelector(".toast");

  const bsToast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 3000,
  });

  bsToast.show();

  toastElement.addEventListener("hidden.bs.toast", () => {
    toastSection.innerHTML = "";
  });
}

export const showSuccess = (msg) => showToast(msg, "success");
export const showError = (msg) => showToast(msg, "error");

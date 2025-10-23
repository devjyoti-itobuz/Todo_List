import { logoutBtn } from "../utils/domHandler";

export function initLogout() {
  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    
    window.location.href = "/pages/login.html";
  });
}

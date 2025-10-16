export function initLogout() {
  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("user");
    
    window.location.href = "/pages/login.html";
  });
}

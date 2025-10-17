export function initProfileDropdown() {
  const profileBtn = document.getElementById("profileDropdown");
  const profileMenu = document.getElementById("profileMenu");
  let hideTimeout;

  profileBtn.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
    profileMenu.style.display = "block";
  });

  profileBtn.parentElement.addEventListener("mouseleave", () => {
    hideTimeout = setTimeout(() => {
      profileMenu.style.display = "none";
    }, 300);
  });

  profileMenu.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
  });

  profileMenu.addEventListener("mouseleave", () => {
    hideTimeout = setTimeout(() => {
      profileMenu.style.display = "none";
    }, 300);
  });
}

import { profileDropdown } from "../utils/domHandler";

export function initProfileDropdown() {
  let hideTimeout;

  profileDropdown.profileBtn.addEventListener("mouseenter", () => {
    
    clearTimeout(hideTimeout);
    
    profileDropdown.profileMenu.style.display = "block";
  });

  profileDropdown.profileBtn.parentElement.addEventListener("mouseleave", () => {
    
    hideTimeout = setTimeout(() => {
      profileDropdown.profileMenu.style.display = "none";
    }, 300);
  });

  profileDropdown.profileMenu.addEventListener("mouseenter", () => {
    
    clearTimeout(hideTimeout);
  });

  profileDropdown.profileMenu.addEventListener("mouseleave", () => {
    
    hideTimeout = setTimeout(() => {
      profileDropdown.profileMenu.style.display = "none";
    }, 300);
  });
}

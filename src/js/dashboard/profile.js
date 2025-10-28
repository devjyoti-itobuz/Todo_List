import { showError, showSuccess } from "../utils/toastHelper.js";
import { profile } from "../utils/domHandler.js";
import * as bootstrap from "bootstrap";
import { getUserDetails, updateUserDetails } from "../api/userApi.js";

export function initProfile() {
  async function loadUserDetails() {
    try {
      const data = await getUserDetails();
      
      if (data.success) {
        const user = data.details[0];
        profile.userEmail.textContent = user.email;
        profile.nameInput.value = user.name || "";
        profile.profileImage.src = user.profileImage || "/assets/profile.webp";
      } else {
        console.error("Failed to load user details:", data);
      }

    } catch (err) {
      console.error("Error loading user details:", err);
    }
  }

  loadUserDetails();

  profile.changePhotoBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.addEventListener("change", () => {
      const file = input.files[0];
      
      if (file) {
        const maxSize = 1 * 1024 * 1024; // 2 MB in bytes

        if (file.size > maxSize) {
          showError("File size exceeds 2MB. Please choose a smaller image.");
          input.value = "";
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          profile.profileImage.src = e.target.result;
          profile.profileImage.dataset.newImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }

    });
  });

  profile.profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = profile.nameInput.value.trim();
    const profileImageData =
      profile.profileImage.dataset.newImage || profile.profileImage.src;

    if (!name) {
      showError("Please enter your name before saving.");
      return;
    }

    try {
      const data = await updateUserDetails(name, profileImageData);

      if (data.success) {
        showSuccess("Profile updated successfully!");

        profile.nameInput.value = data.user.name;
        profile.profileImage.src = data.user.profileImage;
        profile.profileImage.removeAttribute("data-new-image");

        const offcanvasInstance = bootstrap.Offcanvas.getInstance(
          profile.offcanvasEl
        );
        offcanvasInstance.hide();
      } else {
        showError(data.error || "Failed to update profile.");
        console.error(data);
      }
      
    } catch (err) {
      console.error("Error updating profile:", err);
      showError("An error occurred while saving changes.");
    }
  });
}

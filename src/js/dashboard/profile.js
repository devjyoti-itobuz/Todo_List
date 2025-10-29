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

  profile.changePhotoBtn.addEventListener("click", handleChangePhotoClick);

  function handleChangePhotoClick() {
    const input = createFileInput();
    input.addEventListener("change", handleImageSelection);
    input.click();
  }

  function handleImageSelection(event) {
    const file = event.target.files[0];
    
    if (!file) {
      showError("No file selected...");
      return;
    }

    if (!validateFileSize(file, 2)) {
      event.target.value = ""; // Reset input
      return;
    }

    readImageFile(file, (imageData) => {
      profile.profileImage.src = imageData;
      profile.profileImage.dataset.newImage = imageData;
    });
  }

  function readImageFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsDataURL(file);
  }

  function createFileInput(accept = "image/*") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    return input;
  }

  function validateFileSize(file, maxSizeMB = 2) {
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      showError(
        `File size exceeds ${maxSizeMB}MB. Please choose a smaller image.`
      );
      return false;
    }
    return true;
  }

  profile.profileForm.addEventListener("submit", handleProfileFormSubmit);

  async function handleProfileFormSubmit(e) {
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
  }
}

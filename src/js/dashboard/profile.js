import { showError, showSuccess } from "../utils/toastHelper.js";
import fetchWithAuth from "../api/fetchWithAuth";
import { profile } from "../utils/domHandler.js";

export function initProfile() {

  async function loadUserDetails() {
    try {
      const res = await fetchWithAuth(
        "http://localhost:3000/user/auth/details",
        {
          method: "GET",
        }
      );

      const data = await res.json();
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
        const reader = new FileReader();
        reader.onload = (e) => {
          profile.profileImage.src = e.target.result;
          profile.profileImage.dataset.newImage = e.target.result; // Store temporary base64 image
        };
        reader.readAsDataURL(file);
      }
    });
  });

  profile.saveProfileBtn.addEventListener("click", async () => {
    const name = profile.nameInput.value.trim();
    const profileImageData =
      profile.profileImage.dataset.newImage || profile.profileImage.src;

    if (!name) {
      showError("Please enter your name before saving.");
      return;
    }

    try {
      const res = await fetchWithAuth(
        "http://localhost:3000/user/auth/update-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            profileImage: profileImageData,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        showSuccess("Profile updated successfully!");

        profile.nameInput.value = data.user.name;
        profile.profileImage.src = data.user.profileImage;
        profile.profileImage.removeAttribute("data-new-image");
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

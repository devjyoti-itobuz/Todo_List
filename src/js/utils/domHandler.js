export const signup = {
  signupForm: document.getElementById("signupForm"),
  signupEmail: document.getElementById("signupEmail"),
  signupPassword: document.getElementById("signupPassword"),
};

export const login = {
  loginForm: document.getElementById("loginForm"),
  loginEmail: document.getElementById("loginEmail"),
  loginPassword: document.getElementById("loginPassword"),
};

export const dashboard = {
  taskForm: document.getElementById("taskForm"),
  taskList: document.getElementById("taskList"),
  prioritySelect: document.getElementById("prioritySelect"),
  tagInput: document.getElementById("tagInput"),
  taskInput: document.getElementById("taskInput"),
  editModal: document.getElementById("editModal"),
  saveEditBtn: document.getElementById("saveEditBtn"),
  editTagInput: document.getElementById("editTagInput"),
  editPrioritySelect: document.getElementById("editPrioritySelect"),
  editTaskInput: document.getElementById("editTaskInput"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  deleteModal: document.getElementById("deleteModal"),
  confirmBtn: document.getElementById("confirmBtn"),
  cancelBtn: document.getElementById("cancelBtn"),
  clearModal: document.getElementById("deleteModal"),
};

export const forgotPassword = {
  sendResetOtpId: document.getElementById("forgotPasswordForm"),
  resetPasswordBtnId: document.getElementById("resetPasswordForm"),
  resetEmailInputId: document.getElementById("resetEmail"),
  otpInputId: document.getElementById("otpInput"),
  newPasswordInputId: document.getElementById("newPassword"),
  forgotPasswordModalId: document.getElementById("forgotPasswordModal"),
  resetPasswordModalId: document.getElementById("resetPasswordModal"),
};

export const resetPassword = {
  resetPasswordForm: document.getElementById("resetPasswordForm"),
  resetCurrentPassword: document.getElementById("resetCurrentPassword"),
  resetNewPassword: document.getElementById("resetNewPassword"),
  resetPasswordModal: document.getElementById("resetPasswordModal"),
};

export const logoutBtn = document.getElementById("logoutBtn");

export const profileDropdown = {
  profileBtn: document.getElementById("profileDropdown"),
  profileMenu: document.getElementById("profileMenu"),
};

export const common = {
  otpInputs: document.querySelectorAll('[id^="otp"]'),
  resendBtnId: document.getElementById("resendOtp"),

  getPasswordToggleElements: (toggleBtnId, inputId) => ({
    toggleBtn: document.getElementById(toggleBtnId),
    passwordInput: document.getElementById(inputId),
  }),

  verifyOtpForm: document.getElementById("verifyOtpForm"),
  verifyEmailModal: document.getElementById("verifyEmailModal"),
};

export const filters = {
  filterButtons: document.querySelectorAll("#filterButtons button"),
  priorityFilterButtons: document.querySelectorAll(
    "#priorityFilterButtons button"
  ),
  searchInput: document.getElementById("searchInput"),
  userEmail: document.getElementById("userEmail"),
};

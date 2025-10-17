// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import { initTaskForm } from "./dashboard/taskForm.js";
import { renderTasks } from "./dashboard/taskList.js";
import { initFilters } from "./dashboard/filters.js";
import { initResetPassword } from "./dashboard/resetPassword.js";
import { initProfileDropdown } from "./dashboard/profileDropdown.js";
import { initLogout } from "./dashboard/logout.js";
import { fetchTasks } from "./api/api.js";
import { initPasswordToggle } from "./common/passwordToggle.js";

let tasks = [];
let currentFilter = "all";
let currentPriority = "all";

if (!localStorage.getItem("access-token")) {
  window.location.href = "../pages/login.html";
}

async function loadTasks() {
  const searchTerm = document.getElementById("searchInput").value.trim();
  tasks = await fetchTasks(searchTerm, currentFilter, currentPriority);
  renderTasks(tasks, renderTasksWrapper, loadTasks);
}

function renderTasksWrapper() {
  renderTasks(tasks, renderTasksWrapper, loadTasks);
}

initPasswordToggle("togglePassword", "resetCurrentPassword");
initPasswordToggle("togglePasswords", "resetNewPassword");

initTaskForm(loadTasks, renderTasksWrapper);

initFilters(
  (f) => (currentFilter = f),
  (p) => (currentPriority = p),
  loadTasks
);

initResetPassword();

initProfileDropdown();

initLogout();

loadTasks();

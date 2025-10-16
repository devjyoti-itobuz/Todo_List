// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import { initTaskForm } from "./components/taskForm.js";
import { renderTasks } from "./components/taskList.js";
import { initFilters } from "./components/filters.js";
import { initResetPassword } from "./components/resetPassword.js";
import { initProfileDropdown } from "./components/profileDropdown.js";
import { initLogout } from "./components/logout.js";
import { fetchTasks } from "./api/api.js";
import { initPasswordToggle } from "./common/passwordToggle.js";

let tasks = [];
let currentFilter = "all";
let currentPriority = "all";

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

import { createTaskApi } from "../api/api.js";
import { dashboard } from "../utils/domHandler.js";
import { showModal } from "../utils/utilFn.js";
import { getISTLocalizedTime } from "../utils/utilFn.js";

export function initTaskForm(loadTasks, renderTasks) {
  dashboard.taskForm.addEventListener("submit", (e) =>
    handleTaskFormSubmit(e, loadTasks, renderTasks)
  );
}

export async function handleTaskFormSubmit(e, loadTasks, renderTasks) {
  e.preventDefault();

  const taskRegex = /^[A-Za-z0-9\s]{3,}$/;

  if (
    !dashboard.taskInput.value.trim() ||
    !taskRegex.test(dashboard.taskInput.value.trim())
  ) {
    showModal("Please enter a valid task (min 3 characters).");
    return;
  }

  const priority = dashboard.prioritySelect.value;

  if (!priority) {
    showModal("Please enter priority.");
    return;
  }

  const tags = dashboard.tagInput.value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const taskData = {
    title: dashboard.taskInput.value.trim(),
    priority,
    tags,
    isCompleted: false,
    createdAt: getISTLocalizedTime(),
    updatedAt: getISTLocalizedTime(),
  };

  const newTask = await createTaskApi(taskData);

  if (newTask) {
    
    await loadTasks();
  }

  dashboard.taskInput.value = "";
  dashboard.tagInput.value = "";

  renderTasks();
}

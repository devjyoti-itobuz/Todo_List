import { createTaskAPI, fetchTasks } from "../api/api.js";
import { taskForm, taskInput } from "../utils/domHandler.js";
import { showModal } from "../utils/utilFn.js";
import { getISTLocalizedTime } from "../utils/utilFn.js";

export function initTaskForm(loadTasks, renderTasks) {
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const taskRegex = /^[A-Za-z0-9\s]{3,}$/;

    if (!taskInput.value.trim() || !taskRegex.test(taskInput.value.trim())) {
      showModal("Please enter a valid task (min 3 characters).");
      return;
    }

    const priority = document.getElementById("prioritySelect").value;

    if (!priority) {
      showModal("Please enter priority.");
      return;
    }

    const tags = document
      .getElementById("tagInput")
      .value.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const taskData = {
      text: taskInput.value.trim(),
      priority,
      tags,
      isCompleted: false,
      createdAt: getISTLocalizedTime(),
      updatedAt: getISTLocalizedTime(),
    };

    const newTask = await createTaskAPI(taskData);
    if (newTask) {
      await loadTasks();
    }

    taskInput.value = "";
    document.getElementById("tagInput").value = "";
    renderTasks();
  });
}

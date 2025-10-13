// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
import {
  fetchTasks,
  createTaskAPI,
  updateTaskAPI,
  clearAllTasksAPI,
  deleteTaskAPI,
} from "./api/api";
import { getISTLocalizedTime, showModal } from "./utils/utilFn";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const searchInput = document.getElementById("searchInput");

let tasks = [];
let currentFilter = "all";
let currentPriority = "all";

const priorityFilterButtons = document.querySelectorAll(
  "#priorityFilterButtons button"
);

priorityFilterButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    currentPriority = button.dataset.filter;
    priorityFilterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    await loadTasks();
  });
});

async function loadTasks() {
  const searchTerm = searchInput.value.trim();
  tasks = await fetchTasks(searchTerm, currentFilter, currentPriority);
  renderTasks();
}

taskForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const taskInput = document.getElementById("taskInput");
  const priority = document.getElementById("prioritySelect").value;

  const taskRegex = /^[A-Za-z0-9\s]{3,}$/;

  if (!taskInput.value.trim() || !taskRegex.test(taskInput.value.trim())) {
    showModal("Please enter a valid task (min 3 characters).");
    return;
  }

  if (!priority) {
    showModal("Please enter priority.");
    return;
  }

  const tags = document
    .getElementById("tagInput")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);

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
    const formattedTask = {
      id: newTask.id,
      text: newTask.title,
      priority: newTask.isImportant,
      tags: newTask.tags,
      isCompleted: newTask.isCompleted,
      createdAt: newTask.createdAt,
      updatedAt: newTask.updatedAt,
    };

    tasks.push(formattedTask);
  }

  taskInput.value = "";
  document.getElementById("tagInput").value = "";
  renderTasks(searchInput.value);
});

function renderTasks(filter = "") {
  tasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.className = "list-group-item text-center text-muted";
    emptyMsg.innerText = "No tasks found.";
    taskList.appendChild(emptyMsg);
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex flex-column flex-md-row gap-3 justify-content-between align-items-center priority-${task.priority} bg-${task.isCompleted}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "ms-2 me-auto";
    contentDiv.innerHTML = `
      <div class="${
        task.isCompleted ? "completed" : ""
      } justify-content-center">
      <span class="priority-badge ${task.priority}">${task.priority}</span>
        <strong>${task.text || task.title}</strong> <br>
        ${(task.tags || [])
          .map(
            (tag) =>
              `<span class="badge align-items-center tag-badge">${tag}</span>`
          )
          .join("")}
          <span class="text-muted badge">${task.updatedAt}</span>
      </div>
    `;

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    const completeBtn = document.createElement("button");
    completeBtn.className = "btn btn-outline-dark";

    if (task.isCompleted === true) {
      completeBtn.innerText = "↺";
      completeBtn.className = "btn btn-dark";
    } else {
      completeBtn.innerText = "✓";
    }
    completeBtn.title = "Complete / Undo";

    completeBtn.onclick = async () => {
      const updatedTask = await updateTaskAPI(task.id, {
        text: task.text || task.title,
        priority: task.priority || task.isImportant,
        tags: task.tags || [],
        isCompleted: !task.isCompleted,
      });

      if (updatedTask) {
        task.isCompleted = !task.isCompleted;
        task.updatedAt = updatedTask.updatedAt;
        renderTasks(searchInput.value);
      }
    };

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-outline-dark";
    editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    editBtn.title = "Edit Task";

    editBtn.onclick = () => {
      const editTaskInput = document.getElementById("editTaskInput");
      const editPrioritySelect = document.getElementById("editPrioritySelect");
      const editTagInput = document.getElementById("editTagInput");
      const saveEditBtn = document.getElementById("saveEditBtn");

      editTaskInput.value = task.text || task.title;
      editPrioritySelect.value = task.priority || task.isImportant;
      editTagInput.value = (task.tags || []).join(", ");

      const editModal = new bootstrap.Modal(
        document.getElementById("editModal")
      );

      editModal.show();

      const newSaveBtn = saveEditBtn.cloneNode(true);
      saveEditBtn.parentNode.replaceChild(newSaveBtn, saveEditBtn);

      newSaveBtn.addEventListener("click", async () => {
        const newText = editTaskInput.value.trim();
        const newPriority = editPrioritySelect.value;
        const newTags = editTagInput.value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);

        if (!newText || newText.length < 2) {
          showModal("Please enter a valid task (min 2 letters).");
          return;
        }

        const updatedTask = await updateTaskAPI(task.id, {
          text: newText,
          priority: newPriority,
          tags: newTags,
          isCompleted: task.isCompleted,
        });

        if (updatedTask) {
          task.text = newText;
          task.title = newText;
          task.priority = newPriority;
          task.isImportant = newPriority;
          task.tags = newTags;
          task.updatedAt = updatedTask.updatedAt;
          renderTasks(searchInput.value);
          editModal.hide();
        }
      });
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-dark";
    deleteBtn.innerText = "✘";
    deleteBtn.title = "Delete Task";

    deleteBtn.onclick = () => {
      const deleteModal = document.getElementById("deleteModal");
      deleteModal.classList.add("show");

      const confirmBtn = document.getElementById("confirmBtn");
      const cancelBtn = document.getElementById("cancelBtn");

      const closeModal = () => deleteModal.classList.remove("show");

      confirmBtn.onclick = async () => {
        const success = await deleteTaskAPI(task.id);

        if (success) {
          tasks = tasks.filter((t) => t.id !== task.id);
          renderTasks(searchInput.value);
        }
        closeModal();
      };

      cancelBtn.onclick = closeModal;
    };

    btnGroup.append(completeBtn, editBtn, deleteBtn);
    li.append(contentDiv, btnGroup);
    taskList.appendChild(li);
  });
}

const filterButtons = document.querySelectorAll("#filterButtons button");

filterButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    await loadTasks(); // fetch + render
  });
});

clearAllBtn.addEventListener("click", () => {
  const clearModal = document.getElementById("deleteModal");
  clearModal.classList.add("show");

  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const closeModal = () => clearModal.classList.remove("show");

  confirmBtn.onclick = async () => {
    const success = await clearAllTasksAPI();

    if (success) {
      tasks = [];
      renderTasks(searchInput.value);
    }
    closeModal();
  };

  cancelBtn.onclick = closeModal;
});

searchInput.addEventListener("input", async (e) => {
  await loadTasks();
});

loadTasks();

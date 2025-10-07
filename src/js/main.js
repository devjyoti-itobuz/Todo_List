// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
import Alert from "bootstrap/js/dist/alert";
import { Tooltip, Toast, Popover } from "bootstrap";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const searchInput = document.getElementById("searchInput");

let tasks = [];
let currentFilter = "all";

const API_BASE_URL = "http://localhost:3000/api/tasks";

async function fetchTasks(searchTerm = "") {
  const url = searchTerm
    ? `${API_BASE_URL}?search=${encodeURIComponent(searchTerm)}`
    : API_BASE_URL;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = await res.json();

    return (data || []).map((task) => ({
      id: task.id,
      text: task.title,
      priority: task.isImportant || "",
      tags: Array.isArray(task.tags) ? task.tags : [],
      isCompleted: !!task.isCompleted,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      //       ...task,
      // text: task.title,
      // priority: task.isImportant || "",
    }));
  } catch (error) {
    console.error("Error loading tasks:", error);
    showModal("Could not load tasks from server");
    return [];
  }
}

async function createTaskAPI(taskData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: taskData.text,
        tags: taskData.tags,
        isImportant: taskData.priority || "Low",
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    showModal("Failed to create task.");
    return null;
  }
}

async function updateTaskAPI(taskId, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updates.text,
        tags: updates.tags,
        isImportant: updates.priority,
        isCompleted: updates.isCompleted,
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    showModal("Failed to update task");
    return null;
  }
}

async function deleteTaskAPI(taskId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    showModal("Failed to delete task");
    return false;
  }
}

async function clearAllTasksAPI() {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return true;
  } catch (error) {
    console.error("Error clearing tasks:", error);
    showModal("Failed to clear all tasks");
    return false;
  }
}

function getISTLocalizedTime() {
  const now = new Date();
  const options = {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour12: true,
  };
  return now.toLocaleString("en-IN", options);
}

function showModal(message) {
  const queryModal = document.getElementById("queryModal");
  queryModal.textContent = message;
  queryModal.classList.add("show");

  setTimeout(() => {
    queryModal.classList.remove("show");
  }, 2000);
}

async function loadTasks() {
  tasks = await fetchTasks();
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
  taskList.innerHTML = "";

  const filteredTasks = tasks
    .filter((task) => {
      //   const searchText = filter.toLowerCase();
      //   const matchesSearch =
      //     task.text?.toLowerCase().includes(searchText) ||
      //     task.priority?.toLowerCase().includes(searchText) ||
      //     task.tags?.some((tag) => tag.toLowerCase().includes(searchText));

      const matchesStatus =
        currentFilter === "all" ||
        (currentFilter === "completed" && task.isCompleted) ||
        (currentFilter === "pending" && !task.isCompleted);

      return matchesStatus;
    })
    .sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return (
        priorityOrder[a.priority?.toLowerCase()] -
        priorityOrder[b.priority?.toLowerCase()]
      );
    });

  if (filteredTasks.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.className = "list-group-item text-center text-muted";
    emptyMsg.innerText = "No tasks found.";
    taskList.appendChild(emptyMsg);
    return;
  }

  filteredTasks.forEach((task) => {
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
    completeBtn.className = "btn btn-dark";
    if (task.isCompleted === true) completeBtn.innerText = "↺";
    else completeBtn.innerText = "✓";
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
    editBtn.className = "btn btn-light";
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
    deleteBtn.className = "btn btn-secondary";
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
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderTasks(searchInput.value);
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
  const searchTerm = e.target.value.trim();

  tasks = await fetchTasks(searchTerm);

  renderTasks();
});


// Initialize the app
loadTasks();

// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap’s JS
import * as bootstrap from "bootstrap";
import Alert from "bootstrap/js/dist/alert";
import { Tooltip, Toast, Popover } from "bootstrap";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const searchInput = document.getElementById("searchInput");

let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
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
    hour12: true, // Use 12-hour clock with AM/PM
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

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  tasks = saved ? JSON.parse(saved) : [];
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskInput = document.getElementById("taskInput");
  const priority = document.getElementById("prioritySelect").value;

  const taskRegex = /^[A-Za-z\s]{2,}$/;

  if (!taskInput.value.trim() || !taskRegex.test(taskInput.value.trim())) {
    showModal("Please enter a valid task (letters only, min 3 characters).");
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

  const task = {
    id: Date.now(),
    text: taskInput.value.trim(),
    priority,
    tags,
    isCompleted: false,
    createdAt: getISTLocalizedTime(),
    updatedAt: getISTLocalizedTime(),
  };
  console.log(task);

  tasks.push(task);
  saveTasks();

  taskInput.value = "";
  document.getElementById("tagInput").value = "";
  renderTasks(searchInput.value);
});

function renderTasks(filter = "") {
  taskList.innerHTML = "";

  const filteredTasks = tasks
    .filter((task) => {
      const searchText = filter.toLowerCase();
      return (
        task.text.toLowerCase().includes(searchText) ||
        task.priority.toLowerCase().includes(searchText) ||
        task.tags.some((tag) => tag.toLowerCase().includes(searchText))
      );
    })
    .sort((a, b) => {
      const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3,
      };
      return (
        priorityOrder[a.priority.toLowerCase()] -
        priorityOrder[b.priority.toLowerCase()]
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
    li.className = `list-group-item d-flex flex-column flex-md-row gap-3 justify-content-between align-items-center`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "ms-2 me-auto";
    contentDiv.innerHTML = `
      <div class="${
        task.isCompleted ? "completed" : ""
      } justify-content-center">
      <span class="priority-badge ${task.priority}">${task.priority}</span>
        <strong>${task.text}</strong> <br>
        ${task.tags
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
    completeBtn.onclick = () => {
      task.isCompleted = !task.isCompleted;
      saveTasks();
      renderTasks(searchInput.value);
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

      editTaskInput.value = task.text;
      editPrioritySelect.value = task.priority;
      editTagInput.value = task.tags.join(", ");

      const editModal = new bootstrap.Modal(
        document.getElementById("editModal")
      );
      editModal.show();

      const newSaveBtn = saveEditBtn.cloneNode(true);
      saveEditBtn.parentNode.replaceChild(newSaveBtn, saveEditBtn);

      newSaveBtn.addEventListener("click", () => {
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

        task.text = newText;
        task.priority = newPriority;
        task.tags = newTags;
        task.updatedAt = getISTLocalizedTime();
        saveTasks();
        renderTasks(searchInput.value);
        editModal.hide();
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

      confirmBtn.onclick = () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        renderTasks(searchInput.value);
        closeModal();
      };

      cancelBtn.onclick = closeModal;
    };

    btnGroup.append(completeBtn, editBtn, deleteBtn);
    li.append(contentDiv, btnGroup);
    taskList.appendChild(li);
  });
}

clearAllBtn.addEventListener("click", () => {
  const clearModal = document.getElementById("deleteModal");
  clearModal.classList.add("show");

  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const closeModal = () => clearModal.classList.remove("show");

  confirmBtn.onclick = () => {
    tasks = [];
    saveTasks();
    renderTasks(searchInput.value);
    closeModal();
  };

  cancelBtn.onclick = closeModal;
});

searchInput.addEventListener("input", (e) => {
  renderTasks(e.target.value);
});

loadTasks();
renderTasks();

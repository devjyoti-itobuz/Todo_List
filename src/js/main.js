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

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  tasks = saved ? JSON.parse(saved) : [];
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskInput = document.getElementById("taskInput");
  const priority = document.getElementById("prioritySelect").value;
  const tags = document
    .getElementById("tagInput")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);

  if (!taskInput.value.trim()) return;

  const task = {
    id: Date.now(),
    text: taskInput.value.trim(),
    priority,
    tags,
    completed: false,
  };

  tasks.push(task);
  saveTasks();

  taskInput.value = "";
  document.getElementById("tagInput").value = "";
  renderTasks(searchInput.value);
});

function renderTasks(filter = "") {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    const searchText = filter.toLowerCase();
    return (
      task.text.toLowerCase().includes(searchText) ||
      task.priority.toLowerCase().includes(searchText) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchText))
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
      <div class="${task.completed ? "completed" : ""} justify-content-center">
      <span class="priority-badge ${task.priority}">${task.priority}</span>
        <strong>${task.text}</strong> <br>
        ${task.tags
          .map(
            (tag) =>
              `<span class="badge align-items-center tag-badge">${tag}</span>`
          )
          .join("")}
      </div>
    `;

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    const completeBtn = document.createElement("button");
    completeBtn.className = "btn btn-dark";
    if (task.completed === true) completeBtn.innerText = "↺";
    else completeBtn.innerText = "✓";
    completeBtn.title = "Complete / Undo";
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks(searchInput.value);
    };

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-light";
    editBtn.innerText = "✎";
    editBtn.title = "Edit Task";
    editBtn.onclick = () => {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-control";
      input.value = task.text;

      const saveBtn = document.createElement("button");
      saveBtn.className = "btn btn-dark btn-sm";
      saveBtn.innerText = "Save";

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "btn btn-secondary btn-sm";
      cancelBtn.innerText = "Cancel";

      const editGroup = document.createElement("div");
      editGroup.className = "d-flex gap-2 mt-2";
      editGroup.append(input, saveBtn, cancelBtn);

      contentDiv.innerHTML = "";
      contentDiv.appendChild(editGroup);

      saveBtn.onclick = () => {
        const newText = input.value.trim();
        if (newText) {
          task.text = newText;
          saveTasks();
          renderTasks(searchInput.value);
        }
      };

      cancelBtn.onclick = () => {
        renderTasks(searchInput.value);
      };
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

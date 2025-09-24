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
    li.className = `list-group-item d-flex justify-content-between align-items-start`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "ms-2 me-auto";
    contentDiv.innerHTML = `
      <div class="${task.completed ? "completed" : ""}">
        <span class="priority-badge ${task.priority}">${task.priority}</span>
        <strong>${task.text}</strong>
        ${task.tags
          .map((tag) => `<span class="badge tag-badge">${tag}</span>`)
          .join("")}
      </div>
    `;

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group btn-group-sm";

    const completeBtn = document.createElement("button");
    completeBtn.className = "btn btn-dark";
    completeBtn.innerText = "✓";
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
      const newText = prompt("Edit task:", task.text);
      if (newText && newText.trim()) {
        task.text = newText.trim();
        saveTasks(); 
        renderTasks(searchInput.value);
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger";
    deleteBtn.innerText = "🗑";
    deleteBtn.title = "Delete Task";
    deleteBtn.onclick = () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks(); 
      renderTasks(searchInput.value);
    };

    btnGroup.append(completeBtn, editBtn, deleteBtn);
    li.append(contentDiv, btnGroup);
    taskList.appendChild(li);
  });
}

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveTasks(); 
    renderTasks(searchInput.value);
  }
});

searchInput.addEventListener("input", (e) => {
  renderTasks(e.target.value);
});

loadTasks();
renderTasks();

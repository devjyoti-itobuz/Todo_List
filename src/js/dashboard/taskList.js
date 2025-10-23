import { updateTaskApi, deleteTaskApi, clearAllTasksApi } from "../api/api.js";
import { showModal } from "../utils/utilFn.js";
import { dashboard } from "../utils/domHandler.js";
import * as bootstrap from "bootstrap";

export function renderTasks(tasks, renderTasksCallback, loadTasks) {
  const taskList = dashboard.taskList;
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
        <strong>${task.title}</strong><br>
        ${(task.tags || [])
          .map(
            (tag) =>
              `<span class="badge align-items-center tag-badge">${tag}</span>`
          )
          .join("")}
        <span class="text-muted badge">${task.updatedAt}</span>
      </div>`;

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    const completeBtn = document.createElement("button");
    completeBtn.className = task.isCompleted
      ? "btn btn-dark"
      : "btn btn-outline-dark";
    
    completeBtn.innerText = task.isCompleted ? "↺" : "✓";
    completeBtn.title = "Complete / Undo";

    completeBtn.onclick = async () => {

      const updatedTask = await updateTaskApi(task.id, {
        title: task.title,
        priority: task.priority || task.isImportant,
        tags: task.tags || [],
        isCompleted: !task.isCompleted,
      });

      if (updatedTask) {
        task.isCompleted = !task.isCompleted;
        task.updatedAt = updatedTask.updatedAt;

        renderTasksCallback();

        await loadTasks();
      }

    };

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-outline-dark";
    editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    editBtn.title = "Edit Task";

    editBtn.onclick = () => {
      dashboard.editTaskInput.value = task.title;
      dashboard.editPrioritySelect.value = task.priority || task.isImportant;
      dashboard.editTagInput.value = (task.tags || []).join(", ");

      const editModal = new bootstrap.Modal(dashboard.editModal);

      editModal.show();

      const newSaveBtn = dashboard.saveEditBtn.cloneNode(true);
      dashboard.saveEditBtn.parentNode.replaceChild(
        newSaveBtn,
        dashboard.saveEditBtn
      );

      newSaveBtn.addEventListener("click", async () => {
        const newTitle = dashboard.editTaskInput.value.trim();
        const newPriority = dashboard.editPrioritySelect.value;
        const newTags = dashboard.editTagInput.value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);

        if (!newTitle || newTitle.length < 3) {
          showModal("Please enter a valid task (min 3 letters).");
          return;
        }

        const updatedTask = await updateTaskApi(task.id, {
          title: newTitle,
          priority: newPriority,
          tags: newTags,
          isCompleted: task.isCompleted,
        });

        if (updatedTask) {
          task.title = newTitle;
          task.priority = newPriority;
          task.isImportant = newPriority;
          task.tags = newTags;
          task.updatedAt = updatedTask.updatedAt;
          
          renderTasksCallback();

          await loadTasks();
          
          editModal.hide();
        }
      });
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-dark";
    deleteBtn.innerText = "✘";
    deleteBtn.title = "Delete Task";

    deleteBtn.onclick = () => {
      dashboard.deleteModal.classList.add("show");
      
      const closeModal = () => dashboard.deleteModal.classList.remove("show");

      dashboard.confirmBtn.onclick = async () => {
        const success = await deleteTaskApi(task.id);

        if (success) {
          tasks = tasks.filter((t) => t.id !== task.id);
          renderTasksCallback();
        }

        await loadTasks();

        closeModal();
      };
      dashboard.cancelBtn.onclick = closeModal;
    };

    dashboard.clearAllBtn.addEventListener("click", () => {
      dashboard.clearModal.classList.add("show");

      const closeModal = () => dashboard.clearModal.classList.remove("show");

      dashboard.confirmBtn.onclick = async () => {
        const success = await clearAllTasksApi();

        if (success) {
          tasks = [];
          renderTasksCallback();
        }

        await loadTasks();

        closeModal();
      };

      dashboard.cancelBtn.onclick = closeModal;
    });

    btnGroup.append(completeBtn, editBtn, deleteBtn);
    li.append(contentDiv, btnGroup);
    taskList.appendChild(li);
  });
}

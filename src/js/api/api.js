import { shownModal, showModal, getISTLocalizedTime } from "../utils/utilFn";
import fetchWithAuth from "./fetchWithAuth";

const API_BASE_URL = "http://localhost:3000/api/tasks";

export async function fetchTasks(
  searchTerm = "",
  statusFilter = "all",
  priorityFilter = "all"
) {
  const url = new URL(API_BASE_URL);

  if (searchTerm) {
    url.searchParams.append("search", searchTerm);
  }

  if (statusFilter !== "all") {
    url.searchParams.append("status", statusFilter);
  }

  if (priorityFilter !== "all") {
    url.searchParams.append("priority", priorityFilter);
  }

  try {
    const res = await fetchWithAuth(url.toString());

    const data = await res.json();

    if (!res.ok) {
      showModal(data.error);
      return [];
    }

    // if(data.message){
    //   shownModal(data.message)
    // }

    return (data.tasks || []).map((task) => ({
      id: task._id,
      title: task.title,
      priority: task.isImportant || "",
      tags: Array.isArray(task.tags) ? task.tags : [],
      isCompleted: !!task.isCompleted,
      createdAt: getISTLocalizedTime(task.createdAt),
      updatedAt: getISTLocalizedTime(task.updatedAt),
    }));
    
  } catch (error) {
    // console.error("Error loading tasks:", error.message);
    showModal("Could not load tasks from server");
    return [];
  }
}

export async function createTaskApi(taskData) {
  try {
    const response = await fetchWithAuth(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: taskData.title,
        tags: taskData.tags,
        isImportant: taskData.priority,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showModal(data.error);
    }

    shownModal(data.message);

    return data.task;
  } catch (error) {
    console.error("Error creating task:", error);

    showModal("Failed to create task.");

    return null;
  }
}

export async function updateTaskApi(taskId, updates) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: updates.title,
        tags: updates.tags,
        isImportant: updates.priority,
        isCompleted: updates.isCompleted,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showModal(data.error);
    }

    shownModal(data.message);

    return data.task;
  } catch (error) {
    console.error("Error updating task:", error);

    showModal("Failed to update task");

    return null;
  }
}

export async function deleteTaskApi(taskId) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/${taskId}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      showModal(data.error);
    }

    shownModal(data.message);

    return true;

  } catch (error) {
    console.error("Error deleting task:", error);

    showModal("Failed to delete task");

    return false;
  }
}

export async function clearAllTasksApi() {
  try {
    const response = await fetchWithAuth(API_BASE_URL, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      showModal(data.error);
    }

    shownModal(data.message);

    return true;
    
  } catch (error) {
    console.error("Error clearing tasks:", error);

    showModal("Failed to clear all tasks");
    
    return false;
  }
}

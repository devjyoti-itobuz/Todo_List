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

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend error response:", res.status, errorText);
      throw new Error("Failed to fetch tasks");
    }

    const data = await res.json();

    return (data || []).map((task) => ({
      id: task._id,
      text: task.title,
      priority: task.isImportant || "",
      tags: Array.isArray(task.tags) ? task.tags : [],
      isCompleted: !!task.isCompleted,
      createdAt: getISTLocalizedTime(task.createdAt),
      updatedAt: getISTLocalizedTime(task.updatedAt),
    }));
    
  } catch (error) {
    console.error("Error loading tasks:", error);
    showModal("Could not load tasks from server");
    return [];
  }
}

export async function createTaskAPI(taskData) {
  try {
    const response = await fetchWithAuth(API_BASE_URL, {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    shownModal("task added successfully");

    return await response.json();

  } catch (error) {
    console.error("Error creating task:", error);

    showModal("Failed to create task.");

    return null;
  }
}

export async function updateTaskAPI(taskId, updates) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/${taskId}`, {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Error updating task:", error);

    showModal("Failed to update task");

    return null;
  }
}

export async function deleteTaskAPI(taskId) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;

  } catch (error) {
    console.error("Error deleting task:", error);

    showModal("Failed to delete task");

    return false;
  }
}

export async function clearAllTasksAPI() {
  try {
    const response = await fetchWithAuth(API_BASE_URL, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
    
  } catch (error) {
    console.error("Error clearing tasks:", error);
    showModal("Failed to clear all tasks");
    return false;
  }
}

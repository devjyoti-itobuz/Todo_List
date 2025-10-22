import { fetchTasks } from "../api/api.js";
import {
  filterButtons,
  priorityFilterButtons,
  searchInput,
} from "../utils/domHandler.js";

export function initFilters(setCurrentFilter, setCurrentPriority, loadTasks) {
  filterButtons.forEach((button) => {

    button.addEventListener("click", async () => {
      setCurrentFilter(button.dataset.filter);
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      await loadTasks();
    });
  });

  priorityFilterButtons.forEach((button) => {

    button.addEventListener("click", async () => {
      setCurrentPriority(button.dataset.filter);
      priorityFilterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      await loadTasks();
    });
  });

  searchInput.addEventListener("input", async () => {
    
    await loadTasks();
  });
}

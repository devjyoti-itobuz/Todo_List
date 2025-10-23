import { filters } from "../utils/domHandler.js";

export function initFilters(setCurrentFilter, setCurrentPriority, loadTasks) {
  initStatusFilters(setCurrentFilter, loadTasks);

  initPriorityFilters(setCurrentPriority, loadTasks);

  initSearchFilter(loadTasks);
}

export function initStatusFilters(setCurrentFilter, loadTasks) {
  filters.filterButtons.forEach((button) => {

    button.addEventListener("click", () =>
      
      handleStatusFilterClick(button, setCurrentFilter, loadTasks)
    );

  });
}

export function initPriorityFilters(setCurrentPriority, loadTasks) {
  filters.priorityFilterButtons.forEach((button) => {

    button.addEventListener("click", () =>
      
      handlePriorityFilterClick(button, setCurrentPriority, loadTasks)
    );

  });
}

export function initSearchFilter(loadTasks) {

  filters.searchInput.addEventListener("input", () =>
    
    handleSearchInput(loadTasks)
  );

}

export async function handleStatusFilterClick(button, setCurrentFilter, loadTasks) {
  setCurrentFilter(button.dataset.filter);
  
  updateActiveButton(filters.filterButtons, button);
  
  await loadTasks();
}

export async function handlePriorityFilterClick(button, setCurrentPriority, loadTasks) {
  setCurrentPriority(button.dataset.filter);
  
  updateActiveButton(filters.priorityFilterButtons, button);
  
  await loadTasks();
}

export async function handleSearchInput(loadTasks) {
  
  await loadTasks();
}

export function updateActiveButton(buttons, activeButton) {
  buttons.forEach((btn) => btn.classList.remove("active"));
  activeButton.classList.add("active");
}

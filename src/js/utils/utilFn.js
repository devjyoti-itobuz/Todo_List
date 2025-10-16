export function getISTLocalizedTime(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();

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

  return date.toLocaleString("en-IN", options);
}

export function showModal(message) {
  const queryModal = document.getElementById("queryModal");
  queryModal.textContent = message;
  queryModal.classList.add("show");

  setTimeout(() => {
    queryModal.classList.remove("show");
  }, 2000);
}

export function shownModal(message) {
  const qModal = document.getElementById("qModal");
  qModal.textContent = message;
  qModal.classList.add("show");

  setTimeout(() => {
    qModal.classList.remove("show");
  }, 2000);
}

export default class displayTemplates {
  successToast = (msg) => {
    return `
      <div class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="fa fa-check-circle"></i>
            <span>${msg}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
  };

  errorToast = (msg) => {
    return `
      <div class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="fa fa-times-circle"></i>
            <span>${msg}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
  };
}

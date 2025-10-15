export function getISTLocalizedTime() {
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
    return `  <div class="toast text-bg-success d-flex justify-content-center align-items-center p-2 gap-2" id="toastMsg">
    <i class="fa fa-check-circle"></i>
    <p class="m-0">${msg}</p>
  </div>`;
  };

  errorToast = (msg) => {
    return `  <div class="toast text-bg-danger d-flex justify-content-center align-items-center p-2 gap-2" id="toastMsg">
    <i class="fa fa-times-circle"></i>
    <p class="m-0">${msg}</p>
  </div>`;
  };
}
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
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const progress = document.getElementById("progress");
const message = document.getElementById("message");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let dateKey = new Date().toLocaleDateString();

const praise = ["Mükemmel gidiyorsun! 🔥","Disiplin senin damarlarında! 💪","Bugün senin günün! 🚀","Kralsın! 👑","İşte bu! 🦾"];
const scold = ["Bugün işi savsakladın 😠","Disiplin yoksa başarı da yok! ⚡","Kendini kandırma, işlerini bitir! ⏰","Koç kızgın! 🐯","Yarını bekleme, bugün yap! 📢"];

function render() {
  list.innerHTML = "";
  let todayTasks = tasks.filter(t => t.date === dateKey);
  todayTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.done) li.classList.add("done");
    li.addEventListener("click", () => toggleTask(index));
    list.appendChild(li);
  });
  updateProgress(todayTasks);
}

function toggleTask(index) {
  let todayTasks = tasks.filter(t => t.date === dateKey);
  todayTasks[index].done = !todayTasks[index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

function updateProgress(todayTasks) {
  const doneCount = todayTasks.filter(t => t.done).length;
  progress.textContent = `Bugün ${doneCount}/${todayTasks.length} iş tamamladın.`;

  if (doneCount === todayTasks.length && todayTasks.length > 0) {
    message.textContent = praise[Math.floor(Math.random() * praise.length)];
  } else if (todayTasks.length > 0 && doneCount < todayTasks.length) {
    message.textContent = "Hadi devam et, işler bekliyor! ⏳";
  } else {
    message.textContent = "";
  }
}

window.addEventListener("load", () => {
  const lastUse = localStorage.getItem("lastUseDate");
  if (lastUse && lastUse !== dateKey) {
    const yesterdayTasks = tasks.filter(t => t.date === lastUse);
    const undone = yesterdayTasks.filter(t => !t.done);
    if (undone.length > 0) {
      message.textContent = scold[Math.floor(Math.random() * scold.length)];
    }
  }
  localStorage.setItem("lastUseDate", dateKey);
  render();
});

form.addEventListener("submit", e => {
  e.preventDefault();
  let todayTasks = tasks.filter(t => t.date === dateKey);
  if (todayTasks.length >= 3) { alert("Bugün en fazla 3 iş ekleyebilirsin."); return; }
  if (input.value.trim() === "") return;
  tasks.push({ text: input.value, done: false, date: dateKey });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  input.value = "";
  render();
});

if ("serviceWorker" in navigator) { navigator.serviceWorker.register("service-worker.js"); }

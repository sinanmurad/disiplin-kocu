const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const motivation = document.getElementById("motivation");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let history = JSON.parse(localStorage.getItem("history")) || {};
const today = new Date().toISOString().split("T")[0];

// 🔥 Motivasyon mesajları
const messages = [
  "Disiplin yoksa başarı da yok!",
  "Bugün de bahane yok, görevlerini bitir!",
  "Kendini kandırma, işini yap!",
  "Disiplin, özgürlüğün diğer adıdır.",
  "Hedefine ulaşmak istiyorsan önce görevlerini tamamla!"
];
motivation.textContent = messages[Math.floor(Math.random() * messages.length)];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.done) li.classList.add("completed");
    li.onclick = () => toggleTask(i);
    taskList.appendChild(li);
  });
}
function addTask() {
  if (taskInput.value.trim() === "") return;
  tasks.push({ text: taskInput.value, done: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}
function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
  updateProgress();
}
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function updateProgress() {
  const completed = tasks.filter(t => t.done).length;
  history[today] = completed;
  localStorage.setItem("history", JSON.stringify(history));
  drawChart();
}

// 📊 Grafik
function drawChart() {
  const ctx = document.getElementById("progressChart").getContext("2d");
  const labels = Object.keys(history);
  const data = Object.values(history);
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Tamamlanan Görevler",
        data,
        backgroundColor: "#2b3a67"
      }]
    }
  });
}

renderTasks();
updateProgress();

// 🔔 Bildirim (opsiyonel)
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}
function remindMe() {
  if (Notification.permission === "granted") {
    new Notification("Disiplin Koçu", { body: "Görevlerini tamamladın mı?" });
  }
}
setTimeout(remindMe, 10000); // 10 sn sonra uyarı (örnek)

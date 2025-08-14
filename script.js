const canvas = document.getElementById("scratch");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let totalPixels = canvas.width * canvas.height;
let alreadyShown = false;

// מילוי שכבת הכיסוי
ctx.fillStyle = "#cccccc";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = "28px Arial";
ctx.fillStyle = "#000";
ctx.textAlign = "center";
ctx.fillText("גרדי כאן כדי לגלות!", canvas.width / 2, canvas.height / 2);

// גירוד
function scratch(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
  const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.fill();

  checkReveal();
}

// בדיקת אחוז גילוי
function checkReveal() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparentPixels = 0;

  for (let i = 3; i < imageData.length; i += 4) {
    if (imageData[i] === 0) transparentPixels++;
  }

  const percent = (transparentPixels / totalPixels) * 100;
  if (percent > 70 && !alreadyShown) {
    alreadyShown = true;
    document.getElementById("result").classList.add("clear"); // הסרת הטשטוש
    showSurprise();
  }
}

// הצגת ההפתעה
function showSurprise() {
  document.getElementById("wow").classList.add("show");
  launchConfetti();
}

// אפקט קונפטי
function launchConfetti() {
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 5000);
  }
}

// אירועים
canvas.addEventListener("mousedown", () => (isDrawing = true));
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mousemove", scratch);

canvas.addEventListener("touchstart", () => (isDrawing = true));
canvas.addEventListener("touchend", () => (isDrawing = false));
canvas.addEventListener("touchmove", scratch);

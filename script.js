const SITE = {
  birthdayBoy: "umarul farzan ns",
  birthdayDate: "31-07-2005",
  relationStart: "09-03-2026",
  musicVolume: 0.42
};

const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const openSurprise = document.getElementById("openSurprise");
const envelope = document.getElementById("envelope");
const letter = document.getElementById("loveLetter");
const petalLayer = document.getElementById("petalLayer");
const scratchCard = document.getElementById("scratchCard");
const scratchCanvas = document.getElementById("scratchCanvas");
const ctx = scratchCanvas.getContext("2d", { willReadFrequently: true });

music.volume = SITE.musicVolume;

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal-panel").forEach(panel => revealObserver.observe(panel));

async function playMusic() {
  try {
    await music.play();
    musicToggle.classList.add("playing");
  } catch {
    musicToggle.classList.remove("playing");
  }
}

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    playMusic();
  } else {
    music.pause();
    musicToggle.classList.remove("playing");
  }
});

openSurprise.addEventListener("click", () => {
  document.body.classList.add("surprise-open");
  playMusic();
  document.getElementById("letter").scrollIntoView({ behavior: "smooth" });
});

envelope.addEventListener("click", () => {
  const isOpen = envelope.classList.toggle("open");
  envelope.setAttribute("aria-expanded", String(isOpen));
  letter.classList.toggle("open", isOpen);
});

function resizeScratch() {
  const rect = scratchCard.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  scratchCanvas.width = Math.floor(rect.width * scale);
  scratchCanvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  paintScratchCover(rect.width, rect.height);
}

function paintScratchCover(width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f8d98d");
  gradient.addColorStop(.48, "#a86f24");
  gradient.addColorStop(1, "#ffe8aa");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(54, 27, 13, .58)";
  ctx.font = "700 13px Arial";
  ctx.textAlign = "center";
  ctx.letterSpacing = "0px";
  ctx.fillText("SCRATCH HERE", width / 2, height / 2);

  ctx.fillStyle = "rgba(255, 255, 255, .24)";
  for (let i = 0; i < 120; i += 1) {
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

let scratching = false;
let revealed = false;

function scratchAt(clientX, clientY) {
  const rect = scratchCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, Math.max(22, rect.width * .075), 0, Math.PI * 2);
  ctx.fill();
  maybeReveal();
}

function maybeReveal() {
  if (revealed) return;
  const pixels = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let clear = 0;
  for (let i = 3; i < pixels.length; i += 48) {
    if (pixels[i] < 20) clear += 1;
  }
  if (clear / (pixels.length / 48) > .42) {
    revealed = true;
    scratchCanvas.style.transition = "opacity .7s ease";
    scratchCanvas.style.opacity = "0";
    bloomPetals();
  }
}

function pointerPosition(event) {
  if (event.touches && event.touches[0]) return event.touches[0];
  return event;
}

scratchCanvas.addEventListener("pointerdown", event => {
  scratching = true;
  scratchAt(event.clientX, event.clientY);
});

scratchCanvas.addEventListener("pointermove", event => {
  if (!scratching) return;
  scratchAt(event.clientX, event.clientY);
});

window.addEventListener("pointerup", () => {
  scratching = false;
});

scratchCanvas.addEventListener("touchmove", event => {
  event.preventDefault();
  const point = pointerPosition(event);
  scratchAt(point.clientX, point.clientY);
}, { passive: false });

function bloomPetals() {
  for (let i = 0; i < 34; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--x", `${(Math.random() - .5) * 170}px`);
    petal.style.animationDelay = `${Math.random() * .55}s`;
    petalLayer.appendChild(petal);
    setTimeout(() => petal.remove(), 3600);
  }
}

window.addEventListener("resize", resizeScratch);
resizeScratch();

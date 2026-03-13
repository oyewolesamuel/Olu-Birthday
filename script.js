// ======= STARS =======
const starsEl = document.getElementById("stars");
for (let i = 0; i < 80; i++) {
  const s = document.createElement("div");
  s.className = "star";
  const size = Math.random() * 3 + 1;
  s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random() * 100}%;left:${Math.random() * 100}%;animation-duration:${2 + Math.random() * 4}s;animation-delay:${Math.random() * 4}s`;
  starsEl.appendChild(s);
}

// ======= BALLOONS =======
const colors = [
  "#FFD93D",
  "#FF6B9D",
  "#C77DFF",
  "#4FC3F7",
  "#69F0AE",
  "#FF8C42",
  "#FF4757",
];
const balloonContainer = document.getElementById("balloons");
function spawnBalloon() {
  const b = document.createElement("div");
  b.className = "balloon";
  const size = 40 + Math.random() * 40;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = Math.random() * 100;
  const duration = 8 + Math.random() * 10;
  const delay = Math.random() * 5;
  b.style.cssText = `width:${size}px;height:${size * 1.2}px;background:${color};left:${left}%;animation-duration:${duration}s;animation-delay:${delay}s`;
  balloonContainer.appendChild(b);
  setTimeout(() => b.remove(), (duration + delay) * 1000);
}
setInterval(spawnBalloon, 1200);
for (let i = 0; i < 5; i++) setTimeout(spawnBalloon, i * 500);

// ======= CONFETTI =======
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let pieces = [];
const confettiColors = [
  "#FFD93D",
  "#FF6B9D",
  "#C77DFF",
  "#4FC3F7",
  "#69F0AE",
  "#FF8C42",
  "#FF4757",
  "#fff",
];

function Piece() {
  this.x = Math.random() * canvas.width;
  this.y = -20;
  this.size = 6 + Math.random() * 8;
  this.color =
    confettiColors[Math.floor(Math.random() * confettiColors.length)];
  this.speedY = 2 + Math.random() * 4;
  this.speedX = (Math.random() - 0.5) * 3;
  this.rotation = Math.random() * 360;
  this.rotSpeed = (Math.random() - 0.5) * 8;
  this.shape = Math.random() > 0.5 ? "rect" : "circle";
  this.opacity = 1;
}

function launchConfetti() {
  for (let i = 0; i < 200; i++) {
    setTimeout(() => pieces.push(new Piece()), i * 15);
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces = pieces.filter((p) => p.y < canvas.height + 30);
  pieces.forEach((p) => {
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(p.y * 0.02) * 0.5;
    p.rotation += p.rotSpeed;
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    if (p.shape === "rect") {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// Launch on load
setTimeout(launchConfetti, 600);

// ======= REVEAL ON SCROLL =======
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("visible"), i * 100);
      }
    });
  },
  { threshold: 0.1 },
);
reveals.forEach((r) => observer.observe(r));

// ======= MUSIC =======
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx,
  musicPlaying = false,
  musicNodes = [];

function createPartyBeat() {
  if (!audioCtx) audioCtx = new AudioCtx();

  function playKick(time) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g);
    g.connect(audioCtx.destination);
    o.frequency.setValueAtTime(150, time);
    o.frequency.exponentialRampToValueAtTime(0.001, time + 0.4);
    g.gain.setValueAtTime(1, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    o.start(time);
    o.stop(time + 0.4);
    musicNodes.push(o, g);
  }
  function playHat(time) {
    const buf = audioCtx.createBuffer(
      1,
      audioCtx.sampleRate * 0.05,
      audioCtx.sampleRate,
    );
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = audioCtx.createBufferSource();
    const g = audioCtx.createGain();
    const f = audioCtx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 8000;
    s.buffer = buf;
    s.connect(f);
    f.connect(g);
    g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.3, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    s.start(time);
    musicNodes.push(s, g);
  }
  function playMelody(time) {
    const notes = [523, 659, 784, 880, 1047, 880, 784, 659];
    notes.forEach((freq, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);
      o.frequency.value = freq;
      o.type = "sine";
      const t = time + i * 0.25;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.15, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.start(t);
      o.stop(t + 0.35);
      musicNodes.push(o, g);
    });
  }

  let t = audioCtx.currentTime;
  const loop = () => {
    if (!musicPlaying) return;
    for (let b = 0; b < 4; b++) {
      playKick(t + b);
      playKick(t + b + 0.5);
      playHat(t + b + 0.25);
      playHat(t + b + 0.75);
    }
    playMelody(t);
    t += 4;
    setTimeout(loop, 3500);
  };
  loop();
}

// ======= AUTOPLAY MUSIC on first interaction =======
function startMusic() {
  if (musicPlaying) return;
  musicPlaying = true;
  document.getElementById("musicBtn").textContent = "🎶";
  document.getElementById("musicBtn").classList.add("playing");
  createPartyBeat();
}
// Try immediate autoplay, fallback to first click/touch
try {
  audioCtx = new AudioCtx();
  if (audioCtx.state === "suspended") {
    document.addEventListener("click", startMusic, { once: true });
    document.addEventListener("touchstart", startMusic, { once: true });
  } else {
    startMusic();
  }
} catch (e) {
  document.addEventListener("click", startMusic, { once: true });
}

document.getElementById("musicBtn").addEventListener("click", function () {
  if (musicPlaying) {
    musicPlaying = false;
    this.textContent = "🎵";
    this.classList.remove("playing");
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
  } else {
    startMusic();
  }
});

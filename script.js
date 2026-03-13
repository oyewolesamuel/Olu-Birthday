// ======= STARS =======
const starsEl = document.getElementById('stars');
for (let i = 0; i < 80; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const size = Math.random() * 3 + 1;
  s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*4}s`;
  starsEl.appendChild(s);
}

// ======= BALLOONS =======
const colors = ['#FFD93D','#FF6B9D','#C77DFF','#4FC3F7','#69F0AE','#FF8C42','#FF4757'];
const balloonContainer = document.getElementById('balloons');
function spawnBalloon() {
  const b = document.createElement('div');
  b.className = 'balloon';
  const size = 40 + Math.random() * 40;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = Math.random() * 100;
  const duration = 8 + Math.random() * 10;
  const delay = Math.random() * 5;
  b.style.cssText = `width:${size}px;height:${size*1.2}px;background:${color};left:${left}%;animation-duration:${duration}s;animation-delay:${delay}s`;
  balloonContainer.appendChild(b);
  setTimeout(() => b.remove(), (duration + delay) * 1000);
}
setInterval(spawnBalloon, 1200);
for (let i = 0; i < 5; i++) setTimeout(spawnBalloon, i * 500);



// ======= CONFETTI =======
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

let pieces = [];
const confettiColors = ['#FFD93D','#FF6B9D','#C77DFF','#4FC3F7','#69F0AE','#FF8C42','#FF4757','#fff'];

function Piece() {
  this.x = Math.random() * canvas.width;
  this.y = -20;
  this.size = 6 + Math.random() * 8;
  this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  this.speedY = 2 + Math.random() * 4;
  this.speedX = (Math.random() - 0.5) * 3;
  this.rotation = Math.random() * 360;
  this.rotSpeed = (Math.random() - 0.5) * 8;
  this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
  this.opacity = 1;
}

function launchConfetti() {
  for (let i = 0; i < 200; i++) {
    setTimeout(() => pieces.push(new Piece()), i * 15);
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces = pieces.filter(p => p.y < canvas.height + 30);
  pieces.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(p.y * 0.02) * 0.5;
    p.rotation += p.rotSpeed;
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    if (p.shape === 'rect') {
      ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size/2, 0, Math.PI*2);
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
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));


const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null, musicPlaying = false, masterGain = null, loopTimer = null;

// Happy Birthday notes: [frequency_Hz, duration_beats]
// Beat unit = 0.3s  |  Tempo ≈ 100 BPM waltz feel
const HB_NOTES = [
  // "Hap-py Birth-day to You"
  [392,0.75],[392,0.25],[440,1],[392,1],[523.25,1],[493.88,2],
  // "Hap-py Birth-day to You"
  [392,0.75],[392,0.25],[440,1],[392,1],[587.33,1],[523.25,2],
  // "Hap-py Birth-day dear O-lu-mi-de"
  [392,0.75],[392,0.25],[783.99,1],[659.25,1],[523.25,1],[493.88,1],[440,2],
  // "Hap-py Birth-day to You"
  [698.46,0.75],[698.46,0.25],[659.25,1],[523.25,1],[587.33,1],[523.25,2.5]
];
const BEAT = 0.32; // seconds per beat

function playNote(freq, startTime, dur) {
  if (!audioCtx || !masterGain) return;
  const osc = audioCtx.createOscillator();
  const env = audioCtx.createGain();
  osc.type = 'triangle'; // warm, piano-like tone
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0, startTime);
  env.gain.linearRampToValueAtTime(0.45, startTime + 0.03);
  env.gain.setValueAtTime(0.35, startTime + dur * BEAT * 0.6);
  env.gain.exponentialRampToValueAtTime(0.001, startTime + dur * BEAT * 0.95);
  osc.connect(env);
  env.connect(masterGain);
  osc.start(startTime);
  osc.stop(startTime + dur * BEAT);
}

function scheduleHappyBirthday() {
  if (!musicPlaying || !audioCtx) return;
  let t = audioCtx.currentTime + 0.05;
  let totalDur = 0;
  HB_NOTES.forEach(([freq, dur]) => {
    playNote(freq, t + totalDur, dur);
    totalDur += dur * BEAT;
  });
  // Loop: restart after the song finishes (+ 1s pause between loops)
  loopTimer = setTimeout(scheduleHappyBirthday, (totalDur + 1) * 1000);
}

function startMusic() {
  if (musicPlaying) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.7;
  masterGain.connect(audioCtx.destination);
  musicPlaying = true;
  document.getElementById('musicBtn').textContent = '🎶';
  document.getElementById('musicBtn').classList.add('playing');
  scheduleHappyBirthday();
}

function pauseMusic() {
  // CHANGE 2a: Suspend audio context (silences music instantly but keeps state)
  if (audioCtx && audioCtx.state === 'running') audioCtx.suspend();
  if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
}

function resumeMusic() {
  // CHANGE 2b: Resume audio context and reschedule the song
  if (!musicPlaying) return;
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => scheduleHappyBirthday());
  }
}

// Try autoplay on load, fallback to first interaction
try {
  audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') {
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });
  } else {
    startMusic();
  }
} catch(e) {
  document.addEventListener('click', startMusic, { once: true });
}

document.getElementById('musicBtn').addEventListener('click', function(e) {
  e.stopPropagation();
  if (musicPlaying) {
    musicPlaying = false;
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    this.textContent = '🎵';
    this.classList.remove('playing');
    if (audioCtx) { audioCtx.close(); audioCtx = null; masterGain = null; }
  } else {
    startMusic();
  }
});

function attachVideoListeners(video) {
  video.addEventListener('play',  () => { pauseMusic(); });
  video.addEventListener('pause', () => { resumeMusic(); });
  video.addEventListener('ended', () => { resumeMusic(); });
  console.log('🎬 Video detected — music will pause when video plays & resume when it stops.');
}

// Check if a video already exists on load
const existingVideo = document.querySelector('.video-card video');
if (existingVideo) attachVideoListeners(existingVideo);

// Also watch for video being added dynamically
const videoCardEl = document.querySelector('.video-card');
if (videoCardEl) {
  new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.tagName === 'VIDEO') attachVideoListeners(node);
      });
    });
  }).observe(videoCardEl, { childList: true, subtree: true });
}
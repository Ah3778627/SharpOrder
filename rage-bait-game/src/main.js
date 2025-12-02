import { LEVELS } from './levels.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const groundY = height - 120;

// UI elements
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const levelSelect = document.getElementById('levelSelect');
const practiceToggle = document.getElementById('practiceToggle');
const status = document.getElementById('status');

LEVELS.forEach((l, i) => {
  const opt = document.createElement('option'); opt.value = i; opt.textContent = l.name; levelSelect.appendChild(opt);
});

let levelIndex = 0;
let level = LEVELS[levelIndex];

let running = false;
let practiceMode = false;

let player = null;
let cameraX = 0;
let lastTime = 0;
let totalDistance = 0;
let lastCheckpointIndex = -1;

function resetLevel() {
  level = LEVELS[levelIndex];
  cameraX = -200; // offset so player has small runup
  totalDistance = 0;
  lastCheckpointIndex = -1;
  player = {
    x: 140,
    y: groundY - 48,
    w: 48,
    h: 48,
    vy: 0,
    onGround: true,
    alive: true
  };
  status.textContent = 'Ready';
}

function worldToScreen(x) {
  return x - cameraX;
}

function startGame() {
  resetLevel();
  running = true;
  lastTime = performance.now();
  status.textContent = 'Running';
  requestAnimationFrame(loop);
}

function restartLevel() {
  resetLevel();
  status.textContent = 'Restarted';
}

function togglePractice(v) {
  practiceMode = v;
  status.textContent = practiceMode ? 'Practice ON' : 'Practice OFF';
}

function collideRect(a,b){
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function handleDeath() {
  player.alive = false;
  status.textContent = 'You Died';
  if (practiceMode && lastCheckpointIndex>=0) {
    // respawn at checkpoint
    const cpX = level.checkpoints[lastCheckpointIndex];
    cameraX = cpX - 200;
    player.x = 140;
    player.y = groundY - player.h;
    player.vy = 0;
    player.alive = true;
    status.textContent = `Respawn at checkpoint ${lastCheckpointIndex+1}`;
  } else {
    // full restart after short pause
    setTimeout(()=>{ restartLevel(); if (running) requestAnimationFrame(loop); }, 450);
  }
}

function loop(t) {
  const dt = Math.min((t - lastTime) / 1000, 0.032);
  lastTime = t;
  update(dt);
  render();
  if (running) requestAnimationFrame(loop);
}

function update(dt) {
  if (!player || !player.alive) return;
  const speed = level.speed;
  // camera moves to the right; player x appears fixed
  cameraX += speed * dt;
  totalDistance = cameraX + 200;

  // checkpoints
  for (let i=0;i<level.checkpoints.length;i++){
    if (totalDistance >= level.checkpoints[i] && i > lastCheckpointIndex) {
      lastCheckpointIndex = i;
      // small notification
      status.textContent = `Checkpoint ${i+1} reached`;
      setTimeout(()=>{ if(status.textContent.startsWith('Checkpoint')) status.textContent = '' }, 1200);
    }
  }

  // apply gravity
  player.vy += level.gravity * dt;
  player.y += player.vy * dt;
  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h; player.vy = 0; player.onGround = true;
  } else player.onGround = false;

  // obstacles collision
  for (const ob of level.obstacles) {
    const obX = ob[0]; const obW = ob[1]; const obH = ob[2];
    const rect = { x: obX - cameraX, y: groundY - obH, w: obW, h: obH };
    const playerRect = { x: player.x, y: player.y, w: player.w, h: player.h };
    if (collideRect(playerRect, { x: rect.x + cameraX, y: rect.y, w: rect.w, h: rect.h })) {
      // collision in world space; simpler: compare in world coords
      handleDeath(); break;
    }
  }

  // finish
  if (totalDistance >= level.length) {
    running = false; status.textContent = 'Level Complete!';
  }
}

function render() {
  // clear
  ctx.clearRect(0,0,width,height);
  // sky
  const g = ctx.createLinearGradient(0,0,0,height);
  g.addColorStop(0,'#07121b'); g.addColorStop(1,'#071b14');
  ctx.fillStyle = g; ctx.fillRect(0,0,width,height);

  // ground
  ctx.fillStyle = '#0f1724'; ctx.fillRect(0,groundY,width,height-groundY);
  ctx.fillStyle = '#142032'; ctx.fillRect(0,groundY+18,width,height-groundY-18);

  // draw obstacles
  ctx.fillStyle = '#ff5c5c';
  for (const ob of level.obstacles) {
    const obX = ob[0]; const obW = ob[1]; const obH = ob[2];
    const sx = Math.round(obX - cameraX);
    if (sx + obW < -200 || sx > width + 200) continue;
    ctx.fillRect(sx, groundY - obH, obW, obH);
    // spike top
    ctx.fillStyle = '#ff7777';
    ctx.fillRect(sx, groundY - obH, obW, 6);
    ctx.fillStyle = '#ff5c5c';
  }

  // draw checkpoints
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let i=0;i<level.checkpoints.length;i++){
    const x = level.checkpoints[i] - cameraX;
    ctx.fillRect(x, 0, 6, groundY);
  }

  // player
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(player.x, player.y, player.w, player.h);
  // player eye
  ctx.fillStyle = '#083344'; ctx.fillRect(player.x + 10, player.y + 12, 6, 6);

  // hud text
  ctx.fillStyle = '#cbd5e1'; ctx.font = '16px system-ui';
  ctx.fillText(`Level: ${level.name}`, 12, 24);
  ctx.fillText(`Distance: ${Math.floor(totalDistance)}/${level.length}`, 12, 44);
  ctx.fillText(`Checkpoint: ${Math.max(0,lastCheckpointIndex+1)}/${level.checkpoints.length}`, 12, 64);
  ctx.fillText(`Practice: ${practiceMode ? 'ON' : 'OFF'}`, 12, 84);
}

// input
function doJump(){
  if (!player) return;
  if (player.onGround) {
    player.vy = -level.jumpForce;
    player.onGround = false;
  }
}

window.addEventListener('keydown', (e)=>{
  if (e.code === 'Space') { e.preventDefault(); doJump(); }
  if (e.code === 'KeyP') { practiceToggle.checked = !practiceToggle.checked; togglePractice(practiceToggle.checked); }
});
canvas.addEventListener('pointerdown', (e)=>{ doJump(); });

// UI handlers
startBtn.addEventListener('click', ()=>{ levelIndex = parseInt(levelSelect.value); startGame(); });
restartBtn.addEventListener('click', ()=>{ restartLevel(); });
levelSelect.addEventListener('change', ()=>{ levelIndex = parseInt(levelSelect.value); resetLevel(); });
practiceToggle.addEventListener('change', ()=>{ togglePractice(practiceToggle.checked); });

// init
resetLevel();

// small debug: collision in world coords helper replacement
// we fix the collision check by computing in world coords each frame
// override update to test collisions using world positions
// Adjust update: (patching in place) -- For simplicity, above collision used world coords via cameraX

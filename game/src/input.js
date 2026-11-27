// Gobble Run — keyboard and mouse input.
// Keys are tracked as a held set; clicks are queued with canvas
// coordinates so the main loop can answer them once per frame.

const keysHeld = {};
const clickQueue = [];
let canvasBox = null;

function inputBind(canvas) {
  canvasBox = canvas;
  window.addEventListener('keydown', function (e) {
    const k = e.key.toLowerCase();
    if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
      e.preventDefault();
    }
    if (!keysHeld[k]) keysHeld[k] = true;
    if (k === 'm') toggleMute();
    if (k === 'p' || k === 'escape') togglePause();
    if (k === 'r') restartGame();
    if (k === ' ' || k === 'arrowup' || k === 'w') pressJump();
    if (k === 'arrowdown' || k === 's') pressHideOrDash();
    if (k === 'enter') pressConfirm();
  });
  window.addEventListener('keyup', function (e) {
    keysHeld[e.key.toLowerCase()] = false;
  });
  canvas.addEventListener('mousedown', function (e) {
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * CFG.W;
    const y = ((e.clientY - r.top) / r.height) * CFG.H;
    clickQueue.push({ x: x, y: y });
  });
  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    const t = e.touches[0];
    const x = ((t.clientX - r.left) / r.width) * CFG.W;
    const y = ((t.clientY - r.top) / r.height) * CFG.H;
    clickQueue.push({ x: x, y: y });
  }, { passive: false });
}

function keyDown(k) {
  return !!keysHeld[k];
}

function consumeClicks() {
  const out = clickQueue.splice(0, clickQueue.length);
  return out;
}

function pressJump() {
  if (G.state === 'title') { startGame(); return; }
  if (G.state === 'caught' || G.state === 'escaped') { restartGame(); return; }
  if (G.state !== 'play') return;
  turkeyJump();
}

function pressHideOrDash() {
  if (G.state !== 'play') return;
  turkeyHideOrDash();
}

function pressConfirm() {
  if (G.state === 'title') startGame();
  else if (G.state === 'caught' || G.state === 'escaped') restartGame();
}

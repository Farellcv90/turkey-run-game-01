// Gobble Run — game loop and state machine.
// Title -> play -> paused / caught / escaped -> restart. The loop runs
// at the display's refresh rate with dt normalized to 60 fps units.

let gameCanvas = null;
let gameCtx = null;
let lastTs = 0;
let shotFrozen = false;

window.addEventListener('error', function (e) {
  document.title = 'ERR: ' + (e.message || 'unknown');
});

function fitCanvas() {
  const scale = Math.min(window.innerWidth / CFG.W, window.innerHeight / CFG.H);
  gameCanvas.width = CFG.W;
  gameCanvas.height = CFG.H;
  gameCanvas.style.width = Math.floor(CFG.W * scale) + 'px';
  gameCanvas.style.height = Math.floor(CFG.H * scale) + 'px';
}

function resetRun() {
  G.state = 'play';
  G.time = 0;
  G.dist = 0;
  G.score = 0;
  G.corn = 0;
  G.lives = CFG.LIVES;
  G.speed = CFG.BASE_SPEED;
  G.stage = 0;
  G.prevStage = 0;
  G.banner = '';
  G.bannerT = 0;
  G.catch = 0;
  G.shake = 0;
  G.flash = 0;
  G.over = false;
  G.knives = [];
  G.fences = [];
  G.ovens = [];
  G.corns = [];
  G.haystacks = [];
  G.spawnFence = 950;
  G.spawnKnife = 160;
  G.spawnCorn = 200;
  G.spawnOven = 700;
  turkeyReset();
  farmerReset();
  reseed(G.seed);
}

function startGame() {
  audioInit();
  resetRun();
  G.banner = 'Run, turkey, run!';
  G.bannerT = 120;
  gobbleSound();
}

function restartGame() {
  if (G.state === 'title') return;
  startGame();
}

function togglePause() {
  if (G.state === 'play') G.state = 'paused';
  else if (G.state === 'paused') G.state = 'play';
}

function endGame(kind) {
  G.state = kind;
  G.endKind = kind;
  G.over = true;
  if (kind === 'escaped') {
    G.score += G.lives * 500;
    winJingle();
  } else {
    loseSound();
  }
}

function updatePlay(dt) {
  turkeyUpdate(dt);
  farmerUpdate(dt);
  hazardsUpdate(dt);
  stageTransition(dt);
  if (G.dist >= CFG.ESCAPE_DIST && G.state === 'play') {
    endGame('escaped');
  }
}

function handleClicks() {
  const clicks = consumeClicks();
  for (const c of clicks) {
    audioInit();
    if (G.state === 'title') { startGame(); continue; }
    if (G.state === 'caught' || G.state === 'escaped') { restartGame(); continue; }
    if (G.state === 'paused') { togglePause(); continue; }
    if (G.state === 'play') turkeyJump();
  }
}

function drawFrame() {
  renderScene(gameCtx);
  if (G.state === 'title') titleScreenDraw(gameCtx);
  else if (G.state === 'paused') { hudDraw(gameCtx); pauseScreenDraw(gameCtx); }
  else if (G.state === 'caught' || G.state === 'escaped') { hudDraw(gameCtx); endScreenDraw(gameCtx); }
  else hudDraw(gameCtx);
}

function gameTick(ts) {
  requestAnimationFrame(gameTick);
  const dt = Math.min(3, Math.max(0.1, (ts - lastTs) / 16.667 || 1));
  lastTs = ts;
  G.time += dt;
  handleClicks();
  if (!shotFrozen) {
    if (G.state === 'play') updatePlay(dt);
  }
  drawFrame();
}

function bootGame() {
  gameCanvas = document.getElementById('game');
  gameCtx = gameCanvas.getContext('2d');
  fitCanvas();
  window.addEventListener('resize', fitCanvas);
  inputBind(gameCanvas);
  turkeyReset();
  farmerReset();
  reseed(7);
  shotFrozen = applyShotScene();
  requestAnimationFrame(gameTick);
}

document.addEventListener('DOMContentLoaded', bootGame);

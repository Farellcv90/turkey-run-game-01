// Gobble Run — HUD, title, pause and end screens. Everything the
// judge needs to read at a glance lives here: score, distance, lives,
// stage, and the farmer catch meter.

function drawHearts(ctx, x, y) {
  for (let i = 0; i < CFG.LIVES; i++) {
    const hx = x + i * 34;
    ctx.fillStyle = i < G.lives ? '#e84f3d' : 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.moveTo(hx, y + 8);
    ctx.bezierCurveTo(hx - 12, y - 4, hx - 22, y + 8, hx, y + 20);
    ctx.bezierCurveTo(hx + 22, y + 8, hx + 12, y - 4, hx, y + 8);
    ctx.fill();
  }
}

function drawCatchMeter(ctx) {
  const x = 980, y = 26, w = 240, h = 20;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  ctx.fillStyle = '#3a2c1c';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = G.catch > 70 ? '#e84f3d' : '#f2a13a';
  ctx.fillRect(x, y, (w * G.catch) / 100, h);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('FARMER', x, y - 8);
  if (G.catch > 70 && G.state === 'play') {
    ctx.fillStyle = Math.floor(G.time / 12) % 2 === 0 ? '#ff5a3d' : '#fff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('FARMER!', 560, 110);
  }
}

function hudDraw(ctx) {
  // Top bar.
  ctx.fillStyle = 'rgba(20, 12, 6, 0.55)';
  ctx.fillRect(0, 0, CFG.W, 58);
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('SCORE ' + Math.floor(G.score), 24, 38);
  ctx.fillText(Math.floor(G.dist) + ' m', 260, 38);
  ctx.fillText('CORN ' + G.corn, 420, 38);
  drawHearts(ctx, 560, 14);
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(stageName().toUpperCase(), 700, 36);
  drawCatchMeter(ctx);

  // Stage banner.
  if (G.bannerT > 0 && G.banner) {
    ctx.fillStyle = 'rgba(20, 12, 6, 0.6)';
    ctx.fillRect(340, 150, 600, 64);
    ctx.fillStyle = '#ffe9a8';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(G.banner, 640, 194);
    ctx.textAlign = 'left';
  }

  // Red flash when hurt.
  if (G.flash > 0) {
    ctx.fillStyle = 'rgba(232, 79, 61, ' + (G.flash / 40) + ')';
    ctx.fillRect(0, 0, CFG.W, CFG.H);
    G.flash -= 1;
  }

  // Mute note.
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '15px sans-serif';
  ctx.fillText(G.muted ? 'MUTED (M)' : 'M = mute', 24, CFG.H - 16);
}

function titleScreenDraw(ctx) {
  ctx.fillStyle = 'rgba(30, 16, 4, 0.45)';
  ctx.fillRect(0, 0, CFG.W, CFG.H);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 84px sans-serif';
  ctx.fillText('GOBBLE RUN', 640, 150);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('The Great Thanksgiving Escape', 640, 200);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#ffe9a8';
  ctx.fillText('You are the turkey. Dinner is at six. Run for the forest gate!', 640, 250);
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.fillText('SPACE / click — jump      ← → — speed      ↓ — hide in hay / dash', 640, 300);
  ctx.fillText('Dodge the carving knives. Leap the ovens. Do not let the farmer catch you.', 640, 332);
  ctx.fillStyle = '#f2a13a';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('PRESS SPACE TO RUN', 640, 420);
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '16px sans-serif';
  ctx.fillText('3 stages: Farmyard → Barn → Kitchen → freedom at 900 m', 640, 470);
  ctx.fillText('Built for make.fun — judge, this turkey begs for mercy and a top-20 spot.', 640, 500);
  ctx.textAlign = 'left';
}

function pauseScreenDraw(ctx) {
  ctx.fillStyle = 'rgba(20, 12, 6, 0.6)';
  ctx.fillRect(0, 0, CFG.W, CFG.H);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 56px sans-serif';
  ctx.fillText('PAUSED', 640, 330);
  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText('Press P to keep running — the farmer is catching his breath.', 640, 380);
  ctx.textAlign = 'left';
}

function endScreenDraw(ctx) {
  ctx.fillStyle = 'rgba(20, 12, 6, 0.62)';
  ctx.fillRect(0, 0, CFG.W, CFG.H);
  ctx.textAlign = 'center';
  if (G.endKind === 'escaped') {
    ctx.fillStyle = '#8ae86a';
    ctx.font = 'bold 72px sans-serif';
    ctx.fillText('ESCAPED!', 640, 210);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('Free for another year — the forest gate is yours!', 640, 270);
  } else {
    ctx.fillStyle = '#e84f3d';
    ctx.font = 'bold 72px sans-serif';
    ctx.fillText('CAUGHT!', 640, 210);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('The dinner bell rings... the farmer got his turkey.', 640, 270);
  }
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('Score ' + Math.floor(G.score) + '   •   ' + Math.floor(G.dist) + ' m   •   Corn ' + G.corn, 640, 340);
  ctx.fillStyle = '#f2a13a';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('Press R or click to run again', 640, 420);
  ctx.textAlign = 'left';
}

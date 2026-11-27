// Gobble Run — canvas painting: autumn sky, farmyard, barn, kitchen
// and forest gate, drawn entirely from shapes in code.

function drawBackground(ctx) {
  const stage = G.stage;
  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, CFG.H);
  if (stage === 2) {
    sky.addColorStop(0, '#e8c98a');
    sky.addColorStop(0.6, '#d9a05a');
    sky.addColorStop(1, '#8a5a2b');
  } else if (stage === 1) {
    sky.addColorStop(0, '#c98a5a');
    sky.addColorStop(0.6, '#a86a3d');
    sky.addColorStop(1, '#6a4020');
  } else {
    sky.addColorStop(0, '#f2b25a');
    sky.addColorStop(0.55, '#e88a4a');
    sky.addColorStop(1, '#b35a2a');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CFG.W, CFG.H);

  // Low autumn sun and drifting clouds.
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(1050, 110, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 244, 214, 0.85)';
  for (let i = 0; i < 3; i++) {
    const cx = ((G.time * 0.25 + i * 430) % 1500) - 120;
    ctx.beginPath();
    ctx.ellipse(cx, 90 + i * 46, 78, 22, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rolling hills.
  ctx.fillStyle = stage === 2 ? '#7c4f24' : '#8a6a2b';
  ctx.beginPath();
  ctx.moveTo(0, 520);
  ctx.quadraticCurveTo(320, 430, 640, 510);
  ctx.quadraticCurveTo(960, 580, 1280, 480);
  ctx.lineTo(1280, CFG.GROUND);
  ctx.lineTo(0, CFG.GROUND);
  ctx.closePath();
  ctx.fill();

  // Distant trees and the barn silhouette on the farmyard.
  if (stage === 0) {
    ctx.fillStyle = '#5a3d1c';
    for (let i = 0; i < 5; i++) {
      const tx = 120 + i * 230;
      ctx.beginPath();
      ctx.moveTo(tx, 520);
      ctx.lineTo(tx + 34, 430);
      ctx.lineTo(tx + 68, 520);
      ctx.closePath();
      ctx.fill();
    }
    // Red barn in the distance.
    ctx.fillStyle = '#a83a2a';
    ctx.fillRect(980, 420, 170, 100);
    ctx.fillStyle = '#7c2a1e';
    ctx.beginPath();
    ctx.moveTo(970, 420);
    ctx.lineTo(1065, 370);
    ctx.lineTo(1160, 420);
    ctx.closePath();
    ctx.fill();
  }

  // Ground.
  ctx.fillStyle = stage === 2 ? '#c9a06a' : '#6a8a3d';
  ctx.fillRect(0, CFG.GROUND, CFG.W, CFG.H - CFG.GROUND);
  ctx.fillStyle = stage === 2 ? '#b08a52' : '#55702e';
  ctx.fillRect(0, CFG.GROUND, CFG.W, 10);

  // Kitchen: checkered floor and a window with the farm outside.
  if (stage === 2) {
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let x = 0; x < CFG.W; x += 80) {
      for (let y = CFG.GROUND; y < CFG.H; y += 40) {
        if (((x / 80) + (y / 40)) % 2 === 0) ctx.fillRect(x, y, 80, 40);
      }
    }
    ctx.fillStyle = '#7c4f24';
    ctx.fillRect(60, 60, 220, 160);
    ctx.fillStyle = '#f2b25a';
    ctx.fillRect(72, 72, 196, 136);
    ctx.fillStyle = '#3f6db3';
    ctx.fillRect(72, 72, 196, 60);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('THANKSGIVING', 82, 170);
    // Hanging pans.
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(560 + i * 120, 110, 34, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Forest gate ahead in the final stretch.
  if (stage === 3) {
    ctx.fillStyle = '#2e4a22';
    for (let i = 0; i < 6; i++) {
      const tx = 900 + i * 60;
      ctx.beginPath();
      ctx.moveTo(tx, 600);
      ctx.lineTo(tx + 30, 380);
      ctx.lineTo(tx + 60, 600);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#8a6a3b';
    ctx.fillRect(1120, 420, 16, 180);
    ctx.fillRect(1240, 420, 16, 180);
    ctx.fillRect(1100, 400, 176, 22);
    ctx.fillStyle = '#f2c230';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('FREEDOM', 1112, 390);
  }
}

function drawGround(ctx) {
  // Scattered autumn leaves drifting past.
  ctx.fillStyle = '#d94f3d';
  for (let i = 0; i < 8; i++) {
    const lx = ((G.time * 0.9 + i * 173) % 1400) - 60;
    const ly = CFG.GROUND + 30 + (i % 4) * 18;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(Math.sin(G.time * 0.02 + i) * 0.6);
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function renderScene(ctx) {
  ctx.save();
  if (G.shake > 0) {
    ctx.translate(randRange(-G.shake, G.shake), randRange(-G.shake, G.shake));
    G.shake *= 0.85;
    if (G.shake < 0.4) G.shake = 0;
  }
  drawBackground(ctx);
  hazardsDraw(ctx);
  turkeyDraw(ctx);
  farmerDraw(ctx);
  drawGround(ctx);
  ctx.restore();
}

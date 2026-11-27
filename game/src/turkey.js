// Gobble Run — the turkey: run, jump, hide in a haystack, dash away.
// The bird auto-runs right; the player steers speed, jumps hazards and
// ducks out of the farmer's sight.

function turkeyReset() {
  const t = G.turkey;
  t.x = 300; t.y = CFG.GROUND; t.vy = 0; t.onGround = true;
  t.hiding = false; t.hideT = 0; t.dashT = 0; t.dashCd = 0;
  t.run = 0; t.hurtT = 0;
}

function turkeyJump() {
  const t = G.turkey;
  if (!t.onGround || t.hiding) return;
  t.vy = CFG.JUMP_V;
  t.onGround = false;
  cluckSound();
}

function turkeyHideOrDash() {
  const t = G.turkey;
  if (t.dashCd > 0) return;
  // Near a haystack: duck inside it and vanish from the farmer.
  const near = G.haystacks.some(function (h) {
    return Math.abs(h.x - t.x) < 90 && t.onGround;
  });
  if (near) {
    t.hiding = true;
    t.hideT = CFG.HIDE_TIME;
    return;
  }
  // Otherwise a short burst of speed with a cooldown.
  t.dashT = CFG.DASH_TIME;
  t.dashCd = CFG.DASH_CD;
  tone(500, 0.12, 'sine', 0.12, 900);
}

function turkeyUpdate(dt) {
  const t = G.turkey;
  if (t.hurtT > 0) t.hurtT -= dt;
  if (t.dashCd > 0) t.dashCd -= dt;
  if (t.dashT > 0) t.dashT -= dt;

  if (t.hiding) {
    t.hideT -= dt;
    if (t.hideT <= 0) t.hiding = false;
    return;
  }

  // Speed steering: hold right to sprint, left to ease off and let the
  // farmer fall behind the catch meter's edge.
  let target = CFG.BASE_SPEED + G.stage * 0.7;
  if (keyDown('arrowright') || keyDown('d')) target = CFG.TOP_SPEED;
  if (keyDown('arrowleft') || keyDown('a')) target = CFG.SLOW_SPEED;
  if (t.dashT > 0) target = CFG.TOP_SPEED + 3.5;
  G.speed += (target - G.speed) * 0.08;

  // Gravity and landing.
  t.vy += CFG.GRAV * dt;
  t.y += t.vy * dt;
  if (t.y >= CFG.GROUND) {
    t.y = CFG.GROUND;
    t.vy = 0;
    t.onGround = true;
  } else {
    t.onGround = false;
  }

  // Sideways drift within the lane.
  if (keyDown('arrowright') || keyDown('d')) t.x = Math.min(760, t.x + 2.2 * dt);
  if (keyDown('arrowleft') || keyDown('a')) t.x = Math.max(180, t.x - 2.2 * dt);

  t.run += G.speed * 0.12 * dt;
  G.dist += (G.speed * dt) / 62;
  G.score += G.speed * dt * 0.12;
}

function turkeyHurt() {
  const t = G.turkey;
  if (t.hurtT > 0 || t.hiding) return false;
  t.hurtT = CFG.HURT_TIME;
  G.lives -= CFG.METER_PER_HIT;
  G.catch = Math.min(100, G.catch + 25);
  G.shake = 10;
  G.flash = 12;
  thudSound();
  if (G.lives <= 0) {
    endGame('caught');
  }
  return true;
}

function turkeyDraw(ctx) {
  const t = G.turkey;
  if (t.hiding) return; // tucked inside the haystack, only straw shows
  const bob = Math.sin(t.run * 0.9) * 3;
  const blink = (t.hurtT > 0 && Math.floor(t.hurtT / 6) % 2 === 0);
  ctx.save();
  ctx.translate(t.x, t.y + bob * 0.3);
  if (blink) ctx.globalAlpha = 0.35;

  // Tail feather fan.
  ctx.fillStyle = '#8a5a2b';
  for (let i = -2; i <= 2; i++) {
    ctx.save();
    ctx.translate(-26, -38);
    ctx.rotate(i * 0.42);
    ctx.beginPath();
    ctx.ellipse(0, -26, 9, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c98a3d';
    ctx.beginPath();
    ctx.ellipse(0, -44, 5, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8a5a2b';
    ctx.restore();
  }
  // Body.
  ctx.fillStyle = '#a06835';
  ctx.beginPath();
  ctx.ellipse(0, -26, 34, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c98a3d';
  ctx.beginPath();
  ctx.ellipse(0, -18, 26, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  // Wing.
  ctx.fillStyle = '#7c4f24';
  ctx.beginPath();
  ctx.ellipse(-6, -26, 18, 12, -0.5, 0, Math.PI * 2);
  ctx.fill();
  // Neck and head.
  ctx.fillStyle = '#a06835';
  ctx.fillRect(22, -72, 12, 40);
  ctx.fillStyle = '#d9a066';
  ctx.beginPath();
  ctx.arc(30, -78, 15, 0, Math.PI * 2);
  ctx.fill();
  // Beak, wattle, eye.
  ctx.fillStyle = '#e8a13a';
  ctx.beginPath();
  ctx.moveTo(42, -80);
  ctx.lineTo(58, -75);
  ctx.lineTo(42, -71);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.ellipse(38, -66, 5, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1d1d1d';
  ctx.beginPath();
  ctx.arc(34, -82, 3.2, 0, Math.PI * 2);
  ctx.fill();
  // Legs, mid-stride.
  const step = Math.sin(t.run) * 10;
  ctx.strokeStyle = '#e8a13a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-8, 2);
  ctx.lineTo(-8 + step, 16);
  ctx.moveTo(8, 2);
  ctx.lineTo(8 - step, 16);
  ctx.stroke();
  ctx.restore();
}

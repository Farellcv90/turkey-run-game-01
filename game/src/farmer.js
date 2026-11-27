// Gobble Run — the farmer: chase, search, and corner.
// He runs in from the left, closes in when the turkey dawdles, loses
// the trail when it hides, and paces the yard hunting for it.

function farmerReset() {
  const f = G.farmer;
  f.x = 110; f.y = CFG.GROUND; f.mode = 'chase';
  f.searchT = 0; f.dir = 1; f.run = 0; f.spotted = false;
}

function farmerChases(dt) {
  const f = G.farmer;
  const t = G.turkey;
  const gap = t.x - f.x;
  // The chase is relative: the farmer's own running pace minus the
  // turkey's speed. Dawdle and he gains on you; sprint and you pull
  // away. The gap, not raw speed, is what the screen shows.
  let pace = 5.3 + G.stage * 0.35;
  if (t.dashT > 0) pace -= 2.0;
  if (gap > 420) pace += 1.0; // too far behind: he digs in a little
  f.x += (pace - G.speed) * dt;
  if (f.x < 30) f.x = 30;
  f.run += pace * 0.12 * dt;
  if (gap < 200 && !f.spotted) {
    f.spotted = true;
    alarmSound();
  } else if (gap >= 260) {
    f.spotted = false;
  }
}

function farmerSearches(dt) {
  const f = G.farmer;
  f.searchT -= dt;
  f.x += f.dir * 2.4 * dt;
  f.run += 2.4 * 0.12 * dt;
  if (f.x < 60) f.dir = 1;
  if (f.x > 420) f.dir = -1;
  if (f.searchT <= 0) {
    f.mode = 'chase';
    f.spotted = false;
  }
}

function farmerCorners(dt) {
  // Cornered: the turkey is slow and close, so he lunges in bursts.
  const f = G.farmer;
  const pace = 7.6 + G.stage * 0.4;
  f.x += (pace - G.speed) * dt;
  if (f.x < 30) f.x = 30;
  f.run += pace * 0.12 * dt;
}

function farmerUpdate(dt) {
  const f = G.farmer;
  const t = G.turkey;
  const gap = t.x - f.x;

  if (t.hiding && f.mode !== 'search') {
    f.mode = 'search';
    f.searchT = 200;
    f.dir = 1;
  }

  if (f.mode === 'search') farmerSearches(dt);
  else if (gap < 130 && G.speed < CFG.BASE_SPEED + 0.5) farmerCorners(dt);
  else { f.mode = 'chase'; farmerChases(dt); }

  // Catch meter: climbs while he breathes down the turkey's neck.
  if (gap < 170 && !t.hiding) G.catch += CFG.CATCH_RATE * dt;
  else G.catch -= CFG.CATCH_FALL * dt;
  G.catch = Math.max(0, Math.min(100, G.catch));

  // A full meter means he grabs the bird.
  if (G.catch >= 100) {
    G.catch = 55;
    if (turkeyHurt()) {
      f.x = t.x - 300;
      f.mode = 'chase';
    }
  }

  // Caught: he grabs the bird, it loses a life and scrambles ahead.
  if (gap < 46 && !t.hiding) {
    if (turkeyHurt()) {
      f.x = t.x - 300;
      f.mode = 'chase';
      t.x = Math.min(760, t.x + 60);
    }
  }
}

function farmerDraw(ctx) {
  const f = G.farmer;
  const step = Math.sin(f.run) * 9;
  ctx.save();
  ctx.translate(f.x, f.y);
  // Legs and boots.
  ctx.strokeStyle = '#3a2c1c';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-6, -42);
  ctx.lineTo(-6 + step, 0);
  ctx.moveTo(6, -42);
  ctx.lineTo(6 - step, 0);
  ctx.stroke();
  // Overalls.
  ctx.fillStyle = '#3f6db3';
  ctx.fillRect(-16, -84, 32, 46);
  ctx.fillStyle = '#2c4f85';
  ctx.fillRect(-16, -84, 8, 46);
  ctx.fillRect(8, -84, 8, 46);
  // Shirt and arms.
  ctx.fillStyle = '#c94f3d';
  ctx.fillRect(-20, -108, 40, 28);
  ctx.fillRect(-28, -106, 10, 34);
  ctx.fillRect(18, -106, 10, 34);
  // Head, beard, hat.
  ctx.fillStyle = '#e8b98a';
  ctx.beginPath();
  ctx.arc(0, -122, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8e0d0';
  ctx.beginPath();
  ctx.ellipse(0, -110, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7c4f24';
  ctx.beginPath();
  ctx.ellipse(0, -134, 22, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-12, -156, 24, 24);
  // Pitchfork held high.
  ctx.strokeStyle = '#8a6a3b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(26, -104);
  ctx.lineTo(40, -168);
  ctx.stroke();
  ctx.strokeStyle = '#c9c9c9';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, -168);
  ctx.lineTo(34, -188);
  ctx.moveTo(40, -168);
  ctx.lineTo(40, -190);
  ctx.moveTo(40, -168);
  ctx.lineTo(46, -188);
  ctx.stroke();
  ctx.restore();
}

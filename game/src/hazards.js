// Gobble Run — hazards: carving knives, fences, crates, oven flames,
// corn pickups and the haystacks the turkey hides in.

function spawnKnife() {
  const ahead = 1050 + randRange(0, 300);
  G.knives.push({
    x: ahead, y: -30, vy: randRange(6.5, 8.5) + G.stage * 0.7,
    spin: randRange(-0.12, 0.12), rot: randRange(0, 6),
  });
}

function spawnFence() {
  const kind = seededRand() < 0.5 ? 'fence' : 'crate';
  G.fences.push({ x: 1350, kind: kind, w: kind === 'fence' ? 70 : 54, h: kind === 'fence' ? 52 : 58 });
}

function spawnOvenFlame() {
  G.ovens.push({ x: 1350, w: 96, flame: 0 });
}

function spawnCorn() {
  const baseX = 900 + randRange(0, 200);
  for (let i = 0; i < 3; i++) {
    G.corns.push({ x: baseX + i * 46, y: CFG.GROUND - 60 - Math.abs(i - 1) * 46, got: false });
  }
}

function spawnHaystack() {
  G.haystacks.push({ x: 1350, w: 110 });
}

function dodgeCarvingKnife(k) {
  // A knife only bites while it is near the turkey's body height.
  const t = G.turkey;
  return Math.abs(k.x - t.x) < 34 && k.y > t.y - 96 && k.y < t.y + 8;
}

function hazardsUpdate(dt) {
  const t = G.turkey;
  const scroll = G.speed * dt;

  G.spawnFence -= scroll;
  G.spawnKnife -= dt;
  G.spawnCorn -= scroll;
  G.spawnOven -= scroll;

  if (G.spawnFence <= 0) {
    spawnFence();
    G.spawnFence = randRange(520, 820) - G.stage * 30;
  }
  if (G.spawnKnife <= 0) {
    spawnKnife();
    G.spawnKnife = randRange(95, 165) - G.stage * 6;
  }
  if (G.spawnCorn <= 0) {
    spawnCorn();
    G.spawnCorn = randRange(500, 800);
  }
  if (G.stage >= 2 && G.spawnOven <= 0) {
    spawnOvenFlame();
    G.spawnOven = randRange(600, 900);
  }
  if (G.stage === 0 && seededRand() < 0.004) spawnHaystack();
  if (G.stage === 1 && seededRand() < 0.003) spawnHaystack();

  // Knives fall, spin, and vanish below the ground.
  for (let i = G.knives.length - 1; i >= 0; i--) {
    const k = G.knives[i];
    k.y += k.vy * dt;
    k.x -= scroll * 0.55;
    k.rot += k.spin * dt;
    if (dodgeCarvingKnife(k)) {
      clangSound();
      G.knives.splice(i, 1);
      turkeyHurt();
      continue;
    }
    if (k.y > CFG.GROUND + 20) G.knives.splice(i, 1);
  }

  // Fences and crates scroll past; tripping on one costs speed and nerve.
  for (let i = G.fences.length - 1; i >= 0; i--) {
    const f = G.fences[i];
    f.x -= scroll;
    const hit = t.onGround && Math.abs(f.x - t.x) < (f.w / 2 + 22) && t.y > CFG.GROUND - f.h - 6;
    if (hit) {
      G.fences.splice(i, 1);
      G.speed = 4.2;
      G.farmer.x -= 100; // the stumble buys a little breathing room
      G.catch = Math.min(100, G.catch + 12);
      thudSound();
      G.shake = 6;
      continue;
    }
    if (f.x < -120) G.fences.splice(i, 1);
  }

  // Oven flames lick upward; touching one burns.
  for (let i = G.ovens.length - 1; i >= 0; i--) {
    const o = G.ovens[i];
    o.x -= scroll;
    o.flame += dt * 0.2;
    const inFlame = Math.abs(o.x - t.x) < o.w / 2 + 18 && t.y > CFG.GROUND - 110;
    if (inFlame && t.hurtT <= 0) {
      clangSound();
      turkeyHurt();
    }
    if (o.x < -160) G.ovens.splice(i, 1);
  }

  // Corn: grab it for points.
  for (let i = G.corns.length - 1; i >= 0; i--) {
    const c = G.corns[i];
    c.x -= scroll;
    if (!c.got && Math.abs(c.x - t.x) < 36 && Math.abs(c.y - (t.y - 40)) < 60) {
      c.got = true;
      G.corn += 1;
      G.score += CFG.CORN_SCORE;
      tone(990, 0.09, 'triangle', 0.14, 1320);
    }
    if (c.x < -60 || c.got) G.corns.splice(i, 1);
  }

  for (let i = G.haystacks.length - 1; i >= 0; i--) {
    G.haystacks[i].x -= scroll;
    if (G.haystacks[i].x < -160) G.haystacks.splice(i, 1);
  }
}

function ovenFlamesDraw(ctx, o) {
  const flick = Math.sin(o.flame * 2.4) * 6;
  ctx.save();
  ctx.translate(o.x, CFG.GROUND);
  // Stove body.
  ctx.fillStyle = '#5a5f66';
  ctx.fillRect(-o.w / 2, -64, o.w, 64);
  ctx.fillStyle = '#2e3236';
  ctx.fillRect(-o.w / 2 + 8, -56, o.w - 16, 30);
  ctx.fillStyle = '#e8b13a';
  ctx.fillRect(-o.w / 2 + 8, -18, 20, 8);
  // Flames.
  const cols = ['#e8a13a', '#e86a2a', '#d94f3d'];
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = cols[i];
    ctx.beginPath();
    const fx = -28 + i * 28;
    const fh = 52 + flick + (i === 1 ? 14 : 0);
    ctx.moveTo(fx - 12, -64);
    ctx.quadraticCurveTo(fx - 16, -64 - fh * 0.7, fx, -64 - fh);
    ctx.quadraticCurveTo(fx + 16, -64 - fh * 0.7, fx + 12, -64);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function hazardsDraw(ctx) {
  // Haystacks (hide here).
  for (const h of G.haystacks) {
    ctx.save();
    ctx.translate(h.x, CFG.GROUND);
    ctx.fillStyle = '#d9a83a';
    ctx.beginPath();
    ctx.moveTo(-h.w / 2, 0);
    ctx.quadraticCurveTo(-h.w / 2, -78, 0, -84);
    ctx.quadraticCurveTo(h.w / 2, -78, h.w / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#a87c22';
    ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 16, -12);
      ctx.lineTo(i * 20, -64);
      ctx.stroke();
    }
    ctx.restore();
  }
  // Hiding turkey peeking out of the haystack.
  const t = G.turkey;
  if (t.hiding) {
    ctx.fillStyle = '#d9a066';
    ctx.beginPath();
    ctx.arc(t.x + 6, CFG.GROUND - 78, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1d1d1d';
    ctx.beginPath();
    ctx.arc(t.x + 10, -82 + CFG.GROUND, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  // Fences and crates.
  for (const f of G.fences) {
    ctx.save();
    ctx.translate(f.x, CFG.GROUND);
    if (f.kind === 'fence') {
      // Whitewashed pickets so the fence reads against the brown hill.
      ctx.fillStyle = '#f2e8d0';
      ctx.strokeStyle = '#5a4020';
      ctx.lineWidth = 2;
      ctx.fillRect(-f.w / 2, -f.h, 8, f.h);
      ctx.strokeRect(-f.w / 2, -f.h, 8, f.h);
      ctx.fillRect(f.w / 2 - 8, -f.h, 8, f.h);
      ctx.strokeRect(f.w / 2 - 8, -f.h, 8, f.h);
      ctx.fillRect(-f.w / 2, -f.h + 6, f.w, 8);
      ctx.strokeRect(-f.w / 2, -f.h + 6, f.w, 8);
      ctx.fillRect(-f.w / 2, -f.h + 26, f.w, 8);
      ctx.strokeRect(-f.w / 2, -f.h + 26, f.w, 8);
    } else {
      ctx.fillStyle = '#c98a3d';
      ctx.fillRect(-f.w / 2, -f.h, f.w, f.h);
      ctx.strokeStyle = '#7c5a28';
      ctx.lineWidth = 3;
      ctx.strokeRect(-f.w / 2, -f.h, f.w, f.h);
      ctx.beginPath();
      ctx.moveTo(-f.w / 2, -f.h);
      ctx.lineTo(f.w / 2, 0);
      ctx.moveTo(f.w / 2, -f.h);
      ctx.lineTo(-f.w / 2, 0);
      ctx.stroke();
    }
    ctx.restore();
  }
  // Ovens with flames.
  for (const o of G.ovens) ovenFlamesDraw(ctx, o);
  // Corn pickups.
  for (const c of G.corns) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.fillStyle = '#f2c230';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 20, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7fae3e';
    ctx.beginPath();
    ctx.moveTo(-8, 14);
    ctx.lineTo(-16, 26);
    ctx.lineTo(0, 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  // Falling carving knives, drawn big with a red handle so they read
  // as a threat at a glance.
  for (const k of G.knives) {
    ctx.save();
    ctx.translate(k.x, k.y);
    ctx.rotate(k.rot);
    ctx.fillStyle = '#e8edf0';
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.lineTo(15, -10);
    ctx.lineTo(9, 8);
    ctx.lineTo(-9, 8);
    ctx.lineTo(-15, -10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8a949c';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#a83a2a';
    ctx.fillRect(-9, 8, 18, 24);
    ctx.restore();
  }
}

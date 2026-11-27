// Gobble Run — stages: Farmyard, Barn, Kitchen, then the forest gate.
// Each stage is a stretch of distance; later stages run faster and
// throw more knives, and the kitchen adds the ovens.

const STAGE_NAMES = ['Farmyard', 'Barn', 'Kitchen', 'Forest Gate'];
const STAGE_BANNERS = ['', 'Into the Barn!', 'The Kitchen — mind the ovens!', 'The forest gate — RUN!'];

function stageName() {
  return STAGE_NAMES[Math.min(G.stage, 3)];
}

function stageFor(dist) {
  if (dist >= CFG.ESCAPE_DIST) return 3;
  return Math.min(2, Math.floor(dist / CFG.STAGE_LEN));
}

function stageDifficulty() {
  return 1 + G.stage * 0.35;
}

function stageTransition(dt) {
  const now = stageFor(G.dist);
  if (now !== G.stage) {
    G.prevStage = G.stage;
    G.stage = now;
    G.banner = STAGE_BANNERS[now] || '';
    G.bannerT = 150;
    if (now === 3) gobbleSound();
    else tone(660, 0.2, 'triangle', 0.14, 880);
  }
  if (G.bannerT > 0) G.bannerT -= dt;
}

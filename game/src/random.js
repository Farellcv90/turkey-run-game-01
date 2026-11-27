// Gobble Run — a tiny seeded random source so the staged screenshot
// scenes in shots.js land exactly the same way on every load.

let rngState = 1;

function reseed(seed) {
  rngState = (seed >>> 0) || 1;
  G.seed = rngState;
}

function seededRand() {
  // mulberry32: small, fast, and good enough for spawn jitter.
  rngState = (rngState + 0x6D2B79F5) >>> 0;
  let t = rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function randRange(lo, hi) {
  return lo + seededRand() * (hi - lo);
}

function randPick(list) {
  return list[Math.floor(seededRand() * list.length)];
}

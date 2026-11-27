// Gobble Run — tuning constants and the shared live state.
// One place owns every number the rest of the game reads, so balancing
// the chase, the jumps and the stage ramp means editing this file only.

const CFG = {
  W: 1280,
  H: 720,
  GROUND: 600,
  GRAV: 0.6,
  JUMP_V: -14,
  BASE_SPEED: 5.0,
  TOP_SPEED: 9.6,
  SLOW_SPEED: 3.2,
  STAGE_LEN: 300,
  ESCAPE_DIST: 900,
  LIVES: 3,
  CORN_SCORE: 25,
  METER_PER_HIT: 1,
  CATCH_RATE: 0.32,
  CATCH_FALL: 0.4,
  HIDE_TIME: 90,
  DASH_TIME: 14,
  DASH_CD: 150,
  HURT_TIME: 90,
};

// Live state. Every module reads and writes this one object; nothing
// else holds game state, which keeps save/restage and the shot scenes
// in shots.js trivial to reset.
const G = {
  state: 'title', // title | play | paused | caught | escaped
  time: 0,
  dist: 0,
  score: 0,
  corn: 0,
  lives: CFG.LIVES,
  speed: CFG.BASE_SPEED,
  stage: 0,
  prevStage: 0,
  banner: '',
  bannerT: 0,
  catch: 0,
  muted: false,
  shake: 0,
  flash: 0,
  endKind: 'escaped',
  over: false,
  turkey: {
    x: 300, y: CFG.GROUND, vy: 0, onGround: true,
    hiding: false, hideT: 0, dashT: 0, dashCd: 0,
    run: 0, hurtT: 0, face: 1,
  },
  farmer: {
    x: 110, y: CFG.GROUND, mode: 'chase', // chase | search | corner
    searchT: 0, dir: 1, run: 0, spotted: false,
  },
  knives: [],
  fences: [],
  ovens: [],
  corns: [],
  haystacks: [],
  spawnFence: 0,
  spawnKnife: 70,
  spawnCorn: 40,
  spawnOven: 0,
  seed: 7,
};

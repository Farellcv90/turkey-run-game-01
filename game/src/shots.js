// Gobble Run — deterministic staging scenes for screenshots.
// `?shot=title|play|kitchen|end&seed=N` freezes one readable moment:
// the same seed always builds the same scene, so a screenshot taken
// twice shows the same frame.

function shotSceneFor(name) {
  reseed(G.seed);
  if (name === 'title') {
    G.state = 'title';
    turkeyReset();
    farmerReset();
    G.farmer.x = 180;
    G.haystacks = [{ x: 900, w: 110 }];
    G.corns = [{ x: 700, y: CFG.GROUND - 60, got: false }];
    return;
  }
  if (name === 'play') {
    G.state = 'play';
    G.dist = 120;
    G.score = 1250;
    G.corn = 6;
    G.lives = 3;
    G.stage = 0;
    G.catch = 45;
    turkeyReset();
    G.turkey.x = 320;
    G.farmer.x = 150;
    G.farmer.mode = 'chase';
    G.knives = [{ x: 640, y: 240, vy: 7, spin: 0.05, rot: 0.4 }];
    G.fences = [{ x: 860, kind: 'fence', w: 70, h: 52 }];
    G.corns = [
      { x: 560, y: CFG.GROUND - 60, got: false },
      { x: 606, y: CFG.GROUND - 106, got: false },
      { x: 652, y: CFG.GROUND - 60, got: false },
    ];
    G.haystacks = [{ x: 1120, w: 110 }];
    G.ovens = [];
    return;
  }
  if (name === 'kitchen') {
    G.state = 'play';
    G.dist = 640;
    G.score = 4200;
    G.corn = 14;
    G.lives = 2;
    G.stage = 2;
    G.catch = 62;
    turkeyReset();
    G.turkey.x = 330;
    G.farmer.x = 170;
    G.farmer.mode = 'chase';
    G.knives = [{ x: 700, y: 220, vy: 8, spin: -0.06, rot: -0.3 }];
    G.fences = [];
    G.corns = [{ x: 580, y: CFG.GROUND - 60, got: false }];
    G.haystacks = [];
    G.ovens = [
      { x: 950, w: 96, flame: 1.2 },
      { x: 1150, w: 96, flame: 2.6 },
    ];
    return;
  }
  if (name === 'end') {
    G.state = 'escaped';
    G.endKind = 'escaped';
    G.dist = 900;
    G.score = 9870;
    G.corn = 21;
    G.lives = 2;
    G.stage = 3;
    turkeyReset();
    G.turkey.x = 1080;
    G.farmer.x = 700;
    G.farmer.mode = 'search';
    G.knives = [];
    G.fences = [];
    G.ovens = [];
    G.corns = [];
    G.haystacks = [];
    return;
  }
}

function applyShotScene() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  const seed = parseInt(params.get('seed') || '7', 10);
  if (!shot) return false;
  G.seed = Number.isFinite(seed) ? seed : 7;
  shotSceneFor(shot);
  return true;
}

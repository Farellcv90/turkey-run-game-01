// Gobble Run — all sound is synthesized with WebAudio, no audio files.
// The context is created on the first user gesture so browsers never
// block it, and every effect is a short oscillator/noise burst.

let audioCtx = null;
let audioMaster = null;

function audioInit() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return;
  }
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
    audioMaster = audioCtx.createGain();
    audioMaster.gain.value = 0.35;
    audioMaster.connect(audioCtx.destination);
  } catch (err) {
    audioCtx = null;
  }
}

function toggleMute() {
  G.muted = !G.muted;
  if (audioMaster) audioMaster.gain.value = G.muted ? 0 : 0.35;
}

function tone(freq, dur, type, vol, slideTo) {
  if (!audioCtx || G.muted) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
  g.gain.setValueAtTime(vol || 0.2, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(g);
  g.connect(audioMaster);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function gobbleSound() {
  if (!audioCtx || G.muted) return;
  const notes = [420, 380, 460, 340];
  notes.forEach(function (f, i) {
    setTimeout(function () { tone(f, 0.09, 'sawtooth', 0.16, f * 0.7); }, i * 90);
  });
}

function cluckSound() {
  tone(620, 0.08, 'square', 0.1, 480);
}

function alarmSound() {
  tone(880, 0.16, 'triangle', 0.16, 660);
  setTimeout(function () { tone(880, 0.16, 'triangle', 0.16, 660); }, 180);
}

function clangSound() {
  tone(220, 0.18, 'square', 0.18, 110);
  tone(1470, 0.1, 'triangle', 0.08, 900);
}

function thudSound() {
  tone(140, 0.16, 'sine', 0.22, 60);
}

function winJingle() {
  if (!audioCtx || G.muted) return;
  const notes = [523, 659, 784, 1047];
  notes.forEach(function (f, i) {
    setTimeout(function () { tone(f, 0.22, 'triangle', 0.18); }, i * 140);
  });
}

function loseSound() {
  tone(330, 0.3, 'sawtooth', 0.14, 110);
  setTimeout(function () { tone(220, 0.4, 'sawtooth', 0.12, 70); }, 220);
}

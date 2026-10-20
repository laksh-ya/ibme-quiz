import { S } from "../state";

export var ac;
export function tone(f, t0, d, type = "sine", g = 0.18, f2?) {
  if (!S.set.sound) return;
  try {
    ac = ac || new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    const o = ac.createOscillator(), v = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, ac.currentTime + t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, ac.currentTime + t0 + d);
    v.gain.setValueAtTime(1e-4, ac.currentTime + t0);
    v.gain.exponentialRampToValueAtTime(g, ac.currentTime + t0 + 0.012);
    v.gain.exponentialRampToValueAtTime(1e-4, ac.currentTime + t0 + d);
    o.connect(v);
    v.connect(ac.destination);
    o.start(ac.currentTime + t0);
    o.stop(ac.currentTime + t0 + d + 0.05);
  } catch (e) {
  }
}
export var snd = {
  tap: () => tone(660, 0, 0.045, "sine", 0.05),
  ok: () => {
    tone(1046.5, 0, 0.14, "sine", 0.075);
    tone(1318.5, 0.08, 0.22, "sine", 0.075);
    tone(2093, 0.08, 0.18, "sine", 0.02);
  },
  no: () => tone(180, 0, 0.18, "sine", 0.09, 120),
  done: () => [659.3, 784, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.26, "sine", 0.085)),
  swoosh: () => tone(240, 0, 0.28, "sine", 0.04, 880)
};
export var buzz = (p) => {
  if (S.set.haptic && navigator.vibrate) try {
    navigator.vibrate(p);
  } catch (e) {
  }
};

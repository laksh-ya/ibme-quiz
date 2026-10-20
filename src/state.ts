export var mem = {};
export var KEY = "ibme_duo_v1";
export function load() {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return JSON.parse(r);
  } catch (e) {
  }
  return mem;
}
export var TSMUL = { small: 0.86, std: 1, large: 1.18 };
export var DEF = { sound: true, haptic: true, optShuf: false, theme: "dark", textSize: "small", name: "", av: 0 };
export var S: any = Object.assign({ q: {}, xp: 0, days: [], best: {} }, load());
S.set = Object.assign({}, DEF, S.set);
if (S.set.theme !== "light") S.set.theme = "dark";
if (!TSMUL[S.set.textSize]) S.set.textSize = "small";
export function save() {
  mem = S;
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {
  }
}
export var today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
export function streak() {
  const d = new Set(S.days);
  let n = 0;
  const c = /* @__PURE__ */ new Date();
  if (!d.has(c.toISOString().slice(0, 10))) c.setDate(c.getDate() - 1);
  while (d.has(c.toISOString().slice(0, 10))) {
    n++;
    c.setDate(c.getDate() - 1);
  }
  return n;
}
export function resetProgress() {
  S = { q: {}, xp: 0, days: [], best: {}, set: S.set };
}

export var mem = {};
export var KEY = "ibme_duo_v1";
export function load() {
  try {
    const r = localStorage.getItem(KEY);
    if (r) { const value = JSON.parse(r); return value && typeof value === "object" && !Array.isArray(value) ? value : {}; }
  } catch (e) {
  }
  return mem;
}
export var TSMUL = { small: 0.86, std: 1, large: 1.18 };
export var DEF = { sound: true, haptic: true, optShuf: false, theme: "dark", textSize: "std", name: "", av: 0 };
export var S: any = Object.assign({ q: {}, xp: 0, days: [], best: {} }, load());
S.set = Object.assign({}, DEF, S.set);
S.q = S.q && typeof S.q === "object" ? S.q : {};
S.best = S.best && typeof S.best === "object" ? S.best : {};
S.days = Array.isArray(S.days) ? S.days.filter(d => typeof d === "string") : [];
S.xp = Math.max(0, Number(S.xp) || 0);
S.set.name = String(S.set.name || "").slice(0, 18);
S.set.av = Math.max(0, Math.min(7, Math.floor(Number(S.set.av) || 0)));
if (S.set.theme !== "light") S.set.theme = "dark";
if (!TSMUL[S.set.textSize]) S.set.textSize = "small";
export function save() {
  mem = S;
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {
  }
}
export const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
export var today = () => dayKey(new Date());
export function streak() {
  const d = new Set(S.days);
  let n = 0;
  const c = /* @__PURE__ */ new Date();
  if (!d.has(dayKey(c))) c.setDate(c.getDate() - 1);
  while (d.has(dayKey(c))) {
    n++;
    c.setDate(c.getDate() - 1);
  }
  return n;
}
export function resetProgress() {
  S = { q: {}, xp: 0, days: [], best: {}, set: S.set };
}

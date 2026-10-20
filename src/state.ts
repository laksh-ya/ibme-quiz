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
const record = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);
const count = (v: unknown) => Number.isFinite(Number(v)) ? Math.max(0, Math.floor(Number(v))) : 0;
S.q = record(S.q) ? Object.fromEntries(Object.entries(S.q).filter(([k,v]) => /^\d+-\d+$/.test(k) && record(v)).map(([k,v]: [string,any]) => [k, {s:count(v.s),r:Math.min(count(v.r),count(v.s)),x:count(v.x),m:v.m ? 1 : 0}])) : {};
S.best = record(S.best) ? Object.fromEntries(Object.entries(S.best).filter(([k,v]) => /^w[1-8]$/.test(k) && (typeof v === "number" || typeof v === "string") && Number.isFinite(Number(v))).map(([k,v]) => [k,Math.max(0,Math.min(100,Math.round(Number(v))))])) : {};
S.days = Array.isArray(S.days) ? [...new Set(S.days.filter(d => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)))] : [];
S.xp = count(S.xp);
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

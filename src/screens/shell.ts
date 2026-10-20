import { $, esc } from "../lib/util";
import { S, streak } from "../state";
import { I, mascot } from "../lib/icons";
import { Q, qid, stat, wrongQs } from "../quiz";
import { ui } from "../ui";

export const topStats = () => `<div class="stats"><span class="stat" title="Day streak">${I.flame}<span style="color:var(--orange)">${streak()}</span></span><span class="stat" title="XP">${I.bolt}<span style="color:var(--yellow-d)">${S.xp}</span></span><span class="stat" title="Mistakes waiting">${I.heart}<span style="color:var(--red)">${wrongQs().length}</span></span></div>`;

export const NAVS = [["learn", "Learn", I.home], ["practice", "Practice", I.target], ["pdfs", "PDFs", I.book], ["me", "Profile", I.user]];

export function shell(inner, rail) {
  return `<div class="app"><nav class="side"><div class="logo">ibme</div>${NAVS.map(([k, n, ic]) => `<button class="nav ${(ui.page === k || k === "practice" && ["review", "cards"].includes(ui.page)) ? "on" : ""}" data-go="${k}">${ic}<span>${n}</span></button>`).join("")}</nav>
<div class="main" id="main"><div class="col">${inner}</div><aside class="rail">${rail}</aside></div></div>`;
}

export function railHtml() {
  const tot = Q.length, seen = Q.filter((q) => (S.q[qid(q)] || {}).s).length, good = Q.filter((q) => (S.q[qid(q)] || {}).r).length;
  const nw = wrongQs().length;
  return `${topStats()}
<div class="card"><h3>Your progress</h3><div style="font-size:15px;color:var(--sub)">Seen ${seen}/${tot}</div><div class="prog"><i style="width:${seen / tot * 100}%"></i></div>
<div style="font-size:15px;color:var(--sub);margin-top:8px">Answered right at least once ${good}/${tot}</div><div class="prog"><i style="width:${good / tot * 100}%;background:var(--blue)"></i></div></div>
<div class="card"><h3>Mistakes to fix</h3><div style="display:flex;gap:14px;align-items:center"><div style="width:64px;flex:none">${mascot(S.set.av, nw ? "sad" : "happy")}</div><div style="font-size:15px;line-height:1.4">${nw ? nw + " questions are waiting for a clean run." : S.set.name ? `All clear, ${esc(S.set.name)}. Nice work!` : "Nothing to fix. Nice."}</div></div>
${nw ? '<button class="btn white wide" style="margin-top:12px" data-start="mistakes">Practice mistakes</button>' : ""}</div>
<div class="card"><h3>Keyboard</h3><div style="font-size:14px;line-height:1.9;color:var(--sub)">1-6 or A-F pick an option<br>Enter checks and continues<br>Arrows move, Space selects<br>Esc leaves the lesson</div></div>`;
}

import { $ } from "../lib/util";
import { S } from "../state";
import { I, mascot } from "../lib/icons";
import { wkStat } from "../quiz";
import { ui } from "../ui";

export function popover(w) {
  return `<div class="pop2" style="--ax:${w.off}px"><h3>Week ${w.w}</h3><p>10 questions. Syllabus covered by the end of this week: ${Math.round(w.w * 12.5)}%</p>
<div class="row"><button class="btn white" data-start="week:${w.w}:learn">Learn</button><button class="btn ink" data-start="week:${w.w}:quiz">Quiz</button></div>
<div class="snote">Learn: instant feedback. Quiz: results at the end.</div></div>`;
}

export function pgLearn() {
  const zf = innerWidth <= 400 ? 0.62 : 1, offs = [0, -46, -74, -46, 0, 46, 74, 46].map((o) => Math.round(o * zf));
  let firstOpen = null;
  for (let w = 1; w <= 8; w++) if ((wkStat(w) || 0) < 80) {
    firstOpen = w;
    break;
  }
  const nodes = [1, 2, 3, 4, 5, 6, 7, 8].map((w) => {
    const b = wkStat(w), done = b != null && b >= 80;
    return `<div class="wrow" style="margin-top:${firstOpen === w ? (w === 1 ? 48 : 120) : 0}px"><div style="transform:translateX(${offs[w - 1]}px);position:relative">
  ${firstOpen === w && ui.popW !== w ? '<div class="start">Start</div>' : ""}
  <button class="node ${done ? "done" : ""} ${ui.popW === w ? "open" : ""}" data-node="${w}">${done ? I.check : I.star}<span class="lab">Week ${w}${b != null ? " \xB7 " + b + "%" : ""}</span></button></div>${ui.popW === w ? popover({ w, off: offs[w - 1] }) : ""}</div>`;
  }).join("");
  return `<div class="banner"><div><small>Section 1</small><h2>Innovation, Business Models and Entrepreneurship</h2></div></div>
<div class="path">${nodes}<div style="width:140px;margin-top:6px">${mascot(S.set.av, "cheer")}</div></div>`;
}

import { $ } from "../lib/util";
import { MODES, modeCount } from "../quiz";
import { ui } from "../ui";

export function pgPractice() {
  const prim = ["daily", "mistakes", "shuffle"];
  const tile = ([k, n, d, ic, col]) => `<button class="tile" data-start="${k}"><div class="ic" style="background:${col};box-shadow:0 4px 0 rgba(0,0,0,.18)">${ic}</div><span class="n">${modeCount(k)} questions</span><b>${n}</b><span class="tile-desc">${d}</span></button>`;
  const main = MODES.filter((m) => prim.includes(m[0])).map(tile).join("");
  const rest = MODES.filter((m) => !prim.includes(m[0])).map(tile).join("");
  return `<h1 class="pg">Practice</h1><p class="sub">Pick a round. Learn explains each answer as you go; Quiz saves the results for the end.</p>
<div class="seg"><button class="${ui.hubMode === "learn" ? "on" : ""}" data-hub="learn">Learn</button><button class="${ui.hubMode === "quiz" ? "on" : ""}" data-hub="quiz">Quiz</button></div>
<div class="grid">${main}</div>
<div class="study-tools"><button class="btn white" data-go="review">Answer library</button><button class="btn white" data-go="cards">Flashcards</button></div>
${ui.hubMore ? `<div class="grid" style="margin-top:14px">${rest}</div>` : `<button class="morebtn" data-more="1">More ways to practice</button>`}`;
}

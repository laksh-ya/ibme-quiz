import { $, L, esc } from "../lib/util";
import { S } from "../state";
import { mascot } from "../lib/icons";
import { IMGS, Q, isMulti, qid, wrongQs } from "../quiz";
import { rvOpen, rvf } from "../ui";

export function rvBody(q) {
  return `<div class="bd">${q.img ? `<img class="qimg" src="${IMGS[q.img]}" alt="">` : ""}<div style="margin:10px 0"><b>Question:</b> ${esc(q.q)}</div>
${q.opts.map((o, i) => `<div style="margin:3px 0" class="${q.ans.includes(i) ? "a" : ""}">${L[i]}) ${esc(o)}${q.ans.includes(i) ? " (correct)" : ""}</div>`).join("")}
<div style="margin-top:10px"><b>Why:</b> ${esc(q.why)}</div>
${Object.keys(q.wrong).map((k) => `<div style="margin-top:4px;color:var(--sub)"><b>${L[k]}:</b> ${esc(q.wrong[k])}</div>`).join("")}</div>`;
}

export const rvItem = (q) => `<div class="rv"><button data-rv="${qid(q)}"><span class="nn">W${q.w} Q${q.n}</span><span>${esc(q.q.length > 140 ? q.q.slice(0, 140) + "..." : q.q)}</span></button>${rvOpen.has(qid(q)) ? rvBody(q) : ""}</div>`;

export function pgMistakes() {
  const l = wrongQs();
  if (!l.length) return `<h1 class="pg">Mistakes</h1><div style="text-align:center;padding:50px 0"><div style="width:170px;margin:0 auto 16px">${mascot(S.set.av, "cheer")}</div><h2 class="ti" style="font-size:26px;margin:0 0 8px">No mistakes right now</h2><p class="sub" style="margin:0">Questions you get wrong in any lesson land here until you answer them right in a mistakes round.</p></div>`;
  return `<h1 class="pg">Mistakes</h1><p class="sub">${l.length} questions from across the weeks. Answer each right once to clear it.</p>
<div style="display:flex;gap:12px;margin-bottom:18px"><button class="btn" data-start="mistakes:learn">Learn them</button><button class="btn blue" data-start="mistakes:quiz">Quiz me</button></div>
${l.map(rvItem).join("")}`;
}

export function pgReview() {
  const l = Q.filter((q) => (!rvf.w || q.w === rvf.w) && (!rvf.t || (rvf.t === "multi" ? isMulti(q) : !isMulti(q))) && (!rvf.q || (q.q + q.opts.join(" ") + q.why).toLowerCase().includes(rvf.q.toLowerCase())));
  return `<h1 class="pg">Review</h1><p class="sub">Read every question with its answer and explanation.</p>
<input class="search" id="rvq" placeholder="Search questions, options, explanations" value="${esc(rvf.q)}">
<div class="pills">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((w) => `<button class="pill ${rvf.w === w ? "on" : ""}" data-rvw="${w}">${w ? "W" + w : "All"}</button>`).join("")}<button class="pill ${rvf.t === "multi" ? "on" : ""}" data-rvt="multi">Multi</button><button class="pill ${rvf.t === "single" ? "on" : ""}" data-rvt="single">Single</button></div>
<div style="color:var(--sub);margin-bottom:10px">${l.length} questions</div>${l.map(rvItem).join("")}`;
}

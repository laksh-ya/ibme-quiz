import { $, L, esc, shuf } from "../lib/util";
import { snd } from "../lib/audio";
import { I } from "../lib/icons";
import { IMGS, Q, weekQs, wrongQs } from "../quiz";
import { goHome, head, skip, toast } from "./session";
import { ui } from "../ui";
import { sweep } from "../lib/wave";

export function pgCards() {
  const items = [["all", "All 80", I.all, "#ffc800"], ["mistakes", "Mistakes", I.heart, "#ff4b4b"]].concat([1, 2, 3, 4, 5, 6, 7, 8].map((w) => ["w" + w, "Week " + w, I.cards, "#ff9600"]));
  return `<h1 class="pg">Flashcards</h1><p class="sub">Read the question, flip the card, rate yourself. Cards you miss come back.</p>
<div class="grid">${items.map(([k, n, ic, c]) => `<button class="tile" data-cards="${k}"><div class="ic" style="background:${c};box-shadow:0 4px 0 rgba(0,0,0,.18)">${ic}</div><b>${n}</b></button>`).join("")}</div>`;
}

export function startCards(k) {
  const l = k === "all" ? Q : k === "mistakes" ? wrongQs() : weekQs(+k.slice(1));
  if (!l.length) return toast("No cards here yet.");
  ui.fc = { l: shuf(l), i: 0, flip: false };
  sweep(ui.el, renderCards);
}

export function renderCards() {
  const q = ui.fc.l[ui.fc.i];
  if (!q) {
    ui.fc = null;
    return goHome();
  }
  const n = q.q.length + q.why.length;
  ui.el.innerHTML = `<div class="ex"><div class="ex-top"><button class="x" aria-label="Close flashcards" data-cx="1">${I.x}</button><div class="bar"><i style="width:${ui.fc.i / ui.fc.l.length * 100}%"></i></div><span class="chip">${ui.fc.i + 1}/${ui.fc.l.length}</span></div>
<div class="ex-body" style="--fs:${n < 300 ? 21 : n < 600 ? 18 : 15.5}px"><div class="stage"><h1 class="head">Flashcard <span style="font-size:.6em;color:var(--sub)">W${q.w} Q${q.n}</span></h1>
<div class="card-scroll-hint" hidden>Scroll inside the card to read more ↓</div><div class="fc ${ui.fc.flip ? "flip" : ""}" role="button" tabindex="0" aria-label="Flip flashcard" aria-pressed="${ui.fc.flip}" data-flip="1"><div class="in"><div class="face"><div>${esc(q.q).replace(/\n/g, "<br>")}</div>${q.img ? `<img class="qimg" style="max-height:22vh" src="${IMGS[q.img]}" alt="">` : ""}${q.opts.map((o, i) => `<div style="color:var(--sub)">${L[i]}) ${esc(o)}</div>`).join("")}<div class="kb" style="margin-top:6px">Tap or press Space to flip</div></div>
<div class="face back"><b>${q.ans.map((i) => L[i] + ") " + esc(q.opts[i])).join("<br>")}</b><div style="color:var(--text);font-size:.92em">${esc(q.why)}</div></div></div></div></div></div>
<div class="ex-foot"><div class="in"><button class="btn skip" data-again="1" ${ui.fc.flip ? "" : "disabled"}>Again</button><span class="kb" style="flex:1;text-align:center">Right arrow: got it \xB7 Left arrow: again</span><button class="btn" data-got="1" ${ui.fc.flip ? "" : "disabled"}>Got it</button></div></div></div>`;
  requestAnimationFrame(() => {
    const face = $(".fc .face", ui.el), hint = $(".card-scroll-hint", ui.el);
    if (face && hint) hint.hidden = face.scrollHeight <= face.clientHeight + 2;
  });
}

export function renderCardsFlip() {
  const f = $(".fc", ui.el);
  if (f) {
    f.classList.toggle("flip", ui.fc.flip);
    f.setAttribute("aria-pressed", String(ui.fc.flip));
    snd.tap();
    const a = $("[data-again]", ui.el), g = $("[data-got]", ui.el);
    if (a) a.disabled = !ui.fc.flip;
    if (g) g.disabled = !ui.fc.flip;
  }
}

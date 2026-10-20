import { $, L, esc, shuf } from "../lib/util";
import { S, save, today } from "../state";
import { buzz, snd } from "../lib/audio";
import { I, mascot } from "../lib/icons";
import { confetti } from "../lib/confetti";
import { IMGS, MODES, canShuffleOpts, isMulti, modeList, stat, weekQs } from "../quiz";
import { render } from "../app";
import { ui } from "../ui";
import { sweep } from "../lib/wave";

export function startSes(list, mode, title, key) {
  if (!list.length) return toast("Nothing in this mode yet.");
  ui.ses = { list: list.map((q) => ({ q, order: q.opts.map((_, i) => i) })), i: 0, mode, title, key, queue: [], ok: 0, first: 0, total: list.length, planned: list.length, t0: Date.now(), xp: 0, combo: 0, phase: "main", sel: /* @__PURE__ */ new Set(), foc: 0, state: "ask", log: [], skipped: 0 };
  ui.ses.list.forEach((it) => {
    if (S.set.optShuf && canShuffleOpts(it.q)) it.order = shuf(it.order);
  });
  ui.ses.cur = ui.ses.list[0];
  sweep(ui.el, renderSes);
}

export const head = (q) => isMulti(q) ? "Select all correct answers" : "Select the correct answer";

export function sizeFs(q) {
  const n = q.q.length + q.opts.reduce((a, b) => a + b.length, 0);
  return n < 220 ? 26 : n < 380 ? 22 : n < 600 ? 19 : n < 900 ? 16.5 : 14.5;
}

export function renderSes() {
  const s = ui.ses, q = s.cur.q;
  const wide = !!q.img || q.q.length > 230;
  const shortOpts = q.opts.every((o) => o.length < 46) && !wide;
  ui.el.innerHTML = `<div class="ex"><div class="ex-top"><button class="x" data-exit="1" aria-label="Close">${I.x}</button><div class="bar" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round((s.mode === "quiz" ? s.i / s.list.length : s.ok / s.planned) * 100)}"><i style="width:${(s.mode === "quiz" ? s.i / s.list.length : s.ok / s.planned) * 100}%"></i></div>
<span class="chip" title="In a row">${s.combo >= 2 ? I.flame + '<span style="color:var(--orange)">' + s.combo + "</span>" : ""}</span></div>
<div class="ex-body question-layout" style="--fs:${(sizeFs(q) * (innerWidth <= 360 ? 0.8 : innerWidth <= 430 ? 0.86 : innerWidth <= 700 ? 0.92 : 1)).toFixed(1)}px"><div class="stage ${wide ? "wide" : ""} ${q.q.length > 420 ? "longq" : ""}">
${s.phase === "fix" ? '<div class="banner2">' + I.heart.replace("<svg", '<svg width="20" height="20"') + "Fix your mistakes</div>" : `<span class="tag">${esc(s.title)} \xB7 ${s.mode === "quiz" ? "quiz" : "learn"} \xB7 Q${s.i + 1} of ${s.total}</span>`}
<h1 class="head">${head(q)}</h1>
<div class="cols ${wide ? "w" : ""}"><div class="question-pane"><div class="question-hint" hidden>Scroll question to read more ↓</div><div class="qrow"><div class="mas">${mascot(S.set.av, s.state === "bad" ? "sad" : "happy")}</div><div class="bubble">${esc(q.q).replace(/\n/g, "<br>")}${q.img ? `<a href="${IMGS[q.img]}" target="_blank" rel="noopener" aria-label="Open full-size diagram"><img class="qimg" src="${IMGS[q.img]}" alt="Diagram for the question"></a><a class="diagram-link" href="${IMGS[q.img]}" target="_blank" rel="noopener">Open full-size diagram ↗</a>` : ""}</div></div></div>
<div class="opts ${shortOpts && q.opts.length > 3 ? "two" : ""}" id="opts">${optsHtml()}</div></div></div></div>
${footHtml()}</div>`;
  requestAnimationFrame(() => {
    const bubble = $(".bubble", ui.el), hint = $(".question-hint", ui.el);
    if (bubble && hint && innerWidth <= 640) hint.hidden = bubble.scrollHeight <= bubble.clientHeight + 2;
  });
}

export function optsHtml() {
  const s = ui.ses, it = s.cur, q = it.q, rev = s.state !== "ask";
  return it.order.map((oi, pos) => {
    const isAns = q.ans.includes(oi), sel = s.sel.has(oi);
    let cls = "";
    if (rev) {
      cls = "lock";
      if (isAns && sel) cls += " ok";
      else if (isAns) cls += " ok miss";
      else if (sel) cls += " no";
    } else {
      if (sel) cls += " sel";
      if (s.foc === pos && s.kbd) cls += " foc";
    }
    let why = "";
    if (rev && s.mode === "learn") {
      if (!isAns && q.wrong[oi]) why = `<span class="why">${esc(q.wrong[oi])}</span>`;
      else if (isAns && !sel) why = '<span class="why">This one was correct.</span>';
    }
    return `<button class="opt ${cls}" aria-pressed="${sel}" aria-disabled="${rev}" data-opt="${oi}"><span class="k">${L[pos]}</span><span class="t">${esc(q.opts[oi])}${why}</span></button>`;
  }).join("");
}

export function footHtml() {
  const s = ui.ses, q = s.cur.q;
  if (s.state === "ask") {
    const can = s.sel.size > 0, instant = s.mode === "learn" && !isMulti(q), quiz = s.mode === "quiz";
    return `<div class="ex-foot${instant ? " ghost" : ""}"><div class="in"><button class="btn skip" data-skip="1">Skip</button><span class="kb" style="flex:1;text-align:center">${instant ? "Tap an option for the instant answer" : quiz ? "Enter for the next one" : "Enter to check"}</span><button class="btn ${can ? "" : "dis"}" data-check="1" style="${instant ? "visibility:hidden" : ""}">${quiz ? "Next" : "Check"}</button></div></div>`;
  }
  const good = s.state === "good";
  const ansTxt = q.ans.map((i) => esc(q.opts[i])).join(" &nbsp;\xB7&nbsp; ");
  const learn = s.mode === "learn";
  const mine = !learn && !good ? [...s.sel].filter((i) => !q.ans.includes(i)).map((i) => q.wrong[i] ? `<div style="margin-top:4px"><b>Your pick:</b> ${esc(q.wrong[i])}</div>` : "").join("") : "";
  const pname = esc((S.set.name || "").trim());
  const hype = pname && s.combo >= 3 ? [pname + ", you're on fire!", "Unstoppable, " + pname + "!", pname + ", what a run!"][(s.i + s.combo) % 3] : "";
  const praise = hype || (pname && (s.i + s.combo) % 2 === 0 ? ["Keep it up, " + pname + "!", "Way to go, " + pname + "!", "Nice work, " + pname + "!"][(s.i + s.combo) % 3] : "") || ["Nicely done!", "Excellent!", "You got it!", "Great job!", "Sharp!"][(s.i + s.combo) % 5];
  const ansLine = good ? "" : `<b>${ansTxt}</b>`;
  const whyLine = good || !learn ? `<div>${esc(q.why)}</div>` : "";
  return `<div class="ex-foot ${good ? "ok" : "no"}"><div class="in"><div class="fb"><div class="ico">${good ? I.checkG : I.cross}</div><div style="min-width:0"><h3>${good ? praise : "Correct solution:"}</h3>
<div class="fx">${ansLine}${whyLine}${mine}</div></div></div><button class="btn" data-next="1">Continue</button></div></div>`;
}

export function toast(m) {
  const t = document.createElement("div");
  t.style.cssText = "position:absolute;left:50%;bottom:90px;transform:translateX(-50%);background:#3c3c3c;color:#fff;padding:12px 20px;border-radius:14px;z-index:200;font-family:'Titan One';letter-spacing:.5px";
  t.textContent = m;
  ui.el.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

export function refresh() {
  $("#opts", ui.el).innerHTML = optsHtml();
  $(".ex-foot", ui.el).outerHTML = footHtml();
}

export function pickOpt(oi) {
  const s = ui.ses;
  if (s.state !== "ask") return;
  const q = s.cur.q;
  snd.tap();
  buzz(8);
  if (isMulti(q)) {
    s.sel.has(oi) ? s.sel.delete(oi) : s.sel.add(oi);
    refresh();
  } else {
    s.sel = /* @__PURE__ */ new Set([oi]);
    if (s.mode === "learn") check();
    else refresh();
  }
}

export function check() {
  const s = ui.ses;
  if (s.state !== "ask" || !s.sel.size) return;
  const q = s.cur.q;
  const good = q.ans.length === s.sel.size && q.ans.every((i) => s.sel.has(i));
  const st = stat(q);
  st.s++;
  s.log.push({ q, good, first: s.phase === "main", pick: [...s.sel] });
  if (good) {
    st.r++;
    s.combo++;
    s.ok++;
    if (s.phase === "main") {
      s.first++;
      s.xp += 10;
    } else s.xp += 5;
    st.m = 0;
  } else {
    st.x++;
    if (s.phase === "main") st.m = 1;
    s.combo = 0;
    s.queue.push(q);
    s.planned++;
  }
  save();
  if (s.mode === "quiz") {
    snd.tap();
    buzz(8);
    return advance();
  }
  if (good) {
    snd.ok();
    buzz(20);
  } else {
    snd.no();
    buzz([40, 40, 80]);
  }
  s.state = good ? "good" : "bad";
  refresh();
  if (!good) {
    $("#opts", ui.el).classList.add("shake");
  }
  const ch = $(".chip", ui.el);
  if (ch) ch.innerHTML = s.combo >= 2 ? I.flame + '<span style="color:var(--orange)">' + s.combo + "</span>" : "";
  const bar = $(".bar i", ui.el);
  if (bar) bar.style.width = s.ok / s.planned * 100 + "%";
  const m = $(".mas", ui.el);
  if (m) m.innerHTML = mascot(S.set.av, good ? "cheer" : "sad");
  const b = $(".ex-foot .btn", ui.el);
  if (b) b.focus({ preventScroll: true });
}

export function advance() {
  const s = ui.ses;
  s.i++;
  s.sel = /* @__PURE__ */ new Set();
  s.foc = 0;
  s.state = "ask";
  if (s.i < s.list.length) {
    s.cur = s.list[s.i];
    return renderSes();
  }
  if (s.queue.length && s.mode !== "quiz") {
    const qs = s.queue;
    s.queue = [];
    s.phase = "fix";
    s.list = qs.map((q) => ({ q, order: (s.list.find((x) => x.q === q) || { order: q.opts.map((_, i) => i) }).order }));
    s.i = 0;
    s.cur = s.list[0];
    return sweep(ui.el, renderSes);
  }
  finish();
}

export function next() {
  if (ui.ses.state !== "ask") advance();
}

export function skip() {
  const s = ui.ses;
  if (s.state !== "ask") return;
  if (s.mode === "quiz") {
    s.log.push({ q: s.cur.q, good: false, first: true, skip: true });
    s.skipped++;
    return advance();
  }
  s.log.push({ q: s.cur.q, good: false, first: s.phase === "main", skip: true });
  s.queue.push(s.cur.q);
  s.planned++;
  s.skipped++;
  advance();
}

export function rv2row(l) {
  const q = l.q, picks = (l.pick || []).slice().sort((a, b) => a - b);
  const ansTxt = q.ans.slice().sort((a, b) => a - b).map((a) => L[a] + ") " + q.opts[a]).join("; ");
  const pickTxt = picks.length ? picks.map((a) => L[a] + ") " + q.opts[a]).join("; ") : "No answer";
  const st = l.good ? "Right" : l.skip ? "Skipped" : "Missed";
  return `<div class="rv2 ${l.good ? "ok" : "no"}"><button data-rvx="1" aria-expanded="false"><span class="nn">W${q.w} Q${q.n}</span><span class="pill2">${st}</span><span class="chev">\u203A</span></button><div class="rv2b" hidden>${q.img ? `<img class="qimg" src="${IMGS[q.img]}" alt="Diagram">` : ""}<div class="rq">${esc(q.q)}</div>${l.good ? `<div class="ra good"><b>Correct:</b> ${esc(ansTxt)}</div>` : `${l.skip ? "" : `<div class="ra bad"><b>You picked:</b> ${esc(pickTxt)}</div>`}<div class="ra good"><b>Correct:</b> ${esc(ansTxt)}</div>`}<div class="rw"><b>Why:</b> ${esc(q.why)}</div></div></div>`;
}

export function finish() {
  const s = ui.ses;
  if (s.finished) return;
  s.finished = true;
  snd.done();
  buzz([30, 40, 30, 40, 80]);
  const acc = Math.round(s.first / s.total * 100), secs = Math.round((Date.now() - s.t0) / 1e3);
  const bonus = acc === 100 ? 5 : 0;
  s.xp += bonus;
  S.xp += s.xp;
  if (!S.days.includes(today())) S.days.push(today());
  if (s.key && s.key.startsWith("week:")) {
    const k = "w" + s.key.split(":")[1];
    S.best[k] = Math.max(S.best[k] || 0, acc);
  }
  save();
  const quiz = s.mode === "quiz";
  const missedN = s.log.filter((l) => l.first && !l.good).length;
  const cards = `<div class="sbox"><div class="sb" style="border-color:var(--yellow)"><div style="background:var(--yellow)">Total XP</div><div style="color:var(--yellow-d)">${I.bolt.replace("<svg", '<svg width="26" height="26"')}${s.xp}</div></div>
<div class="sb" style="border-color:var(--blue)"><div style="background:var(--blue)">Time</div><div style="color:var(--blue)">${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</div></div>
<div class="sb" style="border-color:var(--green)"><div style="background:var(--green)">${quiz ? "Score" : "First try"}</div><div style="color:var(--green)">${acc}%</div></div></div>`;
  const line = quiz ? `${S.set.name ? esc(S.set.name) + ", you" : "You"} got ${s.first} of ${s.total} right${bonus ? " · +5 perfect bonus" : ""}${s.skipped ? " · " + s.skipped + " skipped" : ""}` : `${s.first} of ${s.total} right on the first try${bonus ? " · +5 perfect bonus" : ""}${s.skipped ? " · " + s.skipped + " skipped" : ""}`;
  const acts = `<div class="acts">${missedN ? `<button class="btn white g" data-retry="1">Retry missed (${missedN})</button>` : ""}${quiz ? "" : '<button class="btn white g" data-review="1">Review answers</button>'}<button class="btn" data-home="1">Continue</button></div>`;
  const rows = quiz ? `<div class="donerv">${s.log.filter((l) => l.first).map((l) => rv2row(l)).join("")}</div>` : "";
  ui.el.innerHTML = `<div class="done${quiz ? " quizdone" : ""}"><div class="mas">${mascot(S.set.av, "cheer")}</div><h1>${acc === 100 ? (S.set.name ? `Perfect run, ${esc(S.set.name)}!` : "Perfect run!") : quiz ? "Quiz complete!" : "Lesson complete!"}</h1>
${cards}
<div style="font-size:16px;color:var(--sub)">${line}</div>
${acts}
${rows}</div>`;
  confetti(ui.el);
}

export function retryMissed() {
  const missed = ui.ses.log.filter((l) => l.first && !l.good).map((l) => l.q);
  if (!missed.length) return;
  startSes(missed, "learn", ui.ses.title + " · retry", "retry:" + ui.ses.key);
}

export function reviewAnswers() {
  const firsts = ui.ses.log.filter((l) => l.first);
  ui.el.innerHTML = `<div class="ex"><div class="ex-top"><button class="x" aria-label="Close review" data-home="1">${I.x}</button><h2 class="ti" style="margin:0;font-size:24px;flex:1">Your answers</h2></div><div class="ex-body" style="justify-content:flex-start;--fs:16px"><div class="stage">${firsts.map((l) => rv2row(l)).join("")}</div></div></div>`;
}

export function exit() {
  const m = document.createElement("div");
  m.className = "modal";
  m.setAttribute("role", "dialog");
  m.setAttribute("aria-modal", "true");
  m.setAttribute("aria-label", "Leave this lesson?");
  m.innerHTML = `<div class="box"><div style="width:110px;margin:0 auto">${mascot(S.set.av, "sad")}</div><h2>Leave this lesson?</h2><div style="color:var(--sub)">Your answers so far are saved.</div><button class="btn wide" data-cancel="1">Keep going</button><button class="btn white wide" style="color:var(--red)" data-leave="1">End session</button></div>`;
  ui.el.appendChild(m);
  $("[data-cancel]", m)?.focus();
}

export function goHome() {
  ui.ses = null;
  ui.fc = null;
  sweep(ui.el, render);
}

export function startFrom(k) {
  const [a, b, c] = k.split(":");
  if (a === "week") return startSes(weekQs(+b).slice(), c, "Week " + b, "week:" + b);
  const nm = MODES.find((m) => m[0] === a);
  startSes(modeList(a), a === "boss" ? "quiz" : b || ui.hubMode, nm ? nm[1] : a, a);
}

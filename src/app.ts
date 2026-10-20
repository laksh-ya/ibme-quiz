import { pgLessons, renderTeaching, openLesson, closeTeaching, teachingBack, teachingNext, teachingPick, teachingCheck } from "./screens/teaching";
import { $, L } from "./lib/util";
import { S, TSMUL, resetProgress, save } from "./state";
import { buzz, snd } from "./lib/audio";
import { setData } from "./quiz";
import { railHtml, shell } from "./screens/shell";
import { pgPdfs } from "./screens/pdfs";
import { pgLearn } from "./screens/learn";
import { pgCards } from "./screens/cards";
import { pgReview } from "./screens/review";
import { pgPractice } from "./screens/practice";
import { renderCards, renderCardsFlip, startCards } from "./screens/cards";
import { pgMe } from "./screens/profile";
import { renderGate } from "./screens/gate";
import { check, exit, goHome, next, pickOpt, refresh, renderSes, retryMissed, reviewAnswers, skip, startFrom } from "./screens/session";
import { rvOpen, rvf, ui } from "./ui";
import { sweep } from "./lib/wave";

let renderedPage = "";
export function render() {
  ui.el.classList.toggle("dark", S.set.theme !== "light");
  if (ui.gate) return renderGate();
  if (ui.ses) return renderSes();
  if (ui.fc) return renderCards();
  if (ui.teach) return renderTeaching();
  const pg = { learn: pgLearn, practice: pgPractice, pdfs: pgPdfs, me: pgMe, review: pgReview, cards: pgCards, lessons: pgLessons }[ui.page]();
  const keep = renderedPage === ui.page && $("#main", ui.el) ? $("#main", ui.el).scrollTop : 0;
  renderedPage = ui.page;
  ui.el.innerHTML = shell(pg, railHtml());
  if ($("#main", ui.el)) $("#main", ui.el).scrollTop = keep;
  const st = $(".start", ui.el);
  if (st) { const sr = st.getBoundingClientRect(); if (sr.bottom > innerHeight - 96 || sr.top < 0) st.scrollIntoView({ block: "center" }); }
}

export const applyTs = () => ui.el.style.setProperty("--ts", TSMUL[S.set.textSize] || 0.84);

export function mount(root, data, images) {
  setData(data, images);
  root.innerHTML = "";
  const el = document.createElement("div");
  el.className = "duo";
  root.appendChild(el);
  ui.el = el;
  ui.gate = !S.set.name;
  applyTs();
  ui.el.addEventListener("click", (e) => {
    const t = e.target.closest("button,[data-flip]");
    if (!t) {
      if (e.target.closest(".pop2")) return;
      if (ui.popW) {
        ui.popW = null;
        render();
      }
      return;
    }
    const d = t.dataset;
    if (d.study) { ui.studyWeek=+d.study;ui.page="lessons";ui.popW=null;return render(); }
    if (d.lesson) return openLesson(d.lesson);
    if (d.teachclose) return closeTeaching();
    if (d.teachback) return teachingBack();
    if (d.teachnext) return teachingNext();
    if (d.teachpick!=null) return teachingPick(+d.teachpick);
    if (d.teachcheck) return teachingCheck();

    if (d.rvx) {
      const b = t.parentElement.querySelector(".rv2b");
      b.hidden = !b.hidden;
      t.classList.toggle("open", !b.hidden);
      t.setAttribute("aria-expanded", String(!b.hidden));
      return;
    }
    if (d.gname) {
      const v = ((document.getElementById("gname") as HTMLInputElement | null)?.value) || "";
      S.set.name = v.trim().slice(0, 14) || "Learner";
      save();
      ui.gate = false;
      snd.ok();
      return render();
    }
    if (d.go) {
      snd.tap();
      buzz(8);
      if (ui.page === d.go && !ui.ses && !ui.fc) return;
      ui.page = d.go;
      ui.popW = null;
      return sweep(ui.el, render);
    }
    if (d.node) {
      snd.tap();
      buzz(10);
      ui.popW = ui.popW == d.node ? null : +d.node;
      render();
      const p = $(".pop2", ui.el);
      if (p) p.scrollIntoView({ block: "nearest", behavior: "smooth" });
      return;
    }
    if (d.start) {
      buzz(12);
      return startFrom(d.start);
    }
    if (d.hub) {
      ui.hubMode = d.hub;
      snd.tap();
      return render();
    }
    if (d.opt != null) return pickOpt(+d.opt);
    if (d.check != null) return check();
    if (d.next != null) {
      snd.tap();
      return next();
    }
    if (d.skip != null) return skip();
    if (d.exit != null) return exit();
    if (d.cancel != null) return $(".modal", ui.el).remove();
    if (d.leave != null) return goHome();
    if (d.home != null) return goHome();
    if (d.review != null) return reviewAnswers();
    if (d.retry != null) return retryMissed();
    if (d.more != null) {
      ui.hubMore = true;
      snd.tap();
      return render();
    }
    if (d.rv) {
      rvOpen.has(d.rv) ? rvOpen.delete(d.rv) : rvOpen.add(d.rv);
      snd.tap();
      return render();
    }
    if (d.rvw != null) {
      rvf.w = +d.rvw;
      return render();
    }
    if (d.rvt) {
      rvf.t = rvf.t === d.rvt ? "" : d.rvt;
      return render();
    }
    if (d.cards) return startCards(d.cards);
    if (d.cx != null) return goHome();
    if (d.flip != null) {
      ui.fc.flip = !ui.fc.flip;
      snd.tap();
      return renderCardsFlip();
    }
    if (d.again != null) {
      if (!ui.fc.flip) return;
      ui.fc.l.push(ui.fc.l[ui.fc.i]);
      ui.fc.i++;
      ui.fc.flip = false;
      snd.no();
      return renderCards();
    }
    if (d.got != null) {
      if (!ui.fc.flip) return;
      ui.fc.i++;
      ui.fc.flip = false;
      snd.ok();
      return renderCards();
    }
    if (d.av != null) {
      const gateName = ui.gate ? $("#gname", ui.el)?.value : null;
      S.set.av = +d.av;
      if (gateName != null) S.set.name = gateName;
      save();
      snd.tap();
      render();
      if (gateName != null) $("#gname", ui.el).value = gateName;
      return;
    }
    if (d.tg) {
      if (d.tg === "theme") S.set.theme = S.set.theme === "light" ? "dark" : "light";
      else S.set[d.tg] = !S.set[d.tg];
      save();
      if (d.tg === "sound" && S.set.sound) snd.tap();
      if (d.tg === "haptic") { if (S.set.haptic) buzz(20); else navigator.vibrate?.(0); }
      return render();
    }
    if (d.ts) {
      S.set.textSize = d.ts;
      save();
      snd.tap();
      applyTs();
      return render();
    }
    if (d.reset != null) {
      if (confirm("Reset all progress on this device?")) {
        resetProgress();
        save();
        render();
      }
    }
  });

  ui.el.addEventListener("input", (e) => {
    if (e.target.id === "rvq") {
      rvf.q = e.target.value;
      const pos = e.target.selectionStart;
      render();
      const n = $("#rvq", ui.el);
      n.focus();
      n.setSelectionRange(pos, pos);
    }
    if (e.target.id === "nm") {
      S.set.name = e.target.value;
      save();
    }
  });

  const onKey = (e) => {
    if (!ui.el.isConnected) return document.removeEventListener("keydown", onKey);
    if (e.target?.id === "gname" && e.key === "Enter") { e.preventDefault(); $("[data-gname]", ui.el)?.click(); return; }
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === "Escape" && ui.popW && !ui.ses) { ui.popW = null; render(); return; }
    const k = e.key;
    if ($(".modal", ui.el)) {
      if (k === "Escape") $(".modal", ui.el).remove();
      if (k === "Tab") {
        const buttons = [...$(".modal", ui.el).querySelectorAll("button")] as HTMLButtonElement[];
        const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
        e.preventDefault(); buttons[(i + (e.shiftKey ? buttons.length - 1 : 1)) % buttons.length]?.focus();
      }
      return;
    }
    if (ui.teach) { if (k === "Escape") closeTeaching(); return; }
    if (ui.fc) {
      if ((k === "Enter" || k === " ") && e.target?.tagName === "BUTTON") return;
      if (k === " " || k === "Enter" || k === "ArrowUp" || k === "ArrowDown") {
        e.preventDefault();
        ui.fc.flip = !ui.fc.flip;
        renderCardsFlip();
      } else if (k === "ArrowRight" && ui.fc.flip) {
        ui.fc.i++;
        ui.fc.flip = false;
        snd.ok();
        renderCards();
      } else if (k === "ArrowLeft" && ui.fc.flip) {
        ui.fc.l.push(ui.fc.l[ui.fc.i]);
        ui.fc.i++;
        ui.fc.flip = false;
        snd.no();
        renderCards();
      } else if (k === "Escape") goHome();
      return;
    }
    if (!ui.ses || !ui.ses.cur) return;
    if (k === "Escape") return exit();
    if (!$(".ex", ui.el)) return;
    const it = ui.ses.cur;
    if (ui.ses.state === "ask") {
      const n = it.order.length;
      let p = -1;
      if (/^[1-6]$/.test(k)) p = +k - 1;
      else if (/^[a-fA-F]$/.test(k)) p = L.indexOf(k.toUpperCase());
      if (p >= 0 && p < n) {
        e.preventDefault();
        ui.ses.foc = p;
        ui.ses.kbd = true;
        return pickOpt(it.order[p]);
      }
      if (k === "ArrowDown" || k === "ArrowRight") {
        e.preventDefault();
        ui.ses.kbd = true;
        ui.ses.foc = (ui.ses.foc + 1) % n;
        return refresh();
      }
      if (k === "ArrowUp" || k === "ArrowLeft") {
        e.preventDefault();
        ui.ses.kbd = true;
        ui.ses.foc = (ui.ses.foc - 1 + n) % n;
        return refresh();
      }
      if (k === " ") {
        e.preventDefault();
        ui.ses.kbd = true;
        return pickOpt(it.order[ui.ses.foc]);
      }
      if (k === "Enter") {
        e.preventDefault();
        return check();
      }
    } else if (k === "Enter" || k === " ") {
      e.preventDefault();
      snd.tap();
      next();
    }
  };

  document.addEventListener("keydown", onKey);
  render();
  return () => document.removeEventListener("keydown", onKey);
}

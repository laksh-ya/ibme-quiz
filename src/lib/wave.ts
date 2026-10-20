import { snd } from "./audio";
import { finish } from "../screens/session";

// Page transition driven by the real glimm library (npm: glimm, MIT).
//
// One visible layer: the glimm canvas band. The page swap is coordinated with the
// browser View Transitions API, the way glimm's own provider does it: the outgoing
// view stays as a snapshot ahead of the band, the incoming (already swapped) view is
// revealed behind it with a mask whose edge follows the shader's live progress. There
// is no cover frame, no curtain and no blank in-between page.
//
// Which path runs:
//   1. View Transitions + WebGL: glimm band + masked reveal (the normal path).
//   2. No View Transitions, WebGL ok: glimm band alone, page swaps at the band midpoint.
//   3. No WebGL, View Transitions ok: masked reveal only (plain wipe, no band).
//   4. Reduced motion or neither: instant swap.
import { createShader, playSweep, accentChain } from "glimm";

let ctrl: any = null;
let busy = false;
export let lastPath = "none";

const SWEEP_MS = 620;
const OUTRO_MS = 220;
const MID = 0.56;
const edgeFor = (p: number) => (-0.2 + 1.4 * p) * 100;

function getCtrl() {
  if (ctrl) return ctrl;
  try {
    ctrl = createShader({ palette: accentChain(["#A2E838", "#58CC02", "#1CB0F6"]) });
    if (ctrl) {
      ctrl.canvas.className = "glimm-band";
    }
  } catch (e) {
    ctrl = null;
  }
  return ctrl;
}

export function sweep(_root: HTMLElement, swap: () => void): Promise<void> {
  if (busy) {
    swap();
    return Promise.resolve();
  }
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startVT = (document as any).startViewTransition?.bind(document);
  const c = reduced ? null : getCtrl();
  if (reduced || (!startVT && !c)) {
    lastPath = "instant";
    swap();
    return Promise.resolve();
  }
  busy = true;
  try { snd.swoosh(); } catch (e) {}
  const root = document.documentElement;
  let swapped = false;
  const doSwap = () => { if (!swapped) { swapped = true; try { swap(); } catch (e) {} } };
  const cleanup = () => {
    root.style.removeProperty("--glimm-edge");
    root.classList.remove("glimm-vt");
    if (c) {
      c.canvas.remove();
      try { c.setAlpha(0); } catch (e) {}
    }
    busy = false;
  };

  // Path 2: glimm band alone.
  if (!startVT) {
    lastPath = "glimm-only";
    document.body.appendChild(c.canvas);
    return new Promise((res) => {
      const h = playSweep(c, { sweepMs: SWEEP_MS, outroMs: OUTRO_MS, midpoint: MID, onMidpoint: doSwap });
      h.done.then(() => { doSwap(); cleanup(); res(); });
    });
  }

  // Paths 1 and 3: View Transition with a masked reveal.
  lastPath = c ? "glimm+view-transition" : "wipe+view-transition";
  root.classList.add("glimm-vt");
  root.style.setProperty("--glimm-edge", "-10%");
  const vt = startVT(() => {
    doSwap();
    if (c) document.body.appendChild(c.canvas);
  });
  return new Promise<void>((res) => {
    let raf = 0;
    const finish = () => { cancelAnimationFrame(raf); cleanup(); res(); };
    vt.ready.then(() => {
      if (c) {
        const h = playSweep(c, { sweepMs: SWEEP_MS, outroMs: OUTRO_MS, midpoint: 1 });
        const tick = () => {
          root.style.setProperty("--glimm-edge", edgeFor(c.getProgress()) + "%");
          raf = requestAnimationFrame(tick);
        };
        tick();
        h.done.then(() => { root.style.setProperty("--glimm-edge", "120%"); vt.skipTransition?.(); });
      } else {
        const t0 = performance.now();
        const tick = () => {
          const p = Math.min(1, (performance.now() - t0) / SWEEP_MS);
          root.style.setProperty("--glimm-edge", edgeFor(p * p * (3 - 2 * p)) + "%");
          if (p < 1) raf = requestAnimationFrame(tick); else vt.skipTransition?.();
        };
        tick();
      }
    }, () => { doSwap(); finish(); });
    vt.finished.then(finish, finish);
    setTimeout(finish, SWEEP_MS + OUTRO_MS + 1500);
  });
}

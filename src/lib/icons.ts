import { $, shuf } from "./util";
import { check } from "../screens/session";

export var I = {
  home: '<svg viewBox="0 0 32 32"><path d="M16 3 3 14v13a2 2 0 0 0 2 2h7v-8h8v8h7a2 2 0 0 0 2-2V14z" fill="#1cb0f6"/><path d="M16 3 3 14h26z" fill="#84d8ff"/></svg>',
  target: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#ff4b4b"/><circle cx="16" cy="16" r="9" fill="#fff"/><circle cx="16" cy="16" r="5.5" fill="#ff4b4b"/><circle cx="16" cy="16" r="2" fill="#fff"/></svg>',
  heart: '<svg viewBox="0 0 32 32"><path d="M16 28S3 20 3 11a6.5 6.5 0 0 1 13-2 6.5 6.5 0 0 1 13 2c0 9-13 17-13 17z" fill="#ff4b4b"/><path d="M8 9a3 3 0 0 1 3-2" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".6"/></svg>',
  book: '<svg viewBox="0 0 32 32"><path d="M4 6a2 2 0 0 1 2-2h8c1.2 0 2 .6 2 2v22c0-1-.8-2-2-2H4z" fill="#ce82ff"/><path d="M28 6a2 2 0 0 0-2-2h-8c-1.2 0-2 .6-2 2v22c0-1 .8-2 2-2h10z" fill="#a568cc"/></svg>',
  cards: '<svg viewBox="0 0 32 32"><rect x="3" y="9" width="20" height="18" rx="4" fill="#ffc800"/><rect x="9" y="4" width="20" height="18" rx="4" fill="#ff9600"/></svg>',
  user: '<svg viewBox="0 0 32 32"><circle cx="16" cy="11" r="7" fill="#58cc02"/><path d="M3 29c0-7 6-11 13-11s13 4 13 11z" fill="#58a700"/></svg>',
  flame: '<svg viewBox="0 0 32 32"><path d="M16 2c1 6 9 9 9 18a9 9 0 0 1-18 0c0-4 2-6 3-8 1 2 2 3 3 3 0-5 2-8 3-13z" fill="#ff9600"/><path d="M16 17c1 3 4 4 4 8a4 4 0 0 1-8 0c0-3 3-4 4-8z" fill="#ffc800"/></svg>',
  bolt: '<svg viewBox="0 0 32 32"><path d="M19 2 6 18h8l-2 12 14-18h-9z" fill="#ffc800"/></svg>',
  heartW: '<svg viewBox="0 0 32 32"><path d="M16 28S3 20 3 11a6.5 6.5 0 0 1 13-2 6.5 6.5 0 0 1 13 2c0 9-13 17-13 17z" fill="#fff"/></svg>',
  star: '<svg viewBox="0 0 32 32"><path d="M16 2.5l4.2 8.6 9.4 1.3-6.8 6.6 1.6 9.4L16 23.9l-8.4 4.5 1.6-9.4L2.4 12.4l9.4-1.3z" fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 32 32"><path d="M6 17l7 7L27 8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  checkG: '<svg viewBox="0 0 32 32"><path d="M6 17l7 7L27 8" fill="none" stroke="#58cc02" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cross: '<svg viewBox="0 0 32 32"><path d="M8 8l16 16M24 8L8 24" fill="none" stroke="#ff4b4b" stroke-width="5" stroke-linecap="round"/></svg>',
  x: '<svg viewBox="0 0 32 32"><path d="M7 7l18 18M25 7L7 25" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/></svg>',
  shuf: '<svg viewBox="0 0 32 32"><path d="M3 9h5c8 0 8 14 16 14h4M3 23h5c3 0 5-2 6.5-4.5M17.5 12.5C19 10.5 21 9 24 9h4M24 4l5 5-5 5M24 18l5 5-5 5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  multi: '<svg viewBox="0 0 32 32"><rect x="4" y="4" width="10" height="10" rx="3" fill="#fff"/><rect x="18" y="4" width="10" height="10" rx="3" fill="#fff" opacity=".6"/><rect x="4" y="18" width="10" height="10" rx="3" fill="#fff" opacity=".6"/><rect x="18" y="18" width="10" height="10" rx="3" fill="#fff"/></svg>',
  one: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill="none" stroke="#fff" stroke-width="3.5"/><circle cx="16" cy="16" r="5" fill="#fff"/></svg>',
  all: '<svg viewBox="0 0 32 32"><path d="M4 8h24M4 16h24M4 24h24" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/></svg>',
  sun: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="6" fill="#fff"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M25 7l-3 3M10 22l-3 3" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>',
  new: '<svg viewBox="0 0 32 32"><path d="M16 3l3 8 8 1-6 6 2 9-7-4-7 4 2-9-6-6 8-1z" fill="#fff"/></svg>',
  boss: '<svg viewBox="0 0 32 32"><path d="M4 10l6 5 6-9 6 9 6-5-3 16H7z" fill="#fff"/></svg>',
  speed: '<svg viewBox="0 0 32 32"><circle cx="16" cy="18" r="11" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M16 18V10M12 3h8" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>'
};
export var AVS = [
  { b: "#58cc02", d: "#46a302", bl: "#89e219", acc: "" },
  { b: "#1cb0f6", d: "#1899d6", bl: "#84d8ff", acc: "cap" },
  { b: "#ce82ff", d: "#a568cc", bl: "#e6bcff", acc: "glass" },
  { b: "#ff9600", d: "#cc7900", bl: "#ffc86b", acc: "band" },
  { b: "#ff4b4b", d: "#ea2b2b", bl: "#ff9a9a", acc: "crown" },
  { b: "#2bd9c4", d: "#1fa897", bl: "#8cf0e3", acc: "" },
  { b: "#ff86d0", d: "#d462a8", bl: "#ffc0e8", acc: "bow" },
  { b: "#ffc800", d: "#e5b400", bl: "#ffe27a", acc: "glass" }
];
export function mascot(i = 0, mood = "happy") {
  const a = AVS[i % AVS.length];
  const brow = mood === "sad" ? '<path d="M30 40l12 5M70 40L58 45" stroke="#3c3c3c" stroke-width="3.5" stroke-linecap="round"/>' : "";
  const pup = mood === "sad" ? 53 : 50;
  const wing = mood === "cheer" ? `<path d="M14 62C2 52 4 38 8 30c8 6 12 16 12 26z" fill="${a.d}"/><path d="M86 62c12-10 10-24 6-32-8 6-12 16-12 26z" fill="${a.d}"/>` : `<path d="M14 64c-6-6-6-14-4-20 7 3 11 10 11 17z" fill="${a.d}"/><path d="M86 64c6-6 6-14 4-20-7 3-11 10-11 17z" fill="${a.d}"/>`;
  const acc = {
    cap: '<path d="M24 30C26 12 74 12 76 30z" fill="#1d1d1d"/><path d="M70 28h22c0 4-6 7-22 6z" fill="#1d1d1d"/>',
    glass: '<circle cx="38" cy="50" r="12" fill="none" stroke="#3c3c3c" stroke-width="3.5"/><circle cx="62" cy="50" r="12" fill="none" stroke="#3c3c3c" stroke-width="3.5"/>',
    band: '<path d="M20 34c20-10 40-10 60 0v8c-20-10-40-10-60 0z" fill="#ff4b4b"/>',
    crown: '<path d="M30 28l4-16 8 9 8-13 8 13 8-9 4 16z" fill="#ffc800" stroke="#e5b400" stroke-width="2"/>',
    bow: '<path d="M50 20l-14-8v16zM50 20l14-8v16z" fill="#ff4b4b"/><circle cx="50" cy="20" r="4" fill="#ea2b2b"/>',
    "": ""
  }[a.acc];
  const tear = mood === "sad" ? '<path d="M33 66c-3 5-3 8 0 8s3-3 0-8z" fill="#84d8ff"/>' : "";
  return `<svg viewBox="0 0 100 100" style="width:100%;height:100%;display:block">
<ellipse cx="50" cy="94" rx="26" ry="4" fill="#000" opacity=".08"/>
${wing}
<path d="M50 14C26 14 14 34 14 58c0 20 14 32 36 32s36-12 36-32C86 34 74 14 50 14z" fill="${a.b}"/>
<ellipse cx="50" cy="72" rx="22" ry="17" fill="${a.bl}"/>
<path d="M38 38c-9 0-13 6-13 12s5 11 13 11 12-5 12-11-4-12-12-12zM62 38c-8 0-12 6-12 12s4 11 12 11 13-5 13-11-4-12-13-12z" fill="#fff" stroke="${a.d}" stroke-width="2"/>
<circle cx="40" cy="${pup}" r="5.5" fill="#3c3c3c"/><circle cx="60" cy="${pup}" r="5.5" fill="#3c3c3c"/>
<circle cx="42" cy="${pup - 2}" r="2" fill="#fff"/><circle cx="62" cy="${pup - 2}" r="2" fill="#fff"/>
${brow}${tear}
<path d="M43 60q7-3 14 0l-7 9z" fill="#ff9600"/>
<path d="M38 90v5M46 90v5M54 90v5M62 90v5" stroke="#ff9600" stroke-width="4" stroke-linecap="round"/>
${acc}</svg>`;
}
export var avatar = (i, sz) => `<span class="av" style="width:${sz}px;height:${sz}px;background:${AVS[i % AVS.length].bl}">${mascot(i)}</span>`;

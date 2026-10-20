import { $ } from "../lib/util";
import { AVS, avatar, mascot } from "../lib/icons";
import { S } from "../state";
import { ui } from "../ui";

export function renderGate() {
  ui.el.innerHTML = `<div class="gate"><div class="gcard"><div style="width:130px;margin:0 auto 6px">${mascot(S.set.av, "cheer")}</div>
<h1 class="pg" style="text-align:center">Welcome!</h1><p class="sub" style="text-align:center">80 questions, 8 weeks, one exam. Pick your name and study buddy.</p>
<input class="search" aria-label="Your name" autocomplete="given-name" enterkeyhint="go" id="gname" maxlength="14" placeholder="Your name" style="width:100%;margin:8px 0 14px">
<div class="gate-avatars" role="group" aria-label="Choose your study buddy">${AVS.map((a, i) => `<button type="button" aria-label="Avatar ${i+1}" aria-pressed="${S.set.av === i}" class="${S.set.av === i ? "on" : ""}" data-av="${i}">${avatar(i, 52)}</button>`).join("")}</div>
<button class="btn wide" data-gname="1">Start learning</button></div></div>`;
}

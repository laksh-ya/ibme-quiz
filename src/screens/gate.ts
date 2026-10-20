import { $ } from "../lib/util";
import { mascot } from "../lib/icons";
import { ui } from "../ui";

export function renderGate() {
  ui.el.innerHTML = `<div class="gate"><div class="gcard"><div style="width:130px;margin:0 auto 6px">${mascot(0, "cheer")}</div>
<h1 class="pg" style="text-align:center">Welcome!</h1><p class="sub" style="text-align:center">80 questions, 8 weeks, one exam. What should we call you?</p>
<input class="search" id="gname" maxlength="14" placeholder="Your name" style="width:100%;margin:8px 0 14px">
<button class="btn wide" data-gname="1">Start learning</button></div></div>`;
}

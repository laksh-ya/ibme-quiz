import { BUILD } from "./build";

export function startUpdateCheck() {
{
  const chk = async () => {
    try {
      const r = await fetch("version.txt", { cache: "no-store" });
      const v = (await r.text()).trim();
      if (v && v !== BUILD && !document.querySelector(".upd")) {
        const t = document.createElement("button");
        t.className = "upd";
        t.textContent = "New version ready - tap to update";
        t.onclick = () => location.reload();
        document.body.appendChild(t);
      }
    } catch (e) {}
  };
  document.addEventListener("visibilitychange", () => { if (!document.hidden) chk(); });
  setInterval(chk, 120000);
}
}

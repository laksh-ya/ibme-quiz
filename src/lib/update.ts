import { BUILD } from "./build";

// Persist per-build acknowledgement, including across reloads and other tabs.
const SEEN = "ibme-update-seen";
export function startUpdateCheck() {
  let busy = false;
  let offered = "";
  const seen = (v: string) => { try { return localStorage.getItem(SEEN) === v; } catch { return false; } };
  const remember = (v: string) => { try { localStorage.setItem(SEEN, v); } catch {} };
  const close = () => {
    document.querySelector(".update-notice")?.remove();
    document.documentElement.style.removeProperty("--update-height");
  };
  const check = async () => {
    if (busy || document.hidden) return;
    busy = true;
    try {
      const response = await fetch(new URL("/version.txt", location.origin), { cache: "no-store" });
      if (!response.ok) return;
      const version = (await response.text()).trim();
      // Ignore redirects/HTML, older cached responses, and the running build.
      if (!/^\d{4}\.\d{2}\.\d{2}-\d{6}$/.test(version) || version <= BUILD || version === offered || seen(version)) return;
      if (document.querySelector(".update-notice")) return;
      offered = version;
      remember(version);
      const notice = document.createElement("aside");
      notice.className = "update-notice";
      notice.setAttribute("aria-label", "App update available");
      notice.innerHTML = `<div class="update-copy" role="status"><strong>Fresh version ready</strong><span>Your progress stays saved.</span></div><button class="update-action" type="button">Update</button><button class="update-dismiss" type="button" aria-label="Dismiss update notice">✕</button>`;
      document.body.appendChild(notice);
      const observer = new ResizeObserver(() => document.documentElement.style.setProperty("--update-height", `${notice.getBoundingClientRect().height}px`));
      observer.observe(notice);
      const dismiss = () => { observer.disconnect(); close(); };
      notice.querySelector(".update-dismiss")!.addEventListener("click", dismiss);
      notice.querySelector(".update-action")!.addEventListener("click", () => {
        dismiss();
        // A new URL avoids a cached HTML document without discarding app state.
        const url = new URL(location.href);
        url.searchParams.set("app-build", version);
        location.replace(url.href);
      });
    } catch { /* Offline checks stay silent. */ }
    finally { busy = false; }
  };
  document.addEventListener("visibilitychange", () => { if (!document.hidden) void check(); });
  window.addEventListener("storage", (event) => { if (event.key === SEEN && event.newValue === offered) close(); });
  setInterval(check, 120000);
  void check();
}

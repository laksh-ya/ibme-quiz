export function confetti(root) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas");
  c.className = "conf";
  c.width = root.clientWidth;
  c.height = root.clientHeight;
  root.appendChild(c);
  const x = c.getContext("2d");
  const cols = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b", "#ce82ff", "#ff9600"];
  const ps = Array.from({ length: 140 }, () => ({ x: c.width / 2, y: c.height * 0.45, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 15 - 3, s: 5 + Math.random() * 7, c: cols[Math.random() * 6 | 0], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4 }));
  let n = 0;
  (function f() {
    x.clearRect(0, 0, c.width, c.height);
    ps.forEach((p) => {
      p.vy += 0.35;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.r += p.vr;
      x.save();
      x.translate(p.x, p.y);
      x.rotate(p.r);
      x.fillStyle = p.c;
      x.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.6);
      x.restore();
    });
    if (++n < 170) requestAnimationFrame(f);
    else c.remove();
  })();
}

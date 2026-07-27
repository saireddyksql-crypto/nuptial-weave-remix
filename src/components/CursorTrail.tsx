import { useEffect, useRef } from "react";

/**
 * Premium golden sparkle trail — tiny star particles that twinkle, softly fade,
 * and gently scale. Disabled on touch/coarse pointers and respects
 * prefers-reduced-motion. pointer-events: none so it never blocks clicks.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type Star = {
      x: number; y: number;
      size: number;
      rot: number; rotSpeed: number;
      life: number; max: number;
      twinklePhase: number; twinkleSpeed: number;
      vy: number;
      hue: number;
    };
    const stars: Star[] = [];
    let lastX = 0, lastY = 0;
    let lastSpawn = 0;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      lastX = e.clientX;
      lastY = e.clientY;
      if (now - lastSpawn < 22 || dist < 3) return;
      lastSpawn = now;
      const count = Math.min(2, 1 + Math.floor(dist / 40));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          size: 2.6 + Math.random() * 3.2,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          life: 0,
          max: 900 + Math.random() * 700,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.006 + Math.random() * 0.006,
          vy: -0.02 - Math.random() * 0.04,
          hue: Math.random() < 0.5 ? 48 : 42, // gold / amber
        });
      }
      if (stars.length > 80) stars.splice(0, stars.length - 80);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const drawStar = (
      cx: number, cy: number, r: number, rot: number, alpha: number, hue: number,
    ) => {
      // 4-pointed sparkle: two orthogonal diamond spikes + soft glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 4);
      glow.addColorStop(0, `hsla(${hue}, 90%, 70%, ${alpha * 0.55})`);
      glow.addColorStop(0.4, `hsla(${hue}, 85%, 60%, ${alpha * 0.18})`);
      glow.addColorStop(1, `hsla(${hue}, 85%, 60%, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      const spike = (len: number, width: number, a: number) => {
        const grad = ctx.createLinearGradient(-len, 0, len, 0);
        grad.addColorStop(0, `hsla(${hue}, 95%, 65%, 0)`);
        grad.addColorStop(0.5, `hsla(50, 100%, 88%, ${a})`);
        grad.addColorStop(1, `hsla(${hue}, 95%, 65%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-len, 0);
        ctx.lineTo(0, -width);
        ctx.lineTo(len, 0);
        ctx.lineTo(0, width);
        ctx.closePath();
        ctx.fill();
      };
      spike(r * 2.6, r * 0.35, alpha);
      ctx.rotate(Math.PI / 2);
      spike(r * 2.6, r * 0.35, alpha);
      ctx.restore();

      // bright center
      ctx.fillStyle = `hsla(50, 100%, 92%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    };

    let raf = 0;
    let prev = performance.now();
    const tick = (t: number) => {
      const dt = t - prev;
      prev = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.life += dt;
        const k = s.life / s.max;
        if (k >= 1) { stars.splice(i, 1); continue; }
        s.rot += s.rotSpeed * dt;
        s.y += s.vy * dt;
        s.twinklePhase += s.twinkleSpeed * dt;
        const twinkle = 0.65 + 0.35 * Math.sin(s.twinklePhase);
        // ease-out fade + gentle scale (grow slightly then shrink)
        const fade = 1 - k * k;
        const scale = 0.6 + 0.6 * Math.sin(k * Math.PI); // 0.6 → 1.2 → 0.6
        const alpha = fade * twinkle * 0.85;
        drawStar(s.x, s.y, s.size * scale, s.rot, alpha, s.hue);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}

export default CursorTrail;

import { motion } from "motion/react";
import { useMemo } from "react";

/**
 * Animated sacred-geometry mandala rendered behind the Ganesha idol.
 * Pure SVG + transforms => lightweight, GPU friendly, seamlessly looped.
 */
export default function MandalaAura({ className = "" }: { className?: string }) {
  const petals = (count: number, r: number, len: number, w: number) =>
    Array.from({ length: count }, (_, i) => (i * 360) / count);

  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i * 360) / 12 + (i % 2 ? 14 : 0);
        const rad = (a * Math.PI) / 180;
        const dist = i % 2 ? 46 : 40;
        return {
          x: 50 + Math.cos(rad) * dist,
          y: 50 + Math.sin(rad) * dist,
          d: 2.4 + (i % 4) * 0.6,
          delay: (i % 6) * 0.5,
          s: i % 3 === 0 ? 1.1 : 0.7,
        };
      }),
    [],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 z-0 ${className}`} aria-hidden>
      {/* soft golden glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.82 0.13 78 / 0.55), oklch(0.72 0.16 60 / 0.22) 60%, transparent 78%)",
        }}
        animate={{ opacity: [0.55, 0.9, 0.55], scale: [0.97, 1.03, 0.97] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* outer ring — clockwise */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full text-gold"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <g stroke="currentColor" fill="none" strokeWidth="0.35" opacity="0.75">
          <circle cx="50" cy="50" r="46" />
          <circle cx="50" cy="50" r="43" strokeDasharray="0.6 2.4" strokeLinecap="round" />
          {petals(24, 40, 6, 3).map((a, i) => (
            <path
              key={i}
              d="M50 8 C53.4 13.5 53.4 18.5 50 24 C46.6 18.5 46.6 13.5 50 8 Z"
              transform={`rotate(${a} 50 50)`}
              fill="oklch(0.72 0.15 62 / 0.14)"
            />
          ))}
        </g>
      </motion.svg>

      {/* mid ring — counter-clockwise for depth */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        style={{ color: "oklch(0.68 0.17 55)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <g stroke="currentColor" fill="none" strokeWidth="0.4" opacity="0.7">
          <circle cx="50" cy="50" r="34" />
          {petals(16, 30, 8, 5).map((a, i) => (
            <path
              key={i}
              d="M50 16 C56 23 56 30 50 36 C44 30 44 23 50 16 Z"
              transform={`rotate(${a} 50 50)`}
              fill="oklch(0.82 0.12 78 / 0.12)"
            />
          ))}
          {petals(8, 0, 0, 0).map((a, i) => (
            <path key={`p${i}`} d="M50 20 L50 30" transform={`rotate(${a} 50 50)`} strokeWidth="0.25" />
          ))}
        </g>
      </motion.svg>

      {/* inner lotus — slow clockwise + gentle pulse */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full text-gold"
        animate={{ rotate: 360, scale: [1, 1.02, 1] }}
        transition={{
          rotate: { duration: 9, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <g stroke="currentColor" fill="none" strokeWidth="0.4" opacity="0.8">
          <circle cx="50" cy="50" r="24" strokeDasharray="1 2" strokeLinecap="round" />
          <circle cx="50" cy="50" r="19" />
          {petals(12, 0, 0, 0).map((a, i) => (
            <path
              key={i}
              d="M50 31 C54.5 36 54.5 42 50 46 C45.5 42 45.5 36 50 31 Z"
              transform={`rotate(${a} 50 50)`}
              fill="oklch(0.86 0.1 82 / 0.14)"
            />
          ))}
        </g>
      </motion.svg>

      {/* floating sparkles */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {sparkles.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.s * 0.5}
            fill="oklch(0.9 0.09 85)"
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 0.6] }}
            transition={{ duration: s.d, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}

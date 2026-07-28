import { motion } from "motion/react";
import { useMemo } from "react";

import floralPattern from "@/assets/floral-pattern.webp.asset.json";

/**
 * Soft tiled floral wallpaper + small slowly rotating floral medallions.
 * Kept very low contrast so page text stays readable.
 */
export default function FloralPatternBackground({
  tileOpacity = 0.16,
  tileSize = 320,
}: {
  tileOpacity?: number;
  tileSize?: number;
}) {
  const motifs = useMemo(
    () => [
      { top: "4%", left: "-4%", size: 150, dur: 90, rev: false, o: 0.2 },
      { top: "22%", left: "78%", size: 120, dur: 110, rev: true, o: 0.18 },
      { top: "48%", left: "8%", size: 110, dur: 130, rev: true, o: 0.16 },
      { top: "62%", left: "62%", size: 160, dur: 100, rev: false, o: 0.18 },
      { top: "84%", left: "22%", size: 130, dur: 120, rev: false, o: 0.16 },
      { top: "88%", left: "80%", size: 100, dur: 140, rev: true, o: 0.18 },
    ],
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${floralPattern.url}")`,
          backgroundRepeat: "repeat",
          backgroundSize: `${tileSize}px auto`,
          opacity: tileOpacity,
          mixBlendMode: "multiply",
        }}
      />
      {motifs.map((m, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: m.top,
            left: m.left,
            width: m.size,
            height: m.size,
            opacity: m.o,
            backgroundImage: `url("${floralPattern.url}")`,
            backgroundSize: "cover",
            borderRadius: "9999px",
            maskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)",
            mixBlendMode: "multiply",
          }}
          animate={{ rotate: m.rev ? [0, -360] : [0, 360] }}
          transition={{ duration: m.dur, ease: "linear", repeat: Infinity }}
        />
      ))}
    </div>
  );
}

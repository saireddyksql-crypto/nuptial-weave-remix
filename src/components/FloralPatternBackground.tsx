import floralPattern from "@/assets/floral-pattern.webp.asset.json";

/**
 * Soft tiled floral wallpaper. Kept very low contrast so page text stays readable.
 */
export default function FloralPatternBackground({
  tileOpacity = 0.16,
  tileSize = 320,
}: {
  tileOpacity?: number;
  tileSize?: number;
}) {
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
    </div>
  );
}

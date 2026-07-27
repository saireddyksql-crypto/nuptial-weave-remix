import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo } from "react";

import ganeshaImg from "@/assets/ganesha.png";
import mandalaImg from "@/assets/mandala.png";

export const Route = createFileRoute("/")({
  component: SplashPage,
});

const SPLASH_KEY = "mohanapu-splash-seen";

function Mandala({ className = "", opacity = 1 }: { className?: string; opacity?: number }) {
  return (
    <img
      src={mandalaImg}
      alt=""
      aria-hidden
      width={1024}
      height={1024}
      loading="lazy"
      className={`select-none ${className}`}
      style={{ opacity, filter: "drop-shadow(0 0 24px oklch(0.68 0.12 78 / 0.25))" }}
      draggable={false}
    />
  );
}

function MandalaBackground() {
  const items = useMemo(
    () => [
      { top: "-10%", left: "-15%", size: 620, dur: 140, rev: false, o: 0.08 },
      { top: "35%", left: "60%", size: 520, dur: 180, rev: true, o: 0.07 },
      { top: "72%", left: "-10%", size: 560, dur: 200, rev: false, o: 0.06 },
      { top: "8%", left: "68%", size: 380, dur: 160, rev: true, o: 0.07 },
    ],
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((m, i) => (
        <motion.div
          key={i}
          className="absolute text-gold"
          style={{ top: m.top, left: m.left, width: m.size, height: m.size }}
          animate={{
            rotate: m.rev ? [0, -360] : [0, 360],
            opacity: [m.o * 0.7, m.o, m.o * 0.75],
          }}
          transition={{
            rotate: { duration: m.dur, ease: "linear", repeat: Infinity },
            opacity: { duration: 10 + i, ease: "easeInOut", repeat: Infinity },
          }}
        >
          <Mandala className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  );
}

function TinyOrn({ className = "" }: { className?: string }) {
  return (
    <svg width="60" height="10" viewBox="0 0 60 10" className={`text-gold ${className}`} fill="none">
      <path d="M0 5 H22" stroke="currentColor" strokeWidth="0.5" />
      <path d="M38 5 H60" stroke="currentColor" strokeWidth="0.5" />
      <path d="M25 5 Q30 1 30 5 Q30 9 25 5 M35 5 Q30 1 30 5 Q30 9 35 5" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="30" cy="5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_KEY)) {
        navigate({ to: "/invitation", replace: true });
      }
    } catch {}
  }, [navigate]);

  const handleEnter = () => {
    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {}
    navigate({ to: "/invitation" });
  };

  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden bg-parchment paper-texture">
      <MandalaBackground />
      <div className="pointer-events-none absolute inset-4 md:inset-8 border border-gold/30" />
      <div className="pointer-events-none absolute inset-[22px] md:inset-[42px] border border-gold/15" />

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 -m-6 text-gold"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 90, ease: "linear", repeat: Infinity }}
            aria-hidden
          >
            <Mandala className="h-full w-full" opacity={0.35} />
          </motion.div>
          <div className="relative h-52 w-52 md:h-64 md:w-64">
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-60"
              style={{
                background:
                  "radial-gradient(closest-side, oklch(0.82 0.12 78 / 0.55), transparent 70%)",
              }}
            />
            <img
              src={ganeshaImg}
              alt="Lord Ganesha"
              width={1024}
              height={1024}
              className="relative h-full w-full object-contain select-none drop-shadow-[0_4px_10px_rgba(120,60,30,0.15)]"
              draggable={false}
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-6 font-script text-3xl md:text-4xl text-maroon-deep"
        >
          With the Blessings of Lord Ganesha
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-3"
        >
          <TinyOrn />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-display text-3xl md:text-5xl leading-tight text-foil"
        >
          Mohanapu&apos;s Wedding Invitation
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.9 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnter}
          className="group relative mt-8 inline-flex items-center gap-3 overflow-hidden border border-gold/70 bg-transparent px-8 py-4 font-sc text-xs md:text-sm uppercase tracking-[0.5em] text-maroon transition-colors hover:text-ivory cursor-pointer"
          aria-label="Tap to enter the wedding invitation"
        >
          <span className="absolute inset-0 -z-0 translate-y-full bg-maroon transition-transform duration-500 group-hover:translate-y-0" />
          <span className="relative z-10">Tap to Enter</span>
          <motion.span
            className="relative z-10 h-1.5 w-1.5 rounded-full bg-gold"
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.button>
      </div>
    </main>
  );
}

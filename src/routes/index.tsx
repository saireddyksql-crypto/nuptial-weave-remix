import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect } from "react";

import ganeshaImg from "@/assets/ganesha.png";
import FloralPatternBackground from "@/components/FloralPatternBackground";
import MandalaAura from "@/components/MandalaAura";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meghana Raj & Sai Pradyumna — Wedding Invitation" },
      {
        name: "description",
        content:
          "With the blessings of Lord Ganesha — join us as Meghana Raj weds Sai Pradyumna on 27th August 2026 at U.B.R. Convention, Kurnool.",
      },
      { property: "og:title", content: "Meghana Raj & Sai Pradyumna — Wedding Invitation" },
      {
        property: "og:description",
        content:
          "With the blessings of Lord Ganesha — join us as Meghana Raj weds Sai Pradyumna on 27th August 2026 at U.B.R. Convention, Kurnool.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SplashPage,
});


const SPLASH_KEY = "mohanapu-splash-seen";

function MandalaBackground() {
  return <FloralPatternBackground />;
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
          <div className="relative h-64 w-64 md:h-80 md:w-80">
            <MandalaAura />
            <img
              src={ganeshaImg}
              alt="Lord Ganesha"
              width={1024}
              height={1024}
              className="relative z-10 h-full w-full scale-[0.72] object-contain select-none drop-shadow-[0_4px_10px_rgba(120,60,30,0.15)]"
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

import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Calendar, Clock, MapPin, Heart, Phone, Mail, Instagram, Youtube, Share } from "lucide-react";

import cornerTop from "@/assets/corner-top.png";
import cornerBottom from "@/assets/corner-bottom.png";
import ganeshaImg from "@/assets/ganesha.png";
import mandalaImg from "@/assets/mandala.png";
import musicAsset from "@/assets/seetha-kalyanam.mp3.asset.json";


export const Route = createFileRoute("/invitation")({
  component: Invitation,
});

const WEDDING_DATE = new Date("2026-08-27T11:06:00+05:30");

/* ---------- ganesha & mandala art ---------- */

function Ganesha({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
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
        className="relative h-full w-full object-contain select-none"
        draggable={false}
      />
    </div>
  );
}

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
      // Corners — anchored so they hug edges on every viewport
      { top: "-14%", left: "-14%",  size: "clamp(220px, 42vw, 560px)", dur: 160, rev: false, o: 0.42, color: "text-gold" },
      { top: "-12%", right: "-14%", size: "clamp(200px, 38vw, 500px)", dur: 200, rev: true,  o: 0.38, color: "text-maroon" },
      { bottom: "-14%", left: "-12%", size: "clamp(220px, 40vw, 540px)", dur: 220, rev: true,  o: 0.34, color: "text-gold-dark" },
      { bottom: "-16%", right: "-14%", size: "clamp(240px, 44vw, 600px)", dur: 180, rev: false, o: 0.42, color: "text-gold" },
      // Mid accents — kept small & very faint, away from center reading column
      { top: "40%", left: "-10%",  size: "clamp(160px, 26vw, 360px)", dur: 240, rev: false, o: 0.26, color: "text-maroon" },
      { top: "55%", right: "-10%", size: "clamp(160px, 26vw, 360px)", dur: 260, rev: true,  o: 0.26, color: "text-gold" },
    ],
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[0] overflow-hidden" aria-hidden>
      {items.map((m, i) => (
        <motion.div
          key={i}
          className={`absolute ${m.color}`}
          style={{ top: m.top, left: (m as any).left, right: (m as any).right, bottom: (m as any).bottom, width: m.size, height: m.size }}
          animate={{
            rotate: m.rev ? [0, -360] : [0, 360],
            y: [0, -10, 0, 10, 0],
            opacity: [m.o * 0.7, m.o, m.o * 0.75],
          }}
          transition={{
            rotate: { duration: m.dur, ease: "linear", repeat: Infinity },
            y: { duration: 20 + i * 2, ease: "easeInOut", repeat: Infinity },
            opacity: { duration: 12 + i, ease: "easeInOut", repeat: Infinity },
          }}
        >
          <Mandala className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- month calendar ---------- */


function MonthCalendar() {
  const monthName = "August 2026";
  const daysInMonth = 31;
  const firstDayOfWeek = 6; // Aug 1 2026 = Saturday
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weekLabels = ["S", "M", "T", "W", "T", "F", "S"];
  const weddingDay = 27;

  return (
    <div className="relative mx-auto max-w-md rounded-sm border border-gold/40 bg-ivory/70 p-6 md:p-8 shadow-[var(--shadow-elegant)] backdrop-blur-sm">
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px gold-hairline" />
      <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px gold-hairline" />

      <div className="flex items-center justify-between gap-4">
        <TinyOrn />
        <p className="font-display text-2xl md:text-3xl text-maroon-deep whitespace-nowrap">{monthName}</p>
        <TinyOrn className="[transform:scaleX(-1)]" />
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1 md:gap-2">
        {weekLabels.map((w, i) => (
          <div
            key={i}
            className="text-center font-sc text-[10px] md:text-xs uppercase tracking-[0.3em] text-maroon-deep/80 pb-2"
          >
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          const isWedding = d === weddingDay;
          return (
            <div key={i} className="relative aspect-square">
              {d !== null && (
                <motion.div
                  whileHover={{ y: -2, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative flex h-full w-full items-center justify-center font-serif text-sm md:text-base ${
                    isWedding ? "text-maroon-deep font-semibold" : "text-ink/80"
                  }`}
                >
                  {isWedding && (
                    <>
                      {/* warm golden/amber pulse glow — complements the heart */}
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-full"
                        style={{
                          background:
                            "radial-gradient(closest-side, oklch(0.86 0.15 78 / 0.75), oklch(0.78 0.16 60 / 0.35) 55%, transparent 75%)",
                          filter: "blur(2px)",
                        }}
                        animate={{ opacity: [0.55, 1, 0.55], scale: [0.9, 1.08, 0.9] }}
                        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
                      />
                      <motion.svg
                        viewBox="0 0 60 56"
                        className="pointer-events-none absolute inset-0 h-full w-full text-gold-dark"
                        fill="none"
                        aria-hidden
                        animate={{ scale: [1, 1.09, 1] }}
                        transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
                      >
                        <motion.path
                          d="M30 50 C 10 38, 4 22, 14 12 C 22 5, 30 14, 30 20 C 30 14, 38 5, 46 12 C 56 22, 50 38, 30 50 Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="3 3.4"
                          animate={{ strokeDashoffset: [0, -12.8] }}
                          transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
                        />
                        <motion.path
                          d="M30 50 C 10 38, 4 22, 14 12 C 22 5, 30 14, 30 20 C 30 14, 38 5, 46 12 C 56 22, 50 38, 30 50 Z"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          pathLength={1}
                          strokeDasharray="0.28 0.72"
                          animate={{ strokeDashoffset: [0, -1] }}
                          transition={{ duration: 2.8, ease: "linear", repeat: Infinity }}
                        />
                      </motion.svg>

                    </>
                  )}
                  <span className="relative z-10">{d}</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 font-sc text-[10px] md:text-xs uppercase tracking-[0.4em] text-maroon-deep">
        <Heart className="h-3 w-3 text-gold-dark" fill="currentColor" />
        Wedding Day · Thursday
      </div>
    </div>
  );
}

/* ---------- primitives ---------- */

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-gold ${className}`}>
      <span className="h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-gold/90" />
      <svg width="46" height="18" viewBox="0 0 46 18" className="text-gold" fill="none">
        <path d="M1 9 Q10 1 23 9 Q36 17 45 9" stroke="currentColor" strokeWidth="0.7" />
        <path d="M4 9 Q13 3 23 9 Q33 15 42 9" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
        <circle cx="23" cy="9" r="1.6" fill="currentColor" />
        <circle cx="23" cy="9" r="3" stroke="currentColor" strokeWidth="0.4" fill="none" />
      </svg>
      <span className="h-px w-24 bg-gradient-to-l from-transparent via-gold/60 to-gold/90" />
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

function Monogram({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "text-6xl md:text-7xl" : size === "sm" ? "text-3xl" : "text-4xl md:text-5xl";
  return (
    <div className="relative inline-flex flex-col items-center">
      <div className={`font-display tracking-[0.25em] text-foil ${s}`}>
        M<span className="mx-1 text-gold/40 font-thin">|</span>S
      </div>
      <TinyOrn className="mt-2" />
    </div>
  );
}

/* ---------- countdown ---------- */

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Countdown() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const c = useCountdown(WEDDING_DATE);
  const items = [
    { label: "Days", value: mounted ? c.days : 0 },
    { label: "Hours", value: mounted ? c.hours : 0 },
    { label: "Minutes", value: mounted ? c.minutes : 0 },
    { label: "Seconds", value: mounted ? c.seconds : 0 },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-5">
      {items.map((it) => (
        <div key={it.label} className="group relative">
          <div className="relative overflow-hidden border border-gold/40 bg-ivory/70 px-2 py-5 md:px-6 md:py-7 text-center backdrop-blur-sm">
            <span className="pointer-events-none absolute inset-x-3 top-0 h-px gold-hairline" />
            <span className="pointer-events-none absolute inset-x-3 bottom-0 h-px gold-hairline" />
            <div className="font-display text-4xl md:text-6xl font-bold text-ink tabular-nums drop-shadow-sm">
              {String(it.value).padStart(2, "0")}
            </div>
            <div className="mt-2 font-sc text-[10px] md:text-xs uppercase tracking-[0.4em] text-maroon-deep">
              {it.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- petals ---------- */

function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: `${(i * 7 + 3) % 100}%`,
        delay: `${(i * 1.3) % 12}s`,
        dur: `${14 + (i % 5) * 3}s`,
        size: 8 + (i % 4) * 3,
        color: ["oklch(0.55 0.16 25)", "oklch(0.75 0.14 60)", "oklch(0.65 0.15 40)", "oklch(0.78 0.16 75)", "oklch(0.85 0.14 85)"][i % 5],
      })),
    [],
  );
  const flowers = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        left: `${(i * 11 + 6) % 100}%`,
        delay: `${(i * 2.1) % 16}s`,
        dur: `${18 + (i % 4) * 4}s`,
        size: 18 + (i % 3) * 8,
        color: ["oklch(0.72 0.14 30)", "oklch(0.82 0.11 65)", "oklch(0.58 0.14 20)", "oklch(0.78 0.13 45)", "oklch(0.75 0.16 75)", "oklch(0.85 0.14 85)"][i % 6],
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={`p-${i}`}
          className="petal absolute"
          style={{
            left: p.left,
            top: "-5vh",
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        >
          <svg width={p.size} height={p.size * 1.4} viewBox="0 0 10 14">
            <path d="M5 0 C8 3 9 8 5 14 C1 8 2 3 5 0Z" fill={p.color} opacity="0.55" />
          </svg>
        </span>
      ))}
      {flowers.map((f, i) => (
        <span
          key={`f-${i}`}
          className="petal absolute"
          style={{
            left: f.left,
            top: "-8vh",
            animationDelay: f.delay,
            animationDuration: f.dur,
          }}
        >
          <svg width={f.size} height={f.size} viewBox="0 0 24 24">
            <g opacity="0.7">
              {[0, 72, 144, 216, 288].map((rot) => (
                <ellipse
                  key={rot}
                  cx="12"
                  cy="7"
                  rx="3.2"
                  ry="5"
                  fill={f.color}
                  transform={`rotate(${rot} 12 12)`}
                />
              ))}
              <circle cx="12" cy="12" r="2" fill="oklch(0.85 0.14 85)" />
            </g>
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ---------- floral backdrop ---------- */

function FloralBackdrop() {
  const blooms = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        top: `${(i * 13 + 7) % 90}%`,
        left: `${(i * 19 + 5) % 92}%`,
        size: 90 + (i % 4) * 40,
        rot: (i * 37) % 360,
        delay: `${(i * 1.7) % 10}s`,
        driftDelay: `${(i * 2.3) % 12}s`,
        color: ["oklch(0.72 0.14 30)", "oklch(0.82 0.11 65)", "oklch(0.78 0.13 45)", "oklch(0.75 0.16 75)", "oklch(0.68 0.12 78)"][i % 5],
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[0] overflow-hidden" aria-hidden>
      {blooms.map((b, i) => (
        <span
          key={`b-${i}`}
          className="absolute drift"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.driftDelay,
          }}
        >
          <span
            className="block h-full w-full bloom"
            style={{ animationDelay: b.delay, transform: `rotate(${b.rot}deg)` }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <g fill={b.color} opacity="0.9">
                {[0, 60, 120, 180, 240, 300].map((r) => (
                  <ellipse key={r} cx="50" cy="30" rx="12" ry="22" transform={`rotate(${r} 50 50)`} />
                ))}
                <circle cx="50" cy="50" r="7" fill="oklch(0.85 0.14 85)" />
              </g>
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}

/* ---------- hero ---------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTop = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yBot = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-parchment paper-texture">
      {/* frame */}
      <div className="pointer-events-none absolute inset-4 md:inset-8 border border-gold/30" />
      <div className="pointer-events-none absolute inset-[22px] md:inset-[42px] border border-gold/15" />

      {/* corner decorations */}
      <motion.img
        style={{ y: yTop, scale }}
        src={cornerTop}
        alt=""
        className="pointer-events-none absolute -left-2 -top-2 md:-left-10 md:-top-10 w-[62%] max-w-[320px] md:w-[45%] md:max-w-[460px] select-none"
      />
      <motion.div
        style={{ y: yBot }}
        className="pointer-events-none absolute -right-2 -top-2 md:-right-10 md:-top-10 w-[62%] max-w-[320px] md:w-[45%] md:max-w-[460px] select-none"
      >
        <img src={cornerTop} alt="" className="w-full [transform:scaleX(-1)]" />
      </motion.div>

      {/* soft veil so content reads */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_center,var(--parchment)_50%,transparent_90%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 pt-[26vw] pb-24 md:px-8 md:pt-24 md:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <Ganesha className="mx-auto h-56 w-56 sm:h-64 sm:w-64 md:h-64 md:w-64 lg:h-72 lg:w-72 drop-shadow-[0_2px_8px_rgba(120,60,30,0.15)]" />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="mt-4 font-script text-2xl md:text-3xl text-maroon-deep"
          >
            With the Blessings of Lord Ganesha
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            className="mt-2 font-display text-2xl md:text-4xl text-foil"
          >
            Mohanapu&apos;s Wedding Invitation
          </motion.p>
          <TinyOrn className="mt-4" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ delay: 0.9, duration: 1.4 }}
          className="mt-10 font-sc text-xs md:text-sm uppercase tracking-[0.4em] text-maroon-deep text-readable"
        >
          Together with their families
        </motion.p>


        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-6"
        >
          <Monogram size="lg" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="mt-8 font-sc text-xs md:text-sm uppercase tracking-[0.4em] md:tracking-[0.5em] text-ink/90 text-readable"
        >
          request the honour of your presence
          <br />at the wedding of
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-display text-[3.5rem] md:text-[6rem] leading-[1] text-maroon-deep"
        >
          Meghana Raj
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="my-3 md:my-4"
        >
          <span className="font-script text-6xl md:text-7xl text-foil">&amp;</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 2.2, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[4.25rem] md:text-[7rem] leading-[1] text-maroon-deep"
        >
          Sai Pradyumna
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 1 }}
          className="mt-12 md:mt-14 flex flex-col items-center gap-5"
        >
          <Ornament />
          <div className="flex items-center gap-5 md:gap-10 font-sc uppercase text-maroon-deep">
            <div className="text-center">
              <div className="text-xs md:text-sm tracking-[0.25em] text-readable">Thursday</div>
              <div className="mt-1 font-display font-bold text-3xl md:text-5xl text-maroon-deep drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">27 · 08 · 26</div>
            </div>
            <span className="h-12 w-px bg-gold/50" />
            <div className="text-center">
              <div className="text-xs md:text-sm tracking-[0.25em] text-readable">Muhurtham</div>
              <div className="mt-1 font-display font-bold text-3xl md:text-5xl text-maroon-deep">11 : 06 AM</div>
            </div>
            <span className="hidden md:block h-12 w-px bg-gold/50" />
            <div className="hidden md:block text-center">
              <div className="text-sm tracking-[0.25em] text-readable">Venue</div>
              <div className="mt-1 font-display font-bold text-4xl text-maroon-deep">Kurnool</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.4, duration: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-sc text-[11px] md:text-xs uppercase tracking-[0.5em] text-maroon-deep text-readable">Unveil the story</span>
          <span className="h-8 w-px bg-gradient-to-b from-gold/70 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- reveal ---------- */

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- invocation ---------- */

function Invocation() {
  return (
    <section className="relative py-24 md:py-36 px-6 bg-parchment paper-texture">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="font-script text-5xl md:text-6xl text-maroon-deep drop-shadow-sm">Shubham astu</p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 font-serif font-medium italic text-lg md:text-xl leading-relaxed text-ink/90">
            &ldquo;Two souls, one journey — under the same sky, blessed by the same stars,
            bound by the sacred fire that our ancestors once lit.&rdquo;
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <Ornament className="mt-12" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- families ---------- */

function Families() {
  return (
    <section className="relative py-24 md:py-32 px-6 bg-ivory paper-texture">
      <div className="relative z-10 mx-auto max-w-4xl">
        <Reveal>
          <div className="text-center">
            <p className="font-sc text-xs md:text-sm uppercase tracking-[0.5em] text-maroon-deep text-readable">
              With the blessings of
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-maroon">Our Families</h2>
            <TinyOrn className="mx-auto mt-4" />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.1}>
            <div className="relative rounded-sm border border-gold/30 bg-parchment/60 p-10 text-center shadow-[var(--shadow-inner-gold)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ivory px-4 font-sc text-xs uppercase tracking-[0.4em] text-maroon-deep text-readable">
                Bride's Family
              </span>
              <h3 className="mt-4 font-display text-4xl md:text-5xl leading-[1] text-maroon-deep">
                Meghana Raj
              </h3>
              <p className="mt-3 font-sc text-[11px] md:text-xs uppercase tracking-[0.4em] text-maroon-deep text-readable">
                D/O OF
              </p>
              <div className="mx-auto my-5 h-px w-16 bg-gold/50" />
              <p className="mt-2 font-serif font-medium italic text-xl md:text-2xl text-ink">Smt. V. S. Rekha</p>
              <p className="my-3 font-script text-2xl text-foil">and</p>
              <p className="font-serif font-medium italic text-xl md:text-2xl text-ink">Late Sri Mohanapu Suresh</p>
              <TinyOrn className="mx-auto mt-6" />
              <p className="mt-4 font-sc text-xs uppercase tracking-[0.4em] text-maroon-deep text-readable">
                Parents of the Bride
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="relative rounded-sm border border-gold/30 bg-parchment/60 p-10 text-center shadow-[var(--shadow-inner-gold)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ivory px-4 font-sc text-xs uppercase tracking-[0.4em] text-maroon-deep text-readable">
                Groom's Family
              </span>
              <h3 className="mt-4 font-display text-4xl md:text-5xl leading-[1] text-maroon-deep">
                Sai Pradyumna
              </h3>
              <p className="mt-3 font-sc text-[11px] md:text-xs uppercase tracking-[0.4em] text-maroon-deep text-readable">
                S/O OF
              </p>
              <div className="mx-auto my-5 h-px w-16 bg-gold/50" />
              <p className="mt-2 font-serif font-medium italic text-xl md:text-2xl text-ink">Smt. S. Lalitha</p>
              <p className="my-3 font-script text-2xl text-foil">and</p>
              <p className="font-serif font-medium italic text-xl md:text-2xl text-ink">Sri M. Venkata Rama Raju</p>
              <TinyOrn className="mx-auto mt-6" />
              <p className="mt-4 font-sc text-xs uppercase tracking-[0.4em] text-maroon-deep text-readable">
                Parents of the Groom
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.4}>
          <p className="mt-16 text-center font-serif font-medium italic text-lg md:text-xl text-ink/90">
            cordially invite you and your family to grace the wedding ceremony of their beloved children
          </p>
        </Reveal>
      </div>
    </section>
  );
}


/* ---------- countdown section ---------- */

function CountdownSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 bg-ivory paper-texture">
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="font-sc text-xs md:text-sm uppercase tracking-[0.5em] text-maroon-deep text-readable">
            The auspicious moment
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-maroon">Muhurtham awaits</h2>
          <TinyOrn className="mx-auto mt-4" />
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-12">
            <Countdown />
          </div>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="mt-10 font-display font-bold text-lg md:text-2xl text-maroon-deep">
            Thursday, 27<sup>th</sup> August 2026 · 11:06 AM
          </p>
        </Reveal>
        <Reveal delay={0.5}>
          <div className="mt-14">
            <MonthCalendar />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- events ---------- */

const EVENTS = [
  {
    title: "Sumuhurtham (Muhurtham)",
    date: "Thursday, 27th August 2026",
    time: "11:06 am",
    place: "U.B.R. Convention · Main Hall",
    note: "The sacred vows, followed by a traditional lunch.",
    highlight: true,
  },
];

function Events() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36 px-6 bg-parchment paper-texture">
      <motion.img
        src={cornerBottom}
        alt=""
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -left-6 md:-left-10 bottom-0 w-[55%] max-w-[240px] sm:max-w-[300px] md:w-[38%] md:max-w-[360px] lg:max-w-[420px] opacity-40 md:opacity-100 float-slow z-0"
      />
      <div className="relative z-10 mx-auto max-w-3xl md:pl-44 lg:pl-56">
        <Reveal>
          <div className="text-center">
            <p className="font-sc text-xs md:text-sm uppercase tracking-[0.5em] text-maroon-deep text-readable">Auspicious Hour</p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl text-maroon">Sumuhurtham</h2>
            <TinyOrn className="mx-auto mt-4" />
          </div>
        </Reveal>

        <div className="relative mt-20">
          <div className="space-y-14">
            {EVENTS.map((ev, i) => {
              return (
                <Reveal key={ev.title} delay={i * 0.08}>
                  <div className="flex flex-col items-center">
                    {/* node */}
                    <span className="mb-6 flex h-4 w-4 items-center justify-center">
                      <span className="absolute h-4 w-4 rounded-full border border-gold/70" />
                      <span className={`h-2 w-2 rounded-full ${ev.highlight ? "bg-maroon" : "bg-gold"}`} />
                    </span>

                    <div
                      className={`relative inline-block w-full max-w-md rounded-sm border p-7 text-left transition-all duration-500 ${
                        ev.highlight
                          ? "border-gold bg-gradient-to-br from-ivory to-parchment-deep/70 shadow-[var(--shadow-elegant)]"
                          : "border-gold/30 bg-ivory/70 hover:border-gold/70"
                      }`}
                    >
                      {ev.highlight && (
                        <span className="absolute -top-3 right-6 bg-maroon px-3 py-0.5 font-sc text-xs uppercase tracking-[0.4em] text-ivory">
                          Muhurtham
                        </span>
                      )}
                      <h3 className="mt-2 font-display text-3xl md:text-4xl text-maroon-deep">{ev.title}</h3>
                      <p className="mt-3 font-serif font-medium italic text-ink/90">{ev.note}</p>
                      <div className="mt-5 space-y-1.5 text-sm font-medium text-ink/90">
                        <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-gold" /> {ev.date}</p>
                        <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-gold" /> {ev.time}</p>
                        <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold" /> {ev.place}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ---------- venue ---------- */

function Venue() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36 px-6 bg-ivory paper-texture">
      <div className="relative z-10 mx-auto max-w-2xl text-center">

        <Reveal>
          <p className="font-sc text-xs md:text-sm uppercase tracking-[0.5em] text-maroon-deep text-readable">The Venue</p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-maroon-deep">U.B.R. Convention</h2>
          <TinyOrn className="mx-auto mt-4" />
          <p className="mt-8 font-serif font-medium italic text-lg md:text-xl leading-relaxed text-ink/90">
            Opp. G. Pulla Reddy Engg. College,
            <br />Pasupula Road, Kurnool — 518 002.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative mt-10 overflow-hidden rounded-sm border border-gold/40 shadow-[var(--shadow-elegant)]">
            <iframe
              title="U.B.R. Convention, Kurnool"
              src="https://www.google.com/maps?q=U.B.R.%20Convention%20Kurnool&output=embed"
              width="100%"
              height="320"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0"
            />
          </div>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://maps.google.com/?q=U.B.R.+Convention+Kurnool"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 border border-gold/60 bg-transparent px-7 py-3.5 font-sc text-xs md:text-sm uppercase tracking-[0.4em] text-maroon transition-all hover:bg-maroon hover:text-ivory"
            >
              <MapPin className="h-4 w-4 transition-transform group-hover:scale-110" /> Open in maps
            </a>
            <button
              type="button"
              onClick={async () => {
                const mapsUrl = "https://maps.google.com/?q=U.B.R.+Convention+Kurnool";
                const shareData = {
                  title: "U.B.R. Convention, Kurnool",
                  text: "Venue for Meghana Raj & Sai Pradyumna's Wedding — U.B.R. Convention, Kurnool.",
                  url: mapsUrl,
                };
                try {
                  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
                    await navigator.share(shareData);
                    return;
                  }
                } catch {
                  // user cancelled or share failed — fall through to clipboard
                }
                try {
                  if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(mapsUrl);
                    toast.success("Location link copied to clipboard");
                    return;
                  }
                } catch {}
                // final fallback — open the map in a new tab
                window.open(mapsUrl, "_blank", "noopener,noreferrer");
              }}
              className="group inline-flex items-center gap-3 bg-maroon px-7 py-3.5 font-sc text-xs md:text-sm uppercase tracking-[0.4em] text-ivory transition-all hover:bg-maroon-deep cursor-pointer"
            >
              <Share className="h-4 w-4 transition-transform group-hover:scale-110" /> Share Location
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- blessings ---------- */

function Blessings() {
  return (
    <section id="blessings" className="relative py-24 md:py-36 px-6 bg-parchment paper-texture">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <TinyOrn className="mx-auto" />
          <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-maroon-deep">
            Your Presence,<br />Our Joy
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="my-10 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gold/70" />
            <Heart className="h-4 w-4 text-gold" />
            <span className="h-px w-16 bg-gold/70" />
          </div>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="font-script text-3xl md:text-4xl text-maroon-deep">
            With Best Compliments From
          </p>
          <p className="mt-2 font-sc text-sm md:text-base uppercase tracking-[0.5em] text-maroon-deep text-readable">
            Near &amp; Dear
          </p>
        </Reveal>
        <Reveal delay={0.5}>
          <div className="mt-14 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gold/70" />
            <TinyOrn />
            <span className="h-px w-16 bg-gold/70" />
          </div>
          <p className="mt-8 font-sc text-sm md:text-base uppercase tracking-[0.5em] text-maroon-deep text-readable text-center">
            Invited by
          </p>
          <p className="mt-6 text-center font-display text-3xl md:text-5xl leading-[1.1] text-maroon-deep">
            Smt. V. S. Rekha
          </p>
          <p className="my-3 text-center font-script text-3xl md:text-4xl text-foil">and</p>
          <p className="text-center font-display text-3xl md:text-5xl leading-[1.1] text-maroon-deep">
            Late Sri Mohanapu Suresh
          </p>
        </Reveal>
      </div>
    </section>
  );
}




/* ---------- footer ---------- */

function Footer() {
  return (
    <footer className="relative border-t border-gold/30 bg-maroon-deep py-16 px-6 text-center text-ivory paper-texture">
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="font-display tracking-[0.25em] text-4xl text-foil">
          M<span className="mx-1 text-gold/50 font-thin">|</span>S
        </div>
        <p className="mt-6 font-script text-3xl text-foil">with love & light</p>
        <p className="mt-4 font-sc text-xs md:text-sm uppercase tracking-[0.5em] text-gold-soft text-readable">
          Meghana Raj &amp; Sai Pradyumna
        </p>
        <p className="mt-1 font-sc text-xs md:text-sm uppercase tracking-[0.5em] text-ivory/70 text-readable">
          27 · August · 2026 · Kurnool
        </p>

        <div className="mx-auto mt-12 max-w-md border-t border-gold/30 pt-10">
          <p className="font-sc text-[10px] uppercase tracking-[0.5em] text-gold-soft/80">Photography by</p>
          <p className="mt-2 font-serif italic text-3xl md:text-4xl text-ivory">
            PASSION PHOTOGRAPHY
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href="tel:+919959990503"
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold/10"
            >
              <Phone className="h-4 w-4 text-gold" /> +91 9959990503
            </a>
            <a
              href="mailto:Passionphotography7878@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold/10"
            >
              <Mail className="h-4 w-4 text-gold" /> Passionphotography7878@gmail.com
            </a>
            <a
              href="https://www.instagram.com/passionphotography_in_kurnool"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold/10"
            >
              <Instagram className="h-4 w-4 text-gold" /> Instagram
            </a>
            <a
              href="https://www.youtube.com/@PassionPhotographyy"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold/10"
            >
              <Youtube className="h-4 w-4 text-gold" /> YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- page ---------- */

function Invitation() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.35;
    a.loop = true;
    const tryPlay = () => a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    tryPlay();
    // Fallback: browsers that block autoplay will start on first user gesture
    const onGesture = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("touchstart", onGesture);
    };
    window.addEventListener("pointerdown", onGesture, { once: true });
    window.addEventListener("keydown", onGesture, { once: true });
    window.addEventListener("touchstart", onGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("touchstart", onGesture);
    };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) {
        await a.play();
        setPlaying(true);
      } else {
        a.pause();
        setPlaying(false);
      }
    } catch {
      setPlaying(false);
    }
  };

  return (
    <main className="relative overflow-hidden">
      <MandalaBackground />
      <FloralBackdrop />
      <Petals />
      <Hero />
      <Invocation />
      <Families />
      <CountdownSection />
      <Events />
      <Venue />
      <Blessings />
      
      <Footer />
      <audio ref={audioRef} src={musicAsset.url} preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-ivory/90 text-maroon-deep shadow-[var(--shadow-inner-gold)] backdrop-blur transition hover:scale-105"
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>
    </main>
  );
}


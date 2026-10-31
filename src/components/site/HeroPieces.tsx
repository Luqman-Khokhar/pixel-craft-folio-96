import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { hero } from "@/data/portfolio";

const TILES = [
  { src: "/Projects/icons/chirpbyte.webp", name: "Chirpbyte", x: "4%", y: "45%", size: "clamp(3.5rem,7vw,6.5rem)", depth: 34, swing: 7, t: 5.4, mobile: true },
  { src: "/Projects/icons/skip2beat.webp", name: "Skip2Beat", x: "24%", y: "64%", size: "clamp(3rem,5.2vw,5rem)", depth: 54, swing: 10, t: 4.2, mobile: false },
  { src: "/Projects/icons/kroolo.webp", name: "Kroolo", x: "66%", y: "41%", size: "clamp(3rem,4.6vw,4.5rem)", depth: 20, swing: 12, t: 3.8, mobile: false },
  { src: "/Projects/icons/health.webp", name: "Health In Mobile", x: "73%", y: "66%", size: "clamp(3rem,5.6vw,5.4rem)", depth: 48, swing: 8, t: 4.8, mobile: true },
  { src: "/Projects/icons/alsalaam.webp", name: "AlSalaam Tourism", x: "86%", y: "44%", size: "clamp(3.5rem,7vw,6.5rem)", depth: 30, swing: 6, t: 6.2, mobile: true },
  { src: "/Projects/icons/primax.webp", name: "Primax Portal", x: "20%", y: "41%", size: "clamp(3rem,5vw,5rem)", depth: 24, swing: 5, t: 5.8, mobile: false },
];

function Tile({ tile, mx, my, away, ready, index }: { tile: (typeof TILES)[number]; mx: MotionValue<number>; my: MotionValue<number>; away: MotionValue<number>; ready: boolean; index: number }) {
  const reduce = useReducedMotion();
  const px = useTransform(mx, (v) => v * tile.depth);
  const py = useTransform(my, (v) => v * tile.depth);
  const dir = index % 2 ? 1 : -1;
  const flyY = useTransform(away, [0, 1], ["0vh", `${-40 - tile.depth}vh`]);
  const flyR = useTransform(away, [0, 1], [0, dir * 60]);
  return (
    <motion.div
      className={`absolute ${tile.mobile ? "" : "hidden md:block"}`}
      style={{ left: tile.x, top: tile.y, x: px, y: py }}
      initial={reduce ? false : { opacity: 0, scale: 0.4 }}
      animate={ready ? { opacity: 1, scale: 1 } : undefined}
      transition={{ type: "spring", stiffness: 140, damping: 11, delay: 0.5 + index * 0.08 }}
    >
      <motion.div style={{ y: flyY, rotate: flyR }}>
        <div
          className="swing grid place-items-center rounded-2xl bg-paper p-2.5 shadow-2xl shadow-ink-deep/60 ring-1 ring-honey/60"
          style={{ width: tile.size, height: tile.size, ["--swing" as string]: `${tile.swing}deg`, ["--swing-t" as string]: `${tile.t}s` }}
        >
          <img src={tile.src} alt="" width={96} height={96} className="h-full w-full object-contain" draggable={false} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Real product logos hanging in the air around the portrait, nudged by the pointer. */
export function FloatingTiles({ ready, away }: { ready: boolean; away: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 50, damping: 14 });
  const my = useSpring(rawY, { stiffness: 50, damping: 14 });

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      rawX.set(-(e.clientX / window.innerWidth - 0.5));
      rawY.set(-(e.clientY / window.innerHeight - 0.5));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, rawX, rawY]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
      {TILES.map((tile, i) => (
        <Tile key={tile.name} tile={tile} mx={mx} my={my} away={away} ready={ready} index={i} />
      ))}
    </div>
  );
}

/** Slowly turning ring of roles behind the head. */
export function Halo({ className = "" }: { className?: string }) {
  const text = `${hero.roles.join("  ✦  ")}  ✦  `;
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <circle cx="200" cy="200" r="198" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <circle cx="200" cy="200" r="154" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 7" opacity="0.7" />
      <g className="halo-spin">
        <path id="halo-path" d="M200 200 m-170 0 a170 170 0 1 1 340 0 a170 170 0 1 1 -340 0" fill="none" />
        <text fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="14.6" letterSpacing="2.1">
          <textPath href="#halo-path" textLength="1060">{text.toUpperCase()}</textPath>
        </text>
      </g>
    </svg>
  );
}

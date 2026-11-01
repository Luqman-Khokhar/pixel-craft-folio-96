import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { platformLabel, projects } from "@/data/portfolio";
import { ProjectCase } from "./ProjectCase";
import { ProjectsList } from "./ProjectsList";
import { EASE_OUT, useMediaQuery } from "./primitives";
import { ScrambleText } from "./ScrambleText";
import { useOrbitRing } from "./useOrbitRing";

const pad = (n: number) => String(n).padStart(2, "0");
const count = projects.length;

function Orbit() {
  const stage = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [spot, setSpot] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const fine = useMediaQuery("(pointer: fine)");
  const ring = useOrbitRing(stage, () => setEntered(true));
  const spotlit = spot === null ? null : projects[spot];

  useEffect(() => ring.hold("paused", paused), [ring, paused]);
  useEffect(() => ring.hold("open", open !== null), [ring, open]);

  return (
    <>
      <motion.div
        ref={stage}
        className="relative grid h-full cursor-grab touch-pan-y select-none place-items-center rounded-t-[inherit] [overflow:clip] active:cursor-grabbing"
        animate={{ scale: open === null ? 1 : 0.95 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.div
          className="pointer-events-none relative z-10 mt-[calc(var(--center-y,0px)*2)] flex w-[min(34rem,72vw)] flex-col items-center text-center md:w-[min(34rem,46vw)]"
          initial={{ opacity: 0, y: 36 }}
          animate={entered ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          <div aria-hidden="true" className="absolute -inset-x-10 -inset-y-12 -z-10 bg-[radial-gradient(closest-side,hsl(var(--ink)/0.92),transparent)]" />
          <h2 className="sr-only">Selected Work</h2>
          <p aria-hidden="true" className="eyebrow text-honey">
            {spotlit ? `N°${pad(spot! + 1)} / ${pad(count)} · ${platformLabel[spotlit.platform]}` : `${pad(count)} Projects`}
          </p>
          <p aria-hidden="true" className="mt-3 grid min-h-[2em] place-items-center font-display text-[clamp(2.5rem,min(5vw,9svh),5rem)] font-bold leading-[0.98] tracking-tight">
            <ScrambleText text={spotlit ? spotlit.title : "Selected Work"} duration={420} />
          </p>
          <p aria-hidden="true" className="mt-3 min-h-[3em] max-w-sm text-sm leading-relaxed text-paper/80 md:text-base">
            {spotlit ? spotlit.type : "Web and mobile products, shipped to real users."}
          </p>
          <div data-orbit-ignore className="pointer-events-auto mt-2 flex items-center gap-3">
            <p className="eyebrow whitespace-nowrap !text-[0.65rem] text-paper/70">{fine ? "Drag to spin · Click a card" : "Swipe · Tap a card"}</p>
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-label={paused ? "Resume project orbit" : "Pause project orbit"}
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-paper/25 text-paper transition-colors hover:border-honey hover:text-honey"
            >
              {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>
          </div>
        </motion.div>

        <div data-orbit-track className="absolute inset-0 will-change-transform">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
            <ellipse data-orbit-line fill="none" className="stroke-paper/10" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          <ul aria-label="Projects" data-spotlight={spot === null ? undefined : ""}>
            {projects.map((p, i) => (
              <li key={p.title} className="contents">
                <button
                  type="button"
                  data-orbit-card
                  data-cursor="View"
                  data-on={spot === i ? "" : undefined}
                  aria-label={`Open ${p.title}, ${p.type}`}
                  onClick={() => setOpen(i)}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "mouse") return;
                    ring.hold("hover", true);
                    setSpot(i);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType !== "mouse") return;
                    ring.hold("hover", false);
                    setSpot((cur) => (cur === i ? null : cur));
                  }}
                  onFocus={(e) => {
                    if (!e.currentTarget.matches(":focus-visible")) return;
                    ring.hold("focus", true);
                    ring.bringToFront(i);
                    setSpot(i);
                  }}
                  onBlur={() => {
                    ring.hold("focus", false);
                    setSpot((cur) => (cur === i ? null : cur));
                  }}
                  className="orbit-card absolute left-1/2 top-[calc(50%+var(--center-y,0px))] h-[var(--card-h,12rem)] w-[var(--card-w,19rem)] rounded-lg opacity-0 will-change-transform"
                >
                  <span className="orbit-face relative block h-full w-full overflow-hidden rounded-lg bg-ink shadow-[0_1.5rem_3.5rem_-1rem_hsl(var(--ink-deep))] ring-1 ring-paper/15">
                    <img src={p.cover} alt="" width={1600} height={1000} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
                    <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-ink-deep/85 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-paper">
                      <span className="text-honey">{pad(i + 1)}</span>
                      {p.title}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <ProjectCase project={open === null ? null : projects[open]} index={open ?? 0} total={count} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </>
  );
}

/** One screen of orbiting cards: pick one to read it, scroll on whenever. Reduced motion gets a plain list. */
export function ProjectsOrbit() {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  return (
    <section id="projects" className={`sheet-edge relative -mt-10 bg-ink bg-[radial-gradient(ellipse_at_center,hsl(var(--honey)/0.06),transparent_62%)] text-paper md:-mt-16 ${reduce ? "pb-16" : "h-[calc(100svh+4rem)] min-h-[42rem]"}`}>
      {reduce ? <ProjectsList /> : <Orbit />}
    </section>
  );
}

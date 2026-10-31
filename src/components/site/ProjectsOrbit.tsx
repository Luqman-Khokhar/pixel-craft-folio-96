import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { platformLabel, projects } from "@/data/portfolio";
import { scrollToY } from "@/lib/smoothScroll";
import { ProjectCase } from "./ProjectCase";
import { ProjectsList } from "./ProjectsList";
import { Roll, useMediaQuery } from "./primitives";
import { ScrambleText } from "./ScrambleText";

const OrbitScene = lazy(() => import("./OrbitScene"));

const hasWebGL = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
};

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Each project holds still for part of its scroll range, so the wheel lands by itself. */
const plateau = (raw: number) => {
  const i = Math.floor(raw);
  const f = raw - i;
  const t = Math.min(Math.max((f - 0.22) / 0.56, 0), 1);
  return i + t * t * (3 - 2 * t);
};

function Orbit() {
  const track = useRef<HTMLDivElement>(null);
  const target = useRef(0);
  const pointer = useRef<[number, number]>([0, 0]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [near, setNear] = useState(false);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const count = projects.length;
  const project = projects[index];

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const raw = v * (count - 1);
    target.current = plateau(raw);
    const next = Math.min(Math.round(raw), count - 1);
    setIndex((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "60% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const clamped = Math.min(Math.max(i, 0), count - 1);
    const range = el.offsetHeight - window.innerHeight;
    scrollToY(el.getBoundingClientRect().top + window.scrollY + (range * clamped) / (count - 1));
  }, [count]);

  // Click the focused cover to open it; click a neighbour to bring it into focus.
  const indexRef = useRef(index);
  indexRef.current = index;
  const onSelect = useCallback((i: number) => {
    if (i === indexRef.current) setOpen(i);
    else goTo(i);
  }, [goTo]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goTo(index + 1); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goTo(index - 1); }
  };

  return (
    <div
      ref={track}
      style={{ height: `${count * 110}svh` }}
      className="relative"
      onPointerMove={(e) => { pointer.current = [e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5]; }}
    >
      <div className="sticky top-0 h-svh overflow-hidden" role="group" aria-roledescription="carousel" aria-label="Selected projects" onKeyDown={onKeyDown}>
        <SceneBoundary fallback={<img src={project.cover} alt="" className="absolute inset-x-0 top-[12%] mx-auto w-[min(88vw,36rem)] rounded-xl" />}>
          <Suspense fallback={null}>
            {near && <OrbitScene target={target} pointer={pointer} onSelect={onSelect} active={near && open === null} />}
          </Suspense>
        </SceneBoundary>

        <h2 className="eyebrow absolute left-4 top-20 z-10 text-honey sm:left-6">Selected Work</h2>

        <p className="sr-only" aria-live="polite">Project {index + 1} of {count}: {project.title}</p>

        <div className="pointer-events-none absolute inset-x-4 bottom-20 z-10 mx-auto flex max-w-md flex-col items-center text-center md:inset-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
          <p aria-hidden="true" className="eyebrow mb-2 text-paper/70">
            N°<ScrambleText text={String(index + 1).padStart(2, "0")} duration={350} /> / {String(count).padStart(2, "0")}
          </p>
          <h3 className="max-w-[24rem] font-serif text-[clamp(2.6rem,4.2vw,4.75rem)] font-medium leading-[0.98] tracking-tight">
            <ScrambleText text={project.title} />
          </h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={project.title}
              data-bee-skip
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mt-3 max-w-xs text-sm text-paper/85 md:text-base">{project.type}</p>
              <p className="eyebrow mt-3 rounded-full border border-paper/25 px-3 py-1 !text-[0.65rem] text-paper/85">{platformLabel[project.platform]}</p>
            </motion.div>
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setOpen(index)}
            className="pointer-events-auto mt-5 rounded-full bg-honey px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Roll>View project</Roll>
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-3">
          <button type="button" aria-label="Previous project" disabled={index === 0} onClick={() => goTo(index - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-paper/30 transition-colors hover:border-honey hover:text-honey disabled:opacity-30">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <ol className="flex items-center gap-1" aria-label="Choose a project">
            {projects.map((p, i) => (
              <li key={p.title}>
                <button type="button" aria-label={p.title} aria-current={i === index ? "true" : undefined} onClick={() => goTo(i)} className="flex h-10 items-center px-1">
                  <span className={`block h-0.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-honey" : "w-3 bg-paper/40"}`} />
                </button>
              </li>
            ))}
          </ol>
          <button type="button" aria-label="Next project" disabled={index === count - 1} onClick={() => goTo(index + 1)} className="grid h-10 w-10 place-items-center rounded-full border border-paper/30 transition-colors hover:border-honey hover:text-honey disabled:opacity-30">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <ProjectCase project={open === null ? null : projects[open]} index={open ?? 0} total={count} onClose={() => setOpen(null)} />
    </div>
  );
}

/** Scroll-driven orbit (WebGL). Reduced motion or no WebGL gets a plain, complete list. */
export function ProjectsOrbit() {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [webgl] = useState(hasWebGL);
  return (
    <section id="projects" className="relative bg-ink-deep text-paper">
      {reduce || !webgl ? <ProjectsList /> : <Orbit />}
    </section>
  );
}

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { projects } from "@/data/portfolio";
import { OutlineWord } from "./OutlineWord";
import { ProjectAccordion } from "./ProjectAccordion";
import { ProjectStage } from "./ProjectStage";
import { STAGE_ID, tabId } from "./projectMedia";
import { PLATFORM_ICONS } from "./platformIcons";
import { EASE_OUT, RiseText, useMediaQuery } from "./primitives";
import { useHoverIntent } from "./useHoverIntent";

const COUNT = String(projects.length).padStart(2, "0");
// Scroll the pinned section absorbs before the experience sheet starts to rise, same as Skills.
const DWELL = "70svh";

/** Every project by name, and the picked one on a foil plate beside it. Pinned like Skills, so a quick scroll doesn't carry the visitor past it. */
export function ProjectsIndex() {
  const section = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const inView = useInView(section, { once: true, margin: "0px 0px -20% 0px" });
  const wide = useMediaQuery("(min-width: 768px)");
  const split = useMediaQuery("(min-width: 1024px) and (min-aspect-ratio: 1/1)");
  const hover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  // The stage sticks once its bottom meets the screen's, rests for DWELL, then holds for one more screen while the experience sheet slides over it.
  const stage = useRef<HTMLDivElement>(null);
  const [stageHeight, setStageHeight] = useState(0);
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const cover = useRef<HTMLDivElement>(null);
  const { scrollYProgress: covered } = useScroll({ target: cover, offset: ["start end", "start start"] });
  const sink = useTransform(covered, [0, 1], [1, 0.94]);
  const shade = useTransform(covered, [0, 1], [0, 0.6]);

  const select = (i: number) => {
    if (i === active) return;
    setDir(i > active ? 1 : -1);
    setActive(i);
  };
  const intent = useHoverIntent(select, hover);

  // A swipe on the cover: the next or previous project, round the end of the list.
  const step = (by: number) => {
    setDir(by);
    setActive((a) => (a + by + projects.length) % projects.length);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const last = projects.length - 1;
    const to =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? (active + 1) % projects.length
      : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (active - 1 + projects.length) % projects.length
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    select(to);
    tabs.current[to]?.focus();
  };

  const rise: Variants = reduce
    ? { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.2 } } }
    : { hidden: { opacity: 0, y: 12 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } } };
  const plateIn: Variants = reduce
    ? rise
    : { hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT, delay: 0.15 } } };

  const header = (
    <header className={split ? "" : "md:flex md:items-end md:justify-between md:gap-10"}>
      <h2 id="projects-title" className="flex items-start gap-3 font-display text-[clamp(2.75rem,7svh,5.5rem)] font-bold leading-[0.9] tracking-[-0.02em]">
        <RiseText text="Projects" />
        <span className="mt-[0.2em] font-sans text-[0.25em] font-semibold tabular-nums tracking-normal text-honey" aria-hidden="true">
          {COUNT}
        </span>
      </h2>
      <p className={`max-w-[26rem] text-[clamp(1rem,1.6svh,1.125rem)] leading-relaxed text-paper/75 ${split ? "mt-4" : "mt-3 md:mt-0 md:pb-1"}`}>
        Seven apps shipped to real users, on the web and in the stores. Pick one to see what it does and what it runs on.
      </p>
    </header>
  );

  const tablist = (
    <div
      role="tablist"
      aria-label="Projects"
      aria-orientation="vertical"
      onKeyDown={onKeyDown}
      className={split ? "mt-[clamp(1.5rem,4svh,3rem)] border-t border-paper/10" : "mt-6 grid grid-cols-2 gap-x-8 border-t border-paper/10"}
    >
      {projects.map((p, i) => {
        const on = i === active;
        const icons = PLATFORM_ICONS[p.platform];
        return (
          <motion.button
            key={p.title}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            variants={rise}
            type="button"
            role="tab"
            id={tabId(i)}
            aria-selected={on}
            aria-controls={STAGE_ID}
            tabIndex={on ? 0 : -1}
            onClick={() => select(i)}
            {...intent(i)}
            className="group relative grid w-full grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-4 rounded-sm py-[clamp(0.5rem,1.25svh,0.875rem)] text-left focus-visible:outline-offset-[6px]"
          >
            <span className={`text-sm font-medium tabular-nums transition-colors duration-200 ${on ? "text-honey" : "text-paper/50"}`}>{String(i + 1).padStart(2, "0")}</span>
            <span
              className={`truncate font-display font-bold leading-[1.1] tracking-[-0.01em] transition-colors duration-200 ${
                split ? "text-[clamp(1.75rem,4.2svh,3rem)]" : "text-[clamp(1.5rem,3.4vw,2rem)]"
              } ${on ? "text-paper" : "text-paper/55 [@media(hover:hover)]:group-hover:text-paper/85"}`}
            >
              {p.title}
            </span>
            <span className={`flex items-center gap-1.5 transition-colors duration-200 ${on ? "text-honey" : "text-paper/45"}`}>
              {icons.map((Icon, n) => (
                <Icon key={n} aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
              ))}
            </span>
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-paper/10" />
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-honey transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none ${on ? "scale-x-100" : "scale-x-0"}`}
            />
          </motion.button>
        );
      })}
    </div>
  );

  return (
    // With motion, the sheet slides up over the last pinned screen of Skills, which stays put beneath it.
    <section id="projects" aria-labelledby="projects-title" className="sheet-edge relative bg-ink-deep text-paper [overflow:clip] motion-safe:-mt-[100svh] motion-reduce:-mt-10 motion-reduce:md:-mt-16">
      <div className="relative" style={reduce ? undefined : { height: `calc(${stageHeight}px + ${DWELL} + 100svh)` }}>
        <div ref={cover} aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 ${reduce ? "h-0" : "h-svh"}`} />
        <div ref={stage} className={reduce ? "relative" : "sticky"} style={reduce ? undefined : { top: `min(0px, calc(100svh - ${stageHeight}px))` }}>
      <motion.div style={reduce ? undefined : { scale: sink }} className="relative origin-[50%_35%]">
      <OutlineWord text="PROJECTS" strokeClassName="stroke-honey/[0.09]" className="pointer-events-none absolute left-[3%] top-[4%] hidden h-[38%] w-[94%] md:block" />

      <motion.div
        ref={section}
        initial="hidden"
        animate={inView ? "shown" : "hidden"}
        variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.04 } } }}
        className={`relative mx-auto max-w-[100rem] px-4 pb-[clamp(2.5rem,7svh,5rem)] pt-[max(5.5rem,11svh)] sm:px-6 ${
          split ? "grid min-h-svh grid-cols-[minmax(0,38rem)_auto] items-center justify-between gap-x-[clamp(2.5rem,4vw,5rem)]" : ""
        }`}
      >
        {split ? (
          <>
            <div className="min-w-0">
              {header}
              {tablist}
              <p className="mt-5 text-sm text-paper/55">Hover a name, or use the arrow keys.</p>
            </div>
            {/* As wide as the height allows, so the whole plate fits a laptop screen; on a short one it keeps a readable floor and the page scrolls. */}
            <motion.div variants={plateIn} className="w-[min(54vw,60rem,max(34rem,calc((100svh-30rem)*1.6+4.5rem)))]">
              <ProjectStage active={active} dir={dir} warm onStep={step} />
            </motion.div>
          </>
        ) : wide ? (
          <>
            {header}
            {tablist}
            <motion.div variants={plateIn} className="mx-auto mt-8 w-full max-w-[52rem]">
              <ProjectStage active={active} dir={dir} warm onStep={step} />
            </motion.div>
            <p className="mt-4 text-center text-sm text-paper/55">Tap a name, or swipe the cover.</p>
          </>
        ) : (
          <>
            {header}
            <ProjectAccordion rise={rise} />
          </>
        )}
      </motion.div>
      </motion.div>
          {!reduce && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[hsl(var(--night))]" style={{ opacity: shade }} />}
        </div>
      </div>

      {/* Without motion nothing pins: the next sheet overlaps this strip; the rest keeps its shadow off the table. */}
      {reduce && <div aria-hidden="true" className="h-[6.5rem] md:h-32" />}
    </section>
  );
}

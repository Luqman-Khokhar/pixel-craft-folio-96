import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { projects, projectsIntro } from "@/data/portfolio";
import { FeaturedWork } from "./FeaturedWork";
import { ProjectAccordion } from "./ProjectAccordion";
import { ProjectStage } from "./ProjectStage";
import { STAGE_ID, tabId } from "./projectMedia";
import { PLATFORM_ICONS } from "./platformIcons";
import { EASE_OUT, RiseText, useMediaQuery } from "./primitives";
import { useHoverIntent } from "./useHoverIntent";

const featured = projects.filter((p) => p.featured);
const more = projects.filter((p) => !p.featured);

/** Work: three case studies written up in full, then every other project behind a name index and a plate viewer. */
export function ProjectsIndex() {
  const section = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const inView = useInView(section, { once: true, margin: "0px 0px -20% 0px" });
  const wide = useMediaQuery("(min-width: 768px)");
  const split = useMediaQuery("(min-width: 1024px)");
  const hover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  const select = (i: number) => {
    if (i === active) return;
    setDir(i > active ? 1 : -1);
    setActive(i);
  };
  const intent = useHoverIntent(select, hover);

  // A swipe on the cover: the next or previous project, round the end of the list.
  const step = (by: number) => {
    setDir(by);
    setActive((a) => (a + by + more.length) % more.length);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const last = more.length - 1;
    const to =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? (active + 1) % more.length
      : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (active - 1 + more.length) % more.length
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

  const tablist = (
    <div
      role="tablist"
      aria-labelledby="more-projects-title"
      aria-orientation="vertical"
      onKeyDown={onKeyDown}
      className={split ? "mt-8 border-t border-paper/10" : "mt-6 grid grid-cols-2 gap-x-8 border-t border-paper/10"}
    >
      {more.map((p, i) => {
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
            className="group relative grid w-full grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-4 rounded-sm py-3 min-h-[3.25rem] text-left focus-visible:outline-offset-[6px]"
          >
            <span className={`text-sm font-medium tabular-nums transition-colors duration-200 ${on ? "text-honey" : "text-paper/70"}`}>{String(i + 1).padStart(2, "0")}</span>
            <span
              className={`truncate font-display font-bold leading-[1.1] tracking-[-0.01em] transition-colors duration-200 ${
                split ? "text-[clamp(1.75rem,3vw,2.5rem)]" : "text-[clamp(1.5rem,3.4vw,2rem)]"
              } ${on ? "text-paper" : "text-paper/70 [@media(hover:hover)]:group-hover:text-paper/85"}`}
            >
              {p.title}
            </span>
            <span className={`flex items-center gap-1.5 transition-colors duration-200 ${on ? "text-honey" : "text-paper/70"}`}>
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
    <section id="projects" aria-labelledby="projects-title" className="sheet-edge relative -mt-10 bg-paper text-ink md:-mt-16 [overflow:clip]">
      <div className="mx-auto max-w-[100rem] px-4 pb-20 pt-20 sm:px-6 md:pb-28 md:pt-28">
        <header className="md:flex md:items-end md:justify-between md:gap-10">
          <div>
            <p className="eyebrow text-honey-ink">Work</p>
            <h2 id="projects-title" className="mt-3 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[0.9] tracking-[-0.02em]">
              <RiseText text={projectsIntro.title} />
            </h2>
          </div>
          <p className="mt-4 max-w-[26rem] text-[1.0625rem] leading-relaxed text-ink/80 md:mt-0 md:pb-1">{projectsIntro.sub}</p>
        </header>

        <FeaturedWork items={featured} />
      </div>

      <div className="bg-ink-deep text-paper">
        <motion.div
          ref={section}
          initial="hidden"
          animate={inView ? "shown" : "hidden"}
          variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.04 } } }}
          className="mx-auto max-w-[100rem] px-4 pb-24 pt-16 sm:px-6 md:pb-32 md:pt-24"
        >
          <div className={split ? "grid grid-cols-[minmax(0,34rem)_minmax(0,1fr)] items-start gap-x-[clamp(2.5rem,4vw,5rem)]" : ""}>
            <div className="min-w-0">
              <h3 id="more-projects-title" className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-bold leading-[0.95] tracking-[-0.02em]">
                More projects
              </h3>
              <p className="mt-3 max-w-[28rem] text-[1.0625rem] leading-relaxed text-paper/75">
                {wide ? "Pick one to see what it does, what I built and what it runs on." : "Tap a project to see what it does and what I built."}
              </p>
              {wide && tablist}
              {split && <p className="mt-5 text-sm text-paper/70">Hover a name, or use the arrow keys.</p>}
            </div>
            {split ? (
              <motion.div variants={plateIn} className="min-w-0">
                <ProjectStage items={more} active={active} dir={dir} warm onStep={step} />
              </motion.div>
            ) : null}
          </div>
          {wide && !split && (
            <>
              <motion.div variants={plateIn} className="mx-auto mt-8 w-full max-w-[52rem]">
                <ProjectStage items={more} active={active} dir={dir} warm onStep={step} />
              </motion.div>
              <p className="mt-4 text-center text-sm text-paper/70">Tap a name, or swipe the cover.</p>
            </>
          )}
          {!wide && <ProjectAccordion items={more} rise={rise} />}
        </motion.div>
      </div>
    </section>
  );
}

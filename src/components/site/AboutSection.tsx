import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { about } from "@/data/portfolio";
import { Reveal, ScrollWords, useMediaQuery } from "./primitives";

// Where each part of the scene plays, as shares of the pinned scroll.
const SETTLE: [number, number] = [0, 0.06];
const WORDS: [number, number] = [0.06, 0.42];
const PARA: [number, number] = [0.42, 0.58];
const STATS: [number, number] = [0.58, 0.84];
const RAIL_FADE: [number, number] = [0.84, 0.92];
const STEPS = [
  { label: "Statement", end: WORDS[1] },
  { label: "Focus", end: PARA[1] },
  { label: "Numbers", end: STATS[1] },
];

const STATEMENT = "font-display font-medium leading-[1.04] tracking-tight";

function StatRow({ stat, index, total, progress }: { stat: (typeof about.stats)[number]; index: number; total: number; progress: MotionValue<number> }) {
  const span = (STATS[1] - STATS[0]) / total;
  const start = STATS[0] + span * index;
  const rule = useTransform(progress, [start, start + span * 0.6], [0, 1]);
  const label = useTransform(progress, [start + span * 0.2, start + span * 0.7], [0, 1]);
  const rise = useTransform(progress, [start + span * 0.25, start + span], ["100%", "0%"]);
  return (
    <div className="relative flex flex-col justify-between gap-2 py-3 md:flex-row md:items-baseline md:gap-4 md:py-3">
      <motion.span aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-ink/25" style={{ scaleX: rule }} />
      <motion.dt className="eyebrow text-ink/70" style={{ opacity: label }}>{stat.label}</motion.dt>
      <dd className="overflow-hidden pb-[0.06em] font-display text-2xl font-bold leading-none sm:text-4xl md:text-6xl">
        <motion.span className="block" style={{ y: rise }}>{stat.value}</motion.span>
      </dd>
    </div>
  );
}

function RailTick({ label, end, progress }: { label: string; end: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [end - 0.04, end], [0.4, 1]);
  return <motion.span style={{ opacity }}>{label}</motion.span>;
}

/** Pinned: the screen holds while the statement inks in, then the focus line, then each number, so a fast scroll can't skip it. */
function PinnedAbout() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 170, damping: 30, restDelta: 0.0005 });

  const settle = useTransform(p, SETTLE, [0, 1]);
  const paraOpacity = useTransform(p, PARA, [0, 1]);
  const paraY = useTransform(p, PARA, [24, 0]);
  const railFill = useTransform(p, [0, STATS[1]], [0, 1]);
  const railOpacity = useTransform(p, RAIL_FADE, [1, 0]);

  return (
    <section ref={section} id="about" data-nav-tone="light" className="relative -mt-[40svh] h-[360svh] bg-paper text-ink md:h-[300svh]">
      <div className="sticky top-0 flex h-svh flex-col [overflow:clip]">
        <div className="mx-auto my-auto grid w-full max-w-[100rem] gap-x-10 px-4 pb-16 pt-20 sm:px-6 md:grid-cols-12 md:pb-20 md:pt-24">
          <motion.div className="mb-4 md:col-span-2 md:mb-0" style={{ opacity: settle }}>
            <h2 className="eyebrow text-ink/70">About</h2>
            <motion.span aria-hidden="true" className="mt-3 block h-px w-12 origin-left bg-ink/40" style={{ scaleX: settle }} />
          </motion.div>

          <div className="md:col-span-10">
            <ScrollWords
              text={about.paragraphs[0]}
              progress={p}
              range={WORDS}
              className={`${STATEMENT} text-[clamp(1.6rem,min(7vw,5.2svh),6rem)] md:text-[clamp(2.3rem,min(5.4vw,7svh),6rem)]`}
            />

            <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-10 md:gap-10">
              <motion.p className="text-base leading-relaxed text-ink/85 md:col-span-4 md:text-xl" style={{ opacity: paraOpacity, y: paraY }}>
                {about.paragraphs[1]}
              </motion.p>

              <dl className="grid grid-cols-3 gap-4 md:col-span-5 md:col-start-6 md:grid-cols-1 md:gap-0">
                {about.stats.map((stat, i) => (
                  <StatRow key={stat.label} stat={stat} index={i} total={about.stats.length} progress={p} />
                ))}
              </dl>
            </div>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-4 flex flex-col gap-2 sm:left-6"
          style={{ opacity: railOpacity }}
        >
          <span className="eyebrow flex gap-3 text-[0.625rem] text-ink sm:text-xs">
            {STEPS.map((step) => (
              <RailTick key={step.label} label={step.label} end={step.end} progress={p} />
            ))}
          </span>
          <span className="block h-px w-full bg-ink/15">
            <motion.span className="block h-full origin-left bg-honey-deep" style={{ scaleX: railFill }} />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/** The paper room the portal frame opens into, rising over the scene's last blank stretch. Swiss rules, one big statement, three plain facts. */
function StaticAbout() {
  return (
    <section id="about" className="relative bg-paper text-ink motion-safe:-mt-[40svh]">
      <div className="mx-auto grid max-w-[100rem] gap-x-10 px-4 pb-12 pt-24 sm:px-6 md:grid-cols-12 md:pb-20 md:pt-36">
        <h2 className="eyebrow mb-6 text-ink/70 md:col-span-2 md:mb-0">About</h2>

        <div className="md:col-span-10">
          <ScrollWords
            text={about.paragraphs[0]}
            className={`${STATEMENT} text-[clamp(2.3rem,5.4vw,6rem)]`}
          />

          <div className="mt-14 grid gap-10 md:mt-24 md:grid-cols-10">
            <Reveal className="md:col-span-4">
              <p className="text-lg leading-relaxed text-ink/85 md:text-xl">{about.paragraphs[1]}</p>
            </Reveal>

            <dl className="border-t border-ink/25 md:col-span-5 md:col-start-6">
              {about.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="flex items-baseline justify-between gap-4 border-b border-ink/25 py-4">
                    <dt className="eyebrow text-ink/70">{stat.label}</dt>
                    <dd className="font-display text-5xl font-bold leading-none md:text-7xl">{stat.value}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pinned scene when motion is allowed and the screen is tall enough to hold it; the flowing layout otherwise. */
export function AboutSection() {
  const reduce = useReducedMotion();
  const tall = useMediaQuery("(min-height: 560px)");
  return !reduce && tall ? <PinnedAbout /> : <StaticAbout />;
}

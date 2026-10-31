import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { skills } from "@/data/portfolio";
import { Reveal, RiseText } from "./primitives";

const TICKER = skills[0].items;

/** Tech ticker that speeds up and reverses with scroll velocity. */
function Ticker() {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const factor = useTransform(velocity, [-2000, 0, 2000], [-4, 1, 6], { clamp: false });
  const x = useTransform(base, (v) => `${-(((v % 50) + 50) % 50)}%`);
  useAnimationFrame((_, delta) => {
    if (!reduce) base.set(base.get() + factor.get() * delta * 0.0022);
  });
  const row = [...TICKER, ...TICKER];
  return (
    <div aria-hidden="true" className="relative z-10 -my-3 -rotate-1 overflow-hidden bg-honey py-3 text-ink">
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {[...row, ...row].map((item, i) => (
          <span key={i} className="flex items-center font-serif text-3xl font-bold md:text-5xl">
            {item}
            <span className="mx-6 text-2xl md:mx-10">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/** An index, not a tag cloud: every skill is readable at a glance; rows wipe to ink on hover. */
export function SkillsIndex() {
  const ref = useRef<HTMLElement>(null);
  return (
    <>
      <section id="skills" ref={ref} className="bg-paper pb-24 pt-20 text-ink md:pb-36 md:pt-28">
        <div className="mx-auto max-w-[100rem] px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between gap-6 md:mb-16">
            <h2 className="font-display text-[clamp(4rem,13vw,13rem)] font-bold leading-[0.82]">
              <RiseText text="Skills" />
            </h2>
            <p className="eyebrow pb-2 text-ink/70">{skills.length} disciplines</p>
          </div>

          <ul className="border-t border-ink">
            {skills.map((group, i) => (
              <li key={group.category}>
                <Reveal>
                  <div className="group relative isolate grid gap-3 overflow-hidden border-b border-ink py-5 transition-colors md:px-3 duration-500 hover:text-paper md:grid-cols-12 md:items-baseline md:gap-6 md:py-7">
                    <span aria-hidden="true" className="absolute inset-x-[-2rem] bottom-0 top-0 -z-10 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-out group-hover:scale-y-100" />
                    <span aria-hidden="true" className="eyebrow text-ink/70 transition-colors group-hover:text-honey md:col-span-1">0{i + 1}</span>
                    <h3 className="font-serif text-4xl font-medium leading-none tracking-tight transition-transform duration-500 group-hover:translate-x-3 md:col-span-5 md:text-6xl">
                      {group.category}
                    </h3>
                    <p className="text-base leading-relaxed md:col-span-6 md:text-lg">{group.items.join("  ·  ")}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Ticker />
    </>
  );
}

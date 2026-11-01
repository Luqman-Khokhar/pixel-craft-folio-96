import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { experience } from "@/data/portfolio";
import { EASE, Reveal } from "./primitives";

/** Giant year that rolls digit by digit as the role beside it changes. */
function YearRoller({ year }: { year: string }) {
  const reduce = useReducedMotion();
  return (
    <span aria-hidden="true" className="flex overflow-hidden font-display text-[min(14.5vw,20rem)] font-bold leading-[0.8]">
      {year.split("").map((digit, i) => (
        <span key={i} className="relative inline-block">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={digit}
              className="inline-block"
              initial={reduce ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduce ? undefined : { y: "-100%" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

export function ExperienceYears() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(refs.current.indexOf(e.target as HTMLElement));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="experience" className="sheet-edge relative -mt-10 bg-paper text-ink md:-mt-16">
      <div className="mx-auto grid max-w-[100rem] gap-x-10 px-4 py-20 sm:px-6 md:grid-cols-12 md:py-32">
        <div className="md:col-span-6">
          <div className="md:sticky md:top-24">
            <h2 className="eyebrow mb-4 text-ink/70 md:mb-6">Experience</h2>
            <div className="hidden md:block"><YearRoller year={experience[active].year} /></div>
          </div>
        </div>

        <ol className="md:col-span-6">
          {experience.map((job, i) => (
            <li key={job.company}>
              <article ref={(el) => { refs.current[i] = el; }} className="border-t border-ink/25 py-8 md:min-h-[75svh] md:py-10">
                <Reveal>
                  <p className="font-display text-7xl font-bold leading-none md:hidden" aria-hidden="true">{job.year}</p>
                  <p className="eyebrow mt-3 text-ink/80 md:mt-0">{job.period}</p>
                  <h3 className="mt-4 font-display text-5xl font-medium leading-[0.98] tracking-tight md:text-6xl">{job.company}</h3>
                  <p className="mt-2 text-lg font-semibold">{job.role}</p>
                  <p className="mt-5 text-lg leading-relaxed md:text-xl">{job.summary}</p>
                  <ul className="mt-6 space-y-3">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-3 text-base leading-relaxed">
                        <span aria-hidden="true" className="mt-[0.72em] h-px w-3 shrink-0 bg-honey-deep" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

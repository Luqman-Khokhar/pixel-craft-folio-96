import { about } from "@/data/portfolio";
import { Reveal } from "./primitives";

const STATEMENT = "font-display font-medium leading-[1.04] tracking-tight";

/** One static editorial layout on paper: a big statement, two plain paragraphs, three ruled facts. */
export function AboutSection() {
  return (
    <section id="about" data-nav-tone="light" className="relative bg-paper text-ink motion-safe:-mt-[40svh]">
      <div className="mx-auto grid max-w-[100rem] gap-x-10 px-4 py-20 sm:px-6 md:grid-cols-12 md:py-28">
        <h2 className="eyebrow mb-6 text-ink/80 md:col-span-2 md:mb-0">About</h2>

        <div className="md:col-span-10">
          <Reveal>
            <p className={`${STATEMENT} text-[clamp(2.25rem,5vw,5.5rem)]`}>{about.statement}</p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-10">
            {about.paragraphs.map((text, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-lg leading-relaxed text-ink/90">{text}</p>
              </Reveal>
            ))}
          </div>

          <dl className="mt-12 grid border-t border-ink/25 md:mt-16 md:grid-cols-3">
            {about.facts.map((fact, i) => (
              <Reveal key={fact.label} delay={i * 0.08}>
                <div className="flex flex-col gap-2 border-b border-ink/25 py-5 md:h-full md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                  <dt className="eyebrow text-ink/80">{fact.label}</dt>
                  <dd className="font-display text-4xl font-bold leading-none md:text-5xl">{fact.value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

import { about } from "@/data/portfolio";
import { Reveal, ScrollWords } from "./primitives";

/** The paper room the portal frame opens into, rising over the scene's last blank stretch. Swiss rules, one big statement, three plain facts. */
export function AboutSection() {
  return (
    <section id="about" className="relative bg-paper text-ink motion-safe:-mt-[40svh]">
      <div className="mx-auto grid max-w-[100rem] gap-x-10 px-4 pb-12 pt-24 sm:px-6 md:grid-cols-12 md:pb-20 md:pt-36">
        <h2 className="eyebrow mb-6 text-ink/70 md:col-span-2 md:mb-0">About</h2>

        <div className="md:col-span-10">
          <ScrollWords
            text={about.paragraphs[0]}
            className="font-display text-[clamp(2.3rem,5.4vw,6rem)] font-medium leading-[1.04] tracking-tight"
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

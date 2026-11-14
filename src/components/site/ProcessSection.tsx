import { process, processIntro } from "@/data/portfolio";
import { Reveal, RiseText } from "./primitives";

/** Five numbered steps on ink: a honey hairline links the numbers on desktop, a left rule on mobile. */
export function ProcessSection() {
  return (
    <section id="process" data-nav-tone="dark" className="relative bg-ink text-paper">
      <div className="mx-auto max-w-[100rem] px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
          <p className="eyebrow text-honey md:col-span-2">Process</p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,5.5rem)] font-medium leading-[1.04] tracking-tight md:col-span-10">
            <RiseText text={processIntro.heading} />
          </h2>
        </div>

        <ol className="mt-12 grid gap-0 md:mt-16 lg:grid-cols-5 lg:gap-6">
          {process.map((step, i) => (
            <li key={step.number} className="relative pb-10 last:pb-0 lg:pb-0">
              <Reveal delay={i * 0.08} className="border-l border-paper/25 pl-5 lg:border-l-0 lg:pl-0">
                <div className="flex items-center gap-4">
                  <span className="font-sans text-sm font-semibold tabular-nums text-honey">{step.number}</span>
                  {i < process.length - 1 ? (
                    <span aria-hidden="true" className="hidden h-px flex-1 bg-honey/50 lg:block" />
                  ) : null}
                </div>
                <h3 className="mt-4 font-sans text-2xl font-semibold lg:mt-6">{step.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-paper/80">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

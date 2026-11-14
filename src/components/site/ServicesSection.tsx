import { services, servicesIntro } from "@/data/portfolio";
import { goToAnchor } from "@/lib/smoothScroll";
import { Reveal, RiseText } from "./primitives";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
const LABEL = "font-sans text-xs font-semibold uppercase tracking-[0.16em] text-honey";

/** Four ruled offers on ink-deep: numeral, title, then what you get / good fit / what to expect. */
export function ServicesSection() {
  return (
    <section id="services" data-nav-tone="dark" className="relative bg-ink-deep text-paper">
      <div className="mx-auto max-w-[100rem] px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
          <p className="eyebrow text-honey md:col-span-2">Services</p>
          <div className="md:col-span-10">
            <h2 className="font-display text-[clamp(2.25rem,5vw,5.5rem)] font-medium leading-[1.04] tracking-tight">
              <RiseText text={servicesIntro.heading} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/80">{servicesIntro.sub}</p>
            </Reveal>
          </div>
        </div>

        <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          {services.map((service, i) => (
            <li key={service.title}>
              <Reveal delay={(i % 2) * 0.08} className="h-full">
                <article className="group h-full border border-paper/15 border-t-honey p-6 transition-colors duration-300 hover:border-honey/60 hover:border-t-honey md:p-8">
                  <p className="font-display text-5xl font-medium leading-none text-honey" aria-hidden="true">
                    {ROMAN[i]}
                  </p>
                  <h3 className="mt-6 font-sans text-2xl font-semibold leading-tight">{service.title}</h3>
                  <p className="mt-2 text-lg text-paper/80">{service.line}</p>

                  <div className="mt-8 border-t border-paper/15 pt-5">
                    <h4 className={LABEL}>What you get</h4>
                    <ul className="mt-3 space-y-2 text-paper/80">
                      {service.deliver.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-honey" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 grid gap-6 border-t border-paper/15 pt-5 sm:grid-cols-2">
                    <div>
                      <h4 className={LABEL}>Good fit if</h4>
                      <p className="mt-3 text-paper/80">{service.solves}</p>
                    </div>
                    <div>
                      <h4 className={LABEL}>What to expect</h4>
                      <p className="mt-3 text-paper/80">{service.expect}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10 flex flex-col gap-3 border-t border-paper/25 pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-14">
          <p className="font-sans text-xl font-semibold">{servicesIntro.cta.prompt}</p>
          <a
            href={servicesIntro.cta.href}
            onClick={(e) => goToAnchor(e, servicesIntro.cta.href)}
            className="inline-flex min-h-[44px] items-center gap-2 font-sans text-lg font-semibold text-honey underline decoration-honey/40 underline-offset-8 transition-colors hover:decoration-honey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep"
          >
            {servicesIntro.cta.label} <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

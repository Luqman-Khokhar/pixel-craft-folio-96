import { ArrowUp, ArrowUpRight } from "lucide-react";
import { contact, identity } from "@/data/portfolio";
import { scrollToY } from "@/lib/smoothScroll";
import { ContactForm } from "./ContactForm";
import { Crest } from "./Crest";
import { Reveal, RiseText, Roll, useClock } from "./primitives";

const ROW = "group flex items-center justify-between gap-4 border-b border-paper/20 py-4 transition-colors hover:border-honey";

function InfoRow({ label, value, href, external }: { label: string; value: string; href?: string; external?: boolean }) {
  const body = (
    <>
      <span className="eyebrow shrink-0 text-paper/70">{label}</span>
      <span className="flex min-w-0 items-center gap-2 break-words text-right text-base font-medium sm:text-lg">
        {value}
        {href && <ArrowUpRight className="h-4 w-4 shrink-0 text-honey transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />}
      </span>
    </>
  );
  if (!href) return <div className={ROW}>{body}</div>;
  return <a href={href} className={ROW} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{body}</a>;
}

export function ContactFinale() {
  const time = useClock(identity.timeZone);
  return (
    <>
      <section id="contact" className="sheet-edge relative -mt-10 bg-ink pt-20 md:-mt-16 md:pt-32">
        <div className="mx-auto max-w-[100rem] px-4 sm:px-6">
          <h2 className="font-display text-[27vw] font-bold leading-[0.84] text-paper md:whitespace-nowrap md:text-[min(16.2vw,19rem)]">
            <RiseText text={contact.heading} />
          </h2>

          <div className="mt-14 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-10">
            <Reveal className="md:col-span-5">
              <p className="text-xl leading-relaxed md:text-2xl">{contact.intro}</p>
              <div className="mt-10 border-t border-paper/20">
                <InfoRow label="Email" value={identity.email} href={`mailto:${identity.email}`} />
                <InfoRow label="Phone" value={identity.phone} href={identity.phoneHref} />
                <InfoRow label="Location" value={`${identity.location} · ${time} ${identity.timeZoneLabel}`} />
                <InfoRow label="GitHub" value="Luqman-Khokhar" href={identity.github} external />
                <InfoRow label="LinkedIn" value="mluqmangn" href={identity.linkedin} external />
              </div>
              <p className="mt-10 font-display text-4xl font-medium leading-none text-honey">{contact.connect}</p>
              <p className="mt-3 max-w-md leading-relaxed text-paper/85">{contact.connectBody}</p>
            </Reveal>

            <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>

        <footer className="mx-auto mt-24 flex max-w-[100rem] flex-col items-start justify-between gap-5 border-t border-paper/20 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3">
            <Crest className="h-14 w-auto shrink-0 text-honey" />
            <p className="text-sm text-paper/80">© {new Date().getFullYear()} {identity.fullName}. All rights reserved.</p>
          </div>
          <button type="button" onClick={() => scrollToY(0)} className="flex items-center gap-2 text-sm font-semibold">
            <Roll>Back to top</Roll>
            <ArrowUp className="h-4 w-4 text-honey" aria-hidden="true" />
          </button>
        </footer>
      </section>
    </>
  );
}

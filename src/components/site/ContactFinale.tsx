import { ArrowUp, ArrowUpRight } from "lucide-react";
import { contact, identity } from "@/data/portfolio";
import { scrollToY } from "@/lib/smoothScroll";
import { ContactForm } from "./ContactForm";
import { Crest } from "./Crest";
import { Reveal, RiseText, Roll, useClock } from "./primitives";

const ROW = "group flex min-h-14 items-center justify-between gap-4 border-b border-paper/20 py-3 transition-colors hover:border-honey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey";

function InfoRow({ label, value, note, href, external }: { label: string; value: string; note?: string; href?: string; external?: boolean }) {
  const body = (
    <>
      <span className="eyebrow shrink-0 text-paper/70">{label}</span>
      <span className="flex min-w-0 flex-col items-end text-right">
        <span className="flex min-w-0 items-center gap-2 break-words text-base font-medium sm:text-lg">
          {value}
          {href && <ArrowUpRight className="h-4 w-4 shrink-0 text-honey transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />}
        </span>
        {note && <span className="text-sm text-paper/70">{note}</span>}
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
      <section id="contact" className="sheet-edge relative -mt-10 bg-ink-deep pt-24 md:-mt-16 md:pt-32">
        <div className="mx-auto max-w-[100rem] px-4 sm:px-6">
          <h2 className="max-w-[18ch] font-display text-[clamp(2.5rem,10.5vw,3.75rem)] font-bold leading-[0.95] text-paper md:max-w-none md:text-[clamp(4rem,7.6vw,8rem)]">
            <RiseText text={contact.heading} />
          </h2>

          <div className="mt-12 grid gap-14 md:mt-16 md:grid-cols-12 md:gap-10">
            <Reveal className="md:col-span-5">
              <p className="text-xl leading-relaxed md:text-2xl">{contact.intro}</p>
              <p className="mt-4 leading-relaxed text-paper/80">{contact.helper}</p>
              <div className="mt-10 border-t border-paper/20">
                <InfoRow label="Email" value={identity.email} href={`mailto:${identity.email}`} />
                <InfoRow label="Phone" value={identity.phone} href={identity.phoneHref} />
                <InfoRow label="Location" value={`${identity.location} · ${time} ${identity.timeZoneLabel}`} note={identity.availability} />
                <InfoRow label="GitHub" value="Luqman-Khokhar" href={identity.github} external />
                <InfoRow label="LinkedIn" value="mluqmangn" href={identity.linkedin} external />
                <InfoRow label="Resume" value="Download CV" href={identity.cv} external />
              </div>
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
          <button type="button" onClick={() => scrollToY(0)} className="flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey">
            <Roll>Back to top</Roll>
            <ArrowUp className="h-4 w-4 text-honey" aria-hidden="true" />
          </button>
        </footer>
      </section>
    </>
  );
}

import { Check } from "lucide-react";
import { platformLabel, type Project } from "@/data/portfolio";
import { FoilPlate } from "./foil";
import { ContextBadge, ProjectLinks } from "./ProjectDetails";
import { PLATFORM_ICONS } from "./platformIcons";
import { coverSources } from "./projectMedia";
import { Reveal } from "./primitives";

const SIZES = "(min-width: 1024px) 56vw, 100vw";
const label = "text-xs font-semibold uppercase tracking-[0.12em] text-ink/70";

/** One featured case study: cover on a foil plate beside the problem, solution, my role, features and outcome. Alternates sides at lg. */
export function CaseStudy({ project, index, flip, eager }: { project: Project; index: number; flip: boolean; eager?: boolean }) {
  const f = project.featured;
  const icons = PLATFORM_ICONS[project.platform];
  if (!f) return null;

  return (
    <article aria-labelledby={`case-${index}-title`} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-x-12">
      <Reveal className={`min-w-0 lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <FoilPlate className="foil-shadow">
          <div className="plate-window relative aspect-[16/10] overflow-hidden bg-ink">
            <img
              {...coverSources(project.cover)}
              sizes={SIZES}
              alt={project.coverAlt}
              width={1600}
              height={1000}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
        </FoilPlate>
      </Reveal>

      <Reveal delay={0.08} className={`min-w-0 lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-ink/80">
          <span className="tabular-nums text-honey-ink">{String(index + 1).padStart(2, "0")}</span>
          <ContextBadge>{project.context}</ContextBadge>
        </p>
        <h3 id={`case-${index}-title`} className="mt-4 font-display text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.02em] [text-wrap:balance]">
          {project.title}
        </h3>
        <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.9375rem] font-medium text-ink/80">
          <span className="inline-flex items-center gap-1.5 text-ink">
            {icons.map((Icon, i) => (
              <Icon key={i} aria-hidden="true" strokeWidth={1.75} className="h-4 w-4 text-honey-ink" />
            ))}
            {platformLabel[project.platform]}
          </span>
          <span aria-hidden="true" className="text-ink/35">
            ·
          </span>
          <span>{project.type}</span>
        </p>

        <dl className="mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-ink/90">
          <div>
            <dt className={label}>Problem</dt>
            <dd className="mt-1.5">{f.problem}</dd>
          </div>
          <div>
            <dt className={label}>Solution</dt>
            <dd className="mt-1.5">{f.solution}</dd>
          </div>
          {project.contribution && (
            <div>
              <dt className={label}>My role</dt>
              <dd className="mt-1.5">{project.contribution}</dd>
            </div>
          )}
          <div>
            <dt className={label}>Key features</dt>
            <dd className="mt-1.5">
              <ul className="list-disc space-y-1 pl-5 text-[1rem] marker:text-honey-ink">
                {project.features.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <p className="mt-6 flex items-start gap-2 text-[1.0625rem] font-semibold leading-snug text-honey-ink">
          <Check aria-hidden="true" strokeWidth={2.25} className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            <span className="sr-only">Outcome: </span>
            {f.outcome}
          </span>
        </p>

        <div className="mt-6">
          <h4 className={label}>Built with</h4>
          <ul className="mt-1.5 flex flex-wrap gap-x-3.5 gap-y-1 text-[0.9375rem] leading-snug text-ink/90">
            {project.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <ProjectLinks project={project} className="mt-6" />
      </Reveal>
    </article>
  );
}

/** The projects that get a full write-up, one editorial row each. */
export function FeaturedWork({ items }: { items: Project[] }) {
  return (
    <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
      {items.map((p, i) => (
        <CaseStudy key={p.title} project={p} index={i} flip={i % 2 === 1} eager={false} />
      ))}
    </div>
  );
}

import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { platformLabel, projectLinks, type Project } from "@/data/portfolio";
import { PLATFORM_ICONS } from "./platformIcons";

/** Each line of a sheet rises in after the one above it. */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

/** Where a project can be seen: store and site buttons, ink on paper. */
export function ProjectLinks({ project, className = "" }: { project: Project; className?: string }) {
  const links = projectLinks(project);
  if (links.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {links.map((link, i) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.9375rem] font-semibold transition-[background-color,transform] duration-150 ease-out focus-visible:outline-ink active:scale-[0.97] ${
              i === 0 ? "bg-ink text-paper [@media(hover:hover)]:hover:bg-ink-deep" : "bg-ink/[0.07] text-ink [@media(hover:hover)]:hover:bg-ink/[0.14]"
            }`}
          >
            {link.label}
            <span className="sr-only"> for {project.title} (opens in a new tab)</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Who the work was for, and whether it was a team or solo job. */
export function ContextBadge({ children }: { children: string }) {
  return <span className="eyebrow inline-block rounded-full border border-ink/25 px-3 py-1 text-[0.6875rem] leading-snug text-ink/80">{children}</span>;
}

/**
 * What a project is, what I did on it, what it was built with and where to see it, printed on a plate.
 * `stage` carries its own title; in a `panel` the row above it already names the project.
 */
export function ProjectDetails({ project, variant }: { project: Project; variant: "stage" | "panel" }) {
  const icons = PLATFORM_ICONS[project.platform];
  const stage = variant === "stage";
  const hasLinks = projectLinks(project).length > 0;

  return (
    <div className="flex h-full flex-col text-ink">
      {stage && (
        <div className="detail-rise flex items-center justify-between gap-4" style={step(0)}>
          <h4 className="min-w-0 font-display text-[clamp(1.875rem,2.5vw,2.75rem)] font-bold leading-[0.95] tracking-[-0.01em] [text-wrap:balance]">{project.title}</h4>
          <img src={project.logo} alt="" width={160} height={160} loading="lazy" decoding="async" draggable={false} className="h-10 w-auto max-w-[6.5rem] shrink-0 object-contain" />
        </div>
      )}

      {/* On a phone the type gets its own line; a separator left hanging at a line end reads as a typo. */}
      <p className={`detail-rise flex gap-x-2.5 gap-y-1 text-[0.9375rem] font-medium leading-snug text-ink/80 ${stage ? "mt-3 flex-wrap items-center" : "flex-col items-start"}`} style={step(1)}>
        <span className="inline-flex items-center gap-1.5 text-ink">
          {icons.map((Icon, i) => (
            <Icon key={i} aria-hidden="true" strokeWidth={1.75} className="h-4 w-4 text-honey-ink" />
          ))}
          {platformLabel[project.platform]}
        </span>
        {stage && (
          <span aria-hidden="true" className="text-ink/35">
            ·
          </span>
        )}
        <span>{project.type}</span>
      </p>

      <div className="detail-rise mt-3" style={step(2)}>
        <ContextBadge>{project.context}</ContextBadge>
      </div>

      <p className="detail-rise mt-3 max-w-[44rem] text-[1.0625rem] leading-relaxed text-ink/90" style={step(3)}>
        {project.description}
      </p>

      {project.contribution && (
        <div className="detail-rise mt-4 max-w-[44rem]" style={step(4)}>
          <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/70">My role</h5>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink/90">{project.contribution}</p>
        </div>
      )}

      <div className="detail-rise mt-4 max-w-[44rem]" style={step(5)}>
        <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/70">Key features</h5>
        <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[0.9375rem] leading-snug text-ink/90 marker:text-honey-ink">
          {project.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      {/* On the stage the footer sits on the plate's lower edge, so links stay put from one project to the next. */}
      <div className={`detail-rise flex flex-wrap gap-x-8 gap-y-5 ${stage ? "mt-auto items-end justify-between pt-5" : "mt-5 flex-col"}`} style={step(6)}>
        <div className="min-w-0 max-w-[30rem]">
          <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/70">Built with</h5>
          <ul className="mt-1.5 flex flex-wrap gap-x-3.5 gap-y-1 text-[0.9375rem] leading-snug text-ink/90">
            {project.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          {hasLinks && <ProjectLinks project={project} />}
          {project.note && <p className="max-w-[24rem] text-[0.9375rem] font-medium text-ink/80">{project.note}</p>}
        </div>
      </div>
    </div>
  );
}

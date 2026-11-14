import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { platformLabel, projectLinks, type Project } from "@/data/portfolio";
import { PLATFORM_ICONS } from "./platformIcons";

/** Each line of a sheet rises in after the one above it. */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * What a project is, what it was built with and where to see it, printed on a plate.
 * `stage` carries its own title; in a `panel` the row above it already names the project.
 */
export function ProjectDetails({ project, variant }: { project: Project; variant: "stage" | "panel" }) {
  const links = projectLinks(project);
  const icons = PLATFORM_ICONS[project.platform];
  const stage = variant === "stage";

  return (
    <div className="flex h-full flex-col text-ink">
      {stage && (
        <div className="detail-rise flex items-center justify-between gap-4" style={step(0)}>
          <h3 className="min-w-0 font-display text-[clamp(1.875rem,2.5vw,2.75rem)] font-bold leading-[0.95] tracking-[-0.01em] [text-wrap:balance]">{project.title}</h3>
          <img src={project.logo} alt="" width={160} height={160} loading="lazy" decoding="async" draggable={false} className="h-10 w-auto max-w-[6.5rem] shrink-0 object-contain" />
        </div>
      )}

      {/* On a phone the type gets its own line; a separator left hanging at a line end reads as a typo. */}
      <p className={`detail-rise flex gap-x-2.5 gap-y-1 text-[0.9375rem] font-medium leading-snug text-ink/75 ${stage ? "mt-3 flex-wrap items-center" : "flex-col items-start"}`} style={step(1)}>
        <span className="inline-flex items-center gap-1.5 text-ink">
          {icons.map((Icon, i) => (
            <Icon key={i} aria-hidden="true" strokeWidth={1.75} className="h-4 w-4 text-honey-deep" />
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

      <p className="detail-rise mt-3 max-w-[44rem] text-[1.0625rem] leading-relaxed text-ink/90" style={step(2)}>
        {project.description}
      </p>

      {/* On the stage the footer sits on the plate's lower edge, so links stay put from one project to the next. */}
      <div className={`detail-rise flex flex-wrap gap-x-8 gap-y-5 ${stage ? "mt-auto items-end justify-between pt-5" : "mt-5 flex-col"}`} style={step(3)}>
        <div className="min-w-0 max-w-[30rem]">
          <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">Built with</h4>
          <ul className="mt-1.5 flex flex-wrap gap-x-3.5 gap-y-1 text-[0.9375rem] leading-snug text-ink/85">
            {project.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>

        {links.length > 0 ? (
          <ul className="flex flex-wrap gap-2.5">
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
        ) : (
          <p className="text-[0.9375rem] text-ink/70">Private build, no public link yet.</p>
        )}
      </div>
    </div>
  );
}

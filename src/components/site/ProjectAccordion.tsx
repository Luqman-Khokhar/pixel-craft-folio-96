import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Plus } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { scrollToY } from "@/lib/smoothScroll";
import { FoilPlate } from "./foil";
import { ProjectDetails } from "./ProjectDetails";
import { coverSources } from "./projectMedia";
import { PLATFORM_ICONS } from "./platformIcons";
import { EASE_OUT } from "./primitives";

// Clear of the fixed nav when a row is brought back into view.
const NAV_CLEARANCE = 88;
const OPEN_MS = 340;

/** Phones: every project name stays in view, and the open one unfolds into its plate right under its row. */
export function ProjectAccordion({ items, rise }: { items: Project[]; rise: Variants }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const rows = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);
    if (next === null) return;
    // A plate closing above can lift the new row off the top of the screen; bring it back once things settle.
    window.setTimeout(() => {
      const row = rows.current[next];
      if (!row) return;
      const top = row.getBoundingClientRect().top;
      if (top < NAV_CLEARANCE) scrollToY(window.scrollY + top - NAV_CLEARANCE);
    }, reduce ? 0 : OPEN_MS + 20);
  };

  return (
    <ul className="mt-2 border-t border-paper/15">
      {items.map((p, i) => {
        const on = open === i;
        const icons = PLATFORM_ICONS[p.platform];
        return (
          <motion.li key={p.title} variants={rise} className="border-b border-paper/15">
            <h4>
              <button
                ref={(el) => {
                  rows.current[i] = el;
                }}
                type="button"
                id={`project-row-${i}`}
                aria-expanded={on}
                aria-controls={`project-panel-${i}`}
                onClick={() => toggle(i)}
                className="grid min-h-[3.75rem] w-full grid-cols-[1.75rem_minmax(0,1fr)_auto_1.25rem] items-center gap-x-3 py-3 text-left transition-transform duration-150 ease-out active:scale-[0.99]"
              >
                <span className={`text-sm font-medium tabular-nums transition-colors duration-200 ${on ? "text-honey" : "text-paper/55"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`font-display text-[1.75rem] font-bold leading-[1.05] tracking-[-0.01em] transition-colors duration-200 ${on ? "text-paper" : "text-paper/75"}`}>{p.title}</span>
                <span className={`flex items-center gap-1 transition-colors duration-200 ${on ? "text-honey" : "text-paper/50"}`}>
                  {icons.map((Icon, n) => (
                    <Icon key={n} aria-hidden="true" strokeWidth={1.75} className="h-4 w-4" />
                  ))}
                </span>
                <Plus aria-hidden="true" strokeWidth={1.75} className={`h-5 w-5 transition-transform duration-300 ease-out ${on ? "rotate-45 text-honey" : "text-paper/60"}`} />
              </button>
            </h4>

            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={`project-panel-${i}`}
                  role="region"
                  aria-labelledby={`project-row-${i}`}
                  className="overflow-hidden"
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0.12 } : { height: { duration: OPEN_MS / 1000, ease: EASE_OUT }, opacity: { duration: 0.24, ease: "easeOut" } }}
                >
                  <div className="pb-6 pt-1">
                    <FoilPlate>
                      <div className="plate-window relative aspect-[16/10] overflow-hidden bg-ink">
                        <img
                          {...coverSources(p.cover)}
                          sizes="calc(100vw - 2rem)"
                          alt={p.coverAlt}
                          width={1600}
                          height={1000}
                          loading={i === 0 ? "lazy" : "eager"}
                          decoding="async"
                          draggable={false}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div data-on="true" className="mt-[calc(var(--u)*1rem)]">
                        <ProjectDetails project={p} variant="panel" />
                      </div>
                    </FoilPlate>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}

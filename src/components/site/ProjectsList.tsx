import { useState } from "react";
import { platformLabel, projects } from "@/data/portfolio";
import { ProjectCase } from "./ProjectCase";

/** Static project list for reduced-motion visitors. */
export function ProjectsList() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-[100rem] px-4 py-24 sm:px-6">
      <h2 className="eyebrow mb-8 text-honey">Selected Work</h2>
      <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
        {projects.map((p, i) => (
          <li key={p.title}>
            <button type="button" onClick={() => setOpen(i)} className="block w-full text-left">
              <img src={p.cover} alt={p.coverAlt} width={1600} height={1000} loading="lazy" className="aspect-[16/10] w-full rounded-xl object-cover" />
              <span className="mt-4 block font-display text-5xl font-medium leading-none">{p.title}</span>
              <span className="mt-2 block text-paper/85">{p.type} · {platformLabel[p.platform]}</span>
            </button>
          </li>
        ))}
      </ul>
      <ProjectCase project={open === null ? null : projects[open]} index={open ?? 0} total={projects.length} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </div>
  );
}

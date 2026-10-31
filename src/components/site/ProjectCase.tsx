import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { platformLabel, type Project } from "@/data/portfolio";
import { EASE, Roll } from "./primitives";

function CaseLink({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0 ${primary ? "bg-honey text-ink" : "border border-paper/40"}`}
    >
      <Roll>{label}</Roll>
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

/** Project detail: a sheet wiping in from the right, closed by Esc, the X or the backdrop. */
export function ProjectCase({ project, index, total, onClose }: { project: Project | null; index: number; total: number; onClose: () => void }) {
  return (
    <Dialog.Root open={!!project} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div className="fixed inset-0 z-[70] bg-ink-deep/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            className="fixed inset-y-0 right-0 z-[71] w-full max-w-3xl overflow-y-auto bg-ink text-paper"
            initial={{ clipPath: "inset(0 0 0 100%)" }}
            animate={{ clipPath: "inset(0 0 0 0%)" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {project && (
              <>
                <Dialog.Close aria-label="Close project" className="fixed right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-paper text-ink transition-transform hover:rotate-90">
                  <X className="h-5 w-5" aria-hidden="true" />
                </Dialog.Close>
                <img src={project.cover} alt={project.coverAlt} width={1600} height={1000} className="aspect-[16/10] w-full object-cover" />
                <div className="space-y-6 p-5 sm:p-10">
                  <p className="eyebrow text-honey">
                    N°{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {platformLabel[project.platform]}
                  </p>
                  <Dialog.Title className="font-serif text-[clamp(3rem,9vw,6rem)] font-medium leading-[0.95] tracking-tight">{project.title}</Dialog.Title>
                  <p className="text-lg font-medium text-paper/90">{project.type}</p>
                  <Dialog.Description className="max-w-2xl text-base leading-relaxed text-paper/80 sm:text-lg">{project.description}</Dialog.Description>
                  <ul aria-label="Technology" className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <li key={t} className="rounded-full border border-paper/25 px-3 py-1 font-mono text-xs">{t}</li>
                    ))}
                  </ul>
                  {(project.demo || project.company) && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {project.demo && <CaseLink href={project.demo} label="View Live" primary />}
                      {project.company && <CaseLink href={project.company} label="Company Site" primary={!project.demo} />}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

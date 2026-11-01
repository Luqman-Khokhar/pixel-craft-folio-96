import { useRef, type KeyboardEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { platformLabel, type CaseSheet } from "@/data/portfolio";
import { EASE_OUT, EASE_WIPE, Roll } from "./primitives";

const pad = (n: number) => String(n).padStart(2, "0");

function CaseLink({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-[transform,background-color,color] hover:-translate-y-0.5 active:translate-y-0 ${primary ? "bg-ink text-paper hover:bg-honey hover:text-ink" : "border border-ink/30 hover:border-ink"}`}
    >
      <Roll>{label}</Roll>
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

const IconButton = "grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper";

const list = { hidden: {}, shown: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } };
const rise = { hidden: { opacity: 0, y: 26 }, shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } } };

interface ProjectCaseProps {
  project: CaseSheet | null;
  index: number;
  total: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

/** Project detail: a bottom sheet closed by Esc, the X, the backdrop, or dragging its handle down. */
export function ProjectCase({ project, index, total, onClose, onNavigate }: ProjectCaseProps) {
  const reduce = useReducedMotion();
  const drag = useDragControls();
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const step = (by: number) => onNavigate?.((index + by + total) % total);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  return (
    <Dialog.Root open={!!project} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {project && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 z-[70] bg-ink-deep/65 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.5 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              forceMount
              asChild
              onKeyDown={onKeyDown}
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
                closeRef.current?.focus();
              }}
              onCloseAutoFocus={(e) => {
                // There is no Dialog.Trigger here, so hand focus back to whatever opened the sheet.
                e.preventDefault();
                opener.current?.focus({ preventScroll: true });
              }}
            >
              <motion.div
                className="fixed inset-x-0 bottom-0 z-[71] sheet-edge flex h-[90svh] flex-col overflow-hidden bg-paper text-ink md:h-auto md:max-h-[92svh]"
                initial={reduce ? { opacity: 0 } : { y: "100%" }}
                animate={reduce ? { opacity: 1 } : { y: 0 }}
                exit={reduce ? { opacity: 0 } : { y: "100%" }}
                transition={reduce ? { duration: 0 } : { duration: 0.85, ease: EASE_WIPE }}
                drag={reduce ? false : "y"}
                dragControls={drag}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.7 }}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 110 || info.velocity.y > 700) onClose();
                }}
              >
                <div
                  aria-hidden="true"
                  onPointerDown={(e) => drag.start(e)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex shrink-0 cursor-grab touch-none select-none justify-center pb-2 pt-3 active:cursor-grabbing"
                >
                  <span className="h-1 w-12 rounded-full bg-ink/25" />
                </div>

                <div className="mx-auto flex w-full max-w-[90rem] shrink-0 items-center justify-between gap-4 px-4 pb-4 sm:px-8">
                  <p className="eyebrow flex items-center gap-2 text-ink/75">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-honey" />
                    N°{pad(index + 1)} / {pad(total)}
                  </p>
                  <div className="flex items-center gap-2">
                    {onNavigate && (
                      <>
                        <button type="button" aria-label="Previous project" onClick={() => step(-1)} className={IconButton}>
                          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button type="button" aria-label="Next project" onClick={() => step(1)} className={IconButton}>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </>
                    )}
                    <Dialog.Close ref={closeRef} aria-label="Close project" className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper transition-transform hover:rotate-90">
                      <X className="h-5 w-5" aria-hidden="true" />
                    </Dialog.Close>
                  </div>
                </div>

                <motion.div
                  key={project.title}
                  variants={list}
                  initial={reduce ? false : "hidden"}
                  animate="shown"
                  className={`mx-auto grid w-full max-w-[90rem] flex-1 auto-rows-max items-start gap-6 overflow-y-auto overscroll-contain px-4 pb-8 sm:px-8 md:gap-12 md:pb-10 ${project.cover ? "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]" : ""}`}
                >
                  {project.cover && (
                    <motion.div
                      className="overflow-hidden rounded-2xl bg-ink"
                      initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
                      animate={{ clipPath: "inset(0% 0 0 0)" }}
                      transition={{ duration: 1.1, delay: 0.15, ease: EASE_WIPE }}
                    >
                      <motion.img
                        src={project.cover}
                        alt={project.coverAlt}
                        width={1600}
                        height={1000}
                        className="aspect-[16/10] w-full object-cover"
                        initial={reduce ? false : { scale: 1.12 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, delay: 0.15, ease: EASE_OUT }}
                      />
                    </motion.div>
                  )}

                  <div className="min-w-0">
                    <motion.div variants={rise}>
                      <Dialog.Title className="font-display text-[clamp(2.75rem,5vw,5rem)] font-bold leading-[0.98] tracking-tight">{project.title}</Dialog.Title>
                    </motion.div>
                    <motion.div variants={rise}>
                      <Dialog.Description className="mt-4 max-w-xl text-base leading-relaxed text-ink/80 lg:text-lg">{project.description}</Dialog.Description>
                    </motion.div>

                    <motion.dl variants={rise} className="mt-6 border-t border-ink/15 text-sm">
                      <div className="grid grid-cols-[6rem_1fr] gap-3 border-b border-ink/15 py-3">
                        <dt className="eyebrow !text-[0.65rem] leading-5 text-ink/70">Category</dt>
                        <dd className="font-medium">{project.type}</dd>
                      </div>
                      <div className="grid grid-cols-[6rem_1fr] gap-3 border-b border-ink/15 py-3">
                        <dt className="eyebrow !text-[0.65rem] leading-5 text-ink/70">Platform</dt>
                        <dd className="font-medium">{platformLabel[project.platform]}</dd>
                      </div>
                      <div className="grid grid-cols-[6rem_1fr] gap-3 border-b border-ink/15 py-3">
                        <dt className="eyebrow !text-[0.65rem] leading-5 text-ink/70">{project.techLabel ?? "Built with"}</dt>
                        <dd>
                          <ul className="flex flex-wrap gap-1.5">
                            {project.tech.map((t) => (
                              <li key={t} className="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-xs">{t}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </motion.dl>

                    <motion.div variants={rise} className="mt-6">
                      {project.demo || project.company || project.links ? (
                        <div className="flex flex-wrap gap-3">
                          {project.demo && <CaseLink href={project.demo} label="View Live" primary />}
                          {project.company && <CaseLink href={project.company} label="Company Site" primary={!project.demo} />}
                          {project.links?.map((link, i) => <CaseLink key={link.href} href={link.href} label={link.label} primary={i === 0} />)}
                        </div>
                      ) : (
                        <p className="text-sm text-ink/70">No public link available for this project.</p>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

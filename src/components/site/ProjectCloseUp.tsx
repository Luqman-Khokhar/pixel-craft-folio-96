import { useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { platformLabel, type CaseSheet, type TableCard } from "@/data/portfolio";
import { CardFace } from "./DeckCard";
import { PLATFORM_ICONS } from "./platformIcons";

/** Where a card lies on the table, in screen terms: its centre, its flat width and its turn. */
export interface CardOrigin {
  cx: number;
  cy: number;
  width: number;
  rotate: number;
}

interface ProjectCloseUpProps {
  cards: TableCard[];
  index: number | null;
  originOf: (index: number) => CardOrigin | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// The iOS drawer curve: a quick start that settles long, for a card carried across the screen.
const EASE_CARRY = [0.32, 0.72, 0, 1] as const;
const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

const linksOf = (sheet: CaseSheet) => [
  ...(sheet.demo ? [{ href: sheet.demo, label: sheet.demo.includes("play.google.com") ? "Open on Google Play" : "Visit live site" }] : []),
  ...(sheet.company ? [{ href: sheet.company, label: "Company site" }] : []),
  ...(sheet.links ?? []),
];

/** Project detail as a close-up: the card is lifted off the table into the hand, its details laid out beside it, and put back where it came from on close. */
export function ProjectCloseUp({ cards, index, originOf, onClose, onNavigate }: ProjectCloseUpProps) {
  const close = useRef<() => void>(() => onClose());
  return (
    <Dialog.Root open={index !== null} onOpenChange={(open) => !open && close.current()}>
      {index !== null && (
        <Dialog.Portal forceMount>
          <CloseUp cards={cards} index={index} originOf={originOf} onClose={onClose} onNavigate={onNavigate} registerClose={(fn) => (close.current = fn)} />
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

interface CloseUpProps extends Omit<ProjectCloseUpProps, "index"> {
  index: number;
  registerClose: (fn: () => void) => void;
}

function CloseUp({ cards, index, originOf, onClose, onNavigate, registerClose }: CloseUpProps) {
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const hand = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const leaving = useRef(false);
  const [dir, setDir] = useState(0);
  const card = cards[index];
  const sheet = card.sheet;
  const total = cards.length;
  const prev = cards[(index - 1 + total) % total];
  const next = cards[(index + 1) % total];
  const icons = sheet.cover ? PLATFORM_ICONS[sheet.platform] : [];
  const links = linksOf(sheet);

  // Lifted from its place on the table: start exactly over the table card, then carry it into the hand.
  useLayoutEffect(() => {
    const el = hand.current;
    const from = originOf(index);
    animate("[data-backdrop]", { opacity: [0, 1] }, { duration: reduce ? 0.15 : 0.3, ease: "easeOut" });
    if (!el || !from || reduce) {
      if (el) animate(el, { opacity: [0, 1] }, { duration: 0.2 });
      return;
    }
    const to = el.getBoundingClientRect();
    animate(
      el,
      {
        x: [from.cx - (to.left + to.width / 2), 0],
        y: [from.cy - (to.top + to.height / 2), 0],
        scale: [from.width / to.width, 1],
        rotate: [from.rotate, 0],
      },
      { duration: 0.5, ease: EASE_CARRY },
    );
    // The first card in hand is the one that was picked; later swaps are not lifts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Put back: carried to wherever its card now lies, then the dialog goes.
  registerClose(async () => {
    if (leaving.current) return;
    leaving.current = true;
    const el = hand.current;
    const to = originOf(index);
    animate("[data-backdrop]", { opacity: 0 }, { duration: 0.32, delay: 0.08, ease: "easeOut" });
    animate("[data-details]", { opacity: 0 }, { duration: 0.12, ease: "easeOut" });
    if (el && to && !reduce) {
      const at = el.getBoundingClientRect();
      await animate(
        el,
        { x: to.cx - (at.left + at.width / 2), y: to.cy - (at.top + at.height / 2), scale: to.width / at.width, rotate: to.rotate },
        { duration: 0.42, ease: EASE_CARRY },
      );
    } else if (el) {
      await animate(el, { opacity: 0 }, { duration: 0.15 });
    }
    onClose();
  });

  const go = (by: number) => {
    if (leaving.current) return;
    setDir(by);
    onNavigate((index + by + total) % total);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  // A click on the bare table around the close-up puts the card back.
  const onBackgroundClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) closeButton.current?.click();
  };

  const rise = reduce
    ? { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.2 } } }
    : { hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE_OUT_STRONG } } };

  return (
    <div ref={scope}>
      <Dialog.Overlay forceMount asChild>
        {/* Beside a wide close-up the table still shows faintly; on a phone the text runs over it, so the ground is solid. */}
        <div data-backdrop className="fixed inset-0 z-[70] bg-ink-deep opacity-0 md:bg-ink-deep/[0.95]" />
      </Dialog.Overlay>

      <Dialog.Content
        forceMount
        onKeyDown={onKeyDown}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          closeButton.current?.focus({ preventScroll: true });
        }}
        onCloseAutoFocus={(e) => {
          // No Dialog.Trigger: focus goes back to the card that was picked up.
          e.preventDefault();
          opener.current?.focus({ preventScroll: true });
        }}
        className="fixed inset-0 z-[71] overflow-y-auto overscroll-contain text-paper outline-none"
        onClick={onBackgroundClick}
      >
        <Dialog.Close
          ref={closeButton}
          aria-label="Put the card back"
          className="fixed right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-paper/10 text-paper transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] sm:right-6 sm:top-6 [@media(hover:hover)]:hover:bg-paper/20"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </Dialog.Close>

        <div
          className="mx-auto grid min-h-full max-w-[90rem] content-center gap-y-10 px-4 pb-14 pt-20 sm:px-6 md:grid-cols-12 md:gap-x-10 md:py-16"
          onClick={onBackgroundClick}
        >
          <div className="flex justify-center md:col-span-5 md:justify-end" onClick={onBackgroundClick}>
            <div ref={hand} className="deck-card relative aspect-[275/350] w-[min(58vw,32svh,15rem)] md:w-[min(34vw,59svh,30rem)]">
              <AnimatePresence initial={false} mode="popLayout" custom={dir}>
                <motion.div
                  key={card.title}
                  className="absolute inset-0"
                  custom={dir}
                  variants={{
                    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: `${d * 35}%`, rotate: d * 7 }),
                    center: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.32, ease: EASE_OUT_STRONG } },
                    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: `${-d * 35}%`, rotate: -d * 7, transition: { duration: 0.16, ease: EASE_OUT_STRONG } }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <CardFace card={card} focused />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div data-details className="min-w-0 md:col-span-6 md:col-start-7 md:self-center">
            <motion.div
              key={card.title}
              initial="hidden"
              animate="shown"
              // The first details arrive while the card is still being carried in; a swap starts them at once.
              variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.045, delayChildren: dir === 0 ? 0.2 : 0.04 } } }}
            >
              <motion.div variants={rise}>
                <Dialog.Title className="font-display text-[clamp(2.75rem,5.4vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.02em] [text-wrap:balance]">
                  {sheet.title}
                </Dialog.Title>
              </motion.div>

              <motion.p variants={rise} className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg leading-snug md:text-xl">
                {icons.length > 0 && (
                  <span className="flex items-center gap-2 font-medium text-honey">
                    {icons.map((Icon, i) => (
                      <Icon key={i} aria-hidden="true" strokeWidth={1.75} className="h-5 w-5" />
                    ))}
                    {platformLabel[sheet.platform]}
                  </span>
                )}
                {icons.length > 0 && <span aria-hidden="true" className="text-paper/40 max-sm:hidden">·</span>}
                <span className="text-paper/80 max-sm:basis-full">{sheet.type}</span>
              </motion.p>

              <motion.div variants={rise}>
                <Dialog.Description className="mt-6 max-w-[36rem] text-lg leading-relaxed text-paper/90 md:mt-8 md:text-xl">{sheet.description}</Dialog.Description>
              </motion.div>

              <motion.div variants={rise} className="mt-8 md:mt-10">
                <h3 className="text-base font-semibold text-paper">{sheet.techLabel ?? "Built with"}</h3>
                <ul className="mt-3 flex max-w-[38rem] flex-wrap gap-x-5 gap-y-1.5 text-base leading-relaxed text-paper/85 md:text-lg">
                  {sheet.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={rise} className="mt-8 md:mt-10">
                {links.length > 0 ? (
                  <ul className="flex flex-wrap gap-3">
                    {links.map((link, i) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex h-12 items-center gap-2 rounded-full px-6 text-[0.9375rem] font-semibold transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] ${
                            i === 0 ? "bg-honey text-ink [@media(hover:hover)]:hover:bg-paper" : "bg-paper/10 text-paper [@media(hover:hover)]:hover:bg-paper/20"
                          }`}
                        >
                          {link.label}
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-base text-paper/75">No public link for this one yet.</p>
                )}
              </motion.div>

              <motion.nav variants={rise} aria-label="Other projects" className="mt-12 flex items-stretch justify-between gap-4 md:mt-16">
                {[
                  { by: -1, target: prev, label: "Previous", Icon: ArrowLeft },
                  { by: 1, target: next, label: "Next", Icon: ArrowRight },
                ].map(({ by, target, label, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => go(by)}
                    aria-label={`${label}: ${target.sheet.title}`}
                    className={`group flex min-w-0 items-center gap-3 rounded-2xl py-2 transition-transform duration-150 ease-out active:scale-[0.97] ${by > 0 ? "flex-row-reverse text-right" : "text-left"}`}
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-paper/10 transition-colors duration-150 [@media(hover:hover)]:group-hover:bg-honey [@media(hover:hover)]:group-hover:text-ink">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-paper/65">{label}</span>
                      <span className="block truncate font-display text-xl font-bold leading-tight md:text-2xl">{target.sheet.title}</span>
                    </span>
                  </button>
                ))}
              </motion.nav>
            </motion.div>
          </div>
        </div>
      </Dialog.Content>
    </div>
  );
}

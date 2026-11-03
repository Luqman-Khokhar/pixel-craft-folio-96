import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { identity, navItems } from "@/data/portfolio";
import { scrollToHash } from "@/lib/smoothScroll";
import { Crest } from "./Crest";
import { EASE_OUT, NAV_TONE_EVENT } from "./primitives";

const DRAWER = [0.32, 0.72, 0, 1] as const;
/** Where a release velocity (px/s) would coast to: exponential decay, the way scroll deceleration projects. */
const project = (v: number, d = 0.998) => ((v / 1000) * d) / (1 - d);
const HOVER_FINE = "[@media(hover:hover)_and_(pointer:fine)]";

function useActiveSection() {
  const [active, setActive] = useState("#home");
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.45;
      for (const item of [...navItems].reverse()) {
        const el = document.querySelector(item.href);
        if (el && el.getBoundingClientRect().top <= mid) {
          setActive(item.href);
          return;
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return active;
}

/** Hides on scroll down, returns on scroll up. Small moves are ignored so the marks do not flicker. */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 8) setHidden(false);
      else if (Math.abs(y - last) >= 4) setHidden(y > last);
      else return;
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

const isLightSurface = (el: Element) => {
  const [r, g, b] = (getComputedStyle(el).backgroundColor.match(/[\d.]+/g) ?? ["0", "0", "0"]).map(Number);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 128;
};

/** True while a light surface sits behind the marks, where honey would wash out. */
function useOverLight(probeY: number) {
  const [over, setOver] = useState(false);
  useEffect(() => {
    const check = () => {
      const front = [...document.querySelectorAll<HTMLElement>("main section")].reverse().find((section) => {
        const box = section.getBoundingClientRect();
        return box.top <= probeY && box.bottom > probeY;
      });
      setOver(!!front && (front.dataset.navTone === "light" || isLightSurface(front)));
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    window.addEventListener(NAV_TONE_EVENT, check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      window.removeEventListener(NAV_TONE_EVENT, check);
    };
  }, [probeY]);
  return over;
}

export function SiteNav() {
  const active = useActiveSection();
  const hidden = useHideOnScroll();
  const overLight = useOverLight(48);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    // Wait for the menu's scroll lock to release before moving the page.
    window.setTimeout(() => scrollToHash(href), open ? 340 : 0);
  };

  const panelV: Variants = reduce
    ? { hidden: { opacity: 0, transition: { duration: 0.15 } }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : { hidden: { x: "100%", transition: { duration: 0.3, ease: DRAWER } }, show: { x: 0, transition: { type: "spring", bounce: 0, duration: 0.55 } } };
  const listV: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: 0.15 } } };
  const rowV: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { y: "110%", transition: { duration: 0.2, ease: DRAWER } }, show: { y: 0, transition: { duration: 0.6, ease: EASE_OUT } } };
  const lineV: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { scaleX: 0, transition: { duration: 0.2 } }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE_OUT } } };
  const footV: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 12, transition: { duration: 0.15 } },
    show: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5, ease: EASE_OUT } },
  };

  return (
    <>
      <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[61] h-0.5 origin-left bg-honey" style={{ scaleX: bar }} />
      <div className={`pointer-events-none fixed inset-x-0 top-0 ${open ? "z-[90]" : "z-[60]"} flex items-center justify-between px-4 pt-4 transition-[transform,color] duration-500 has-[:focus-visible]:translate-y-0 motion-reduce:transition-none sm:px-6 md:px-12 md:pt-6 ${overLight && !open ? "text-ink" : "text-honey"} ${hidden && !open ? "-translate-y-full" : ""}`}>
        <a href="#home" onClick={(e) => go(e, "#home")} aria-label="Muhammad Luqman Khokhar, back to top" aria-hidden={open || undefined} tabIndex={open ? -1 : undefined} className={`rounded-full transition-opacity duration-300 ${open ? "pointer-events-none opacity-0" : "pointer-events-auto"}`}>
          <Crest className="h-16 w-auto" />
        </a>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger data-nav-toggle aria-label={open ? "Close menu" : "Open menu"} className="group pointer-events-auto flex h-12 w-12 items-center justify-end rounded-full">
            {/* SVG bars antialias instead of snapping to device pixels, so browser zoom cannot leave one thinner. */}
            <svg aria-hidden="true" viewBox="0 0 32 14" className="h-3.5 w-8 overflow-visible fill-current">
              <rect width="32" height="2" className={`origin-center [transform-box:fill-box] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${open ? "translate-y-[6px] rotate-45" : "group-hover:-translate-y-0.5"}`} />
              <rect y="12" width="32" height="2" className={`origin-center [transform-box:fill-box] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${open ? "-translate-y-[6px] -rotate-45" : "group-hover:translate-y-0.5"}`} />
            </svg>
          </Dialog.Trigger>
          <AnimatePresence>
            {open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="fixed inset-0 z-[70] bg-ink/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />
                </Dialog.Overlay>
                <Dialog.Content
                  asChild
                  forceMount
                  aria-describedby={undefined}
                  onOpenAutoFocus={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).focus(); }}
                  // The toggle sits above the sheet; a press on it must close once, not dismiss then re-open.
                  onInteractOutside={(e) => { if ((e.target as Element | null)?.closest("[data-nav-toggle]")) e.preventDefault(); }}
                >
                  <motion.div
                    tabIndex={-1}
                    className="fixed inset-y-0 right-0 z-[80] flex w-[min(34rem,92vw)] flex-col overflow-hidden rounded-l-[2rem] border-l border-paper/10 bg-ink px-4 pb-4 pt-4 text-paper outline-none sm:px-6 md:px-12 md:pt-6"
                    variants={panelV}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    drag={reduce ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={{ left: 0.12, right: 1 }}
                    onDragEnd={(_, info) => { if (info.offset.x + project(info.velocity.x) > 140) setOpen(false); }}
                  >
                    <Dialog.Title className="sr-only">Menu</Dialog.Title>
                    <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-honey/15 blur-3xl" />
                    <div className="relative flex h-12 items-center">
                      <span className="eyebrow text-paper/50">Menu</span>
                    </div>
                    <motion.nav aria-label="Main" variants={listV} onPointerLeave={() => setHovered(null)} className="relative flex flex-1 flex-col justify-center">
                      {navItems.map((item, i) => {
                        const isActive = active === item.href;
                        const roll = `transition-transform duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${HOVER_FINE}:group-hover:-translate-y-full group-focus-visible:-translate-y-full`;
                        return (
                          <div key={item.href} className="relative">
                            <motion.span aria-hidden="true" variants={lineV} className="absolute inset-x-0 bottom-0 h-px origin-left bg-paper/20" />
                            <a
                              href={item.href}
                              onClick={(e) => go(e, item.href)}
                              onPointerEnter={(e) => { if (e.pointerType === "mouse") setHovered(i); }}
                              onFocus={() => setHovered(i)}
                              onBlur={() => setHovered(null)}
                              aria-current={isActive ? "true" : undefined}
                              className={`group flex items-center gap-4 py-3 font-display text-5xl font-medium leading-[1.1] tracking-tight outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-honey sm:text-6xl ${hovered !== null && hovered !== i ? "opacity-40" : ""}`}
                            >
                              <span className={`eyebrow w-8 shrink-0 transition-colors duration-300 ${isActive ? "text-honey" : "text-paper/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                              <span className="block overflow-hidden pb-[0.1em]">
                                <motion.span variants={rowV} className="block">
                                  <span className="relative block overflow-hidden">
                                    <span className={`block ${roll} ${isActive ? "text-honey" : ""}`}>{item.name}</span>
                                    <span aria-hidden="true" className={`absolute inset-x-0 top-full block text-honey ${roll}`}>{item.name}</span>
                                  </span>
                                </motion.span>
                              </span>
                              <span className="ml-auto flex items-center gap-3 text-honey">
                                {isActive && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-honey" />}
                                <ArrowUpRight aria-hidden="true" className={`h-7 w-7 -translate-x-3 opacity-0 transition-[transform,opacity] duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${HOVER_FINE}:group-hover:translate-x-0 ${HOVER_FINE}:group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100`} />
                              </span>
                            </a>
                          </div>
                        );
                      })}
                    </motion.nav>
                    <motion.div variants={footV} className="relative flex flex-wrap items-center gap-x-6 gap-y-1 pt-6">
                      {[
                        { label: "Resume", href: identity.cv, external: true },
                        { label: "Email", href: `mailto:${identity.email}`, external: false },
                        { label: "GitHub", href: identity.github, external: true },
                        { label: "LinkedIn", href: identity.linkedin, external: true },
                      ].map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className={`eyebrow py-2 text-paper/70 underline underline-offset-4 transition-colors ${HOVER_FINE}:hover:text-honey focus-visible:text-honey focus-visible:outline-none`}
                        >
                          {link.label}
                        </a>
                      ))}
                    </motion.div>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </div>
    </>
  );
}

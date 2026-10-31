import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { identity, navItems } from "@/data/portfolio";
import { scrollToHash } from "@/lib/smoothScroll";
import { Crest } from "./Crest";
import { EASE, Roll, useClock } from "./primitives";

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

export function SiteNav() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const time = useClock(identity.timeZone);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    // Wait for the menu's scroll lock to release before moving the page.
    window.setTimeout(() => scrollToHash(href), open ? 340 : 0);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <motion.div aria-hidden="true" className="h-0.5 origin-left bg-honey" style={{ scaleX: bar }} />
      <div className="flex items-center justify-between gap-4 px-4 pt-3 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        <a href="#home" onClick={(e) => go(e, "#home")} aria-label="Muhammad Luqman Khokhar, back to top" className="justify-self-start rounded-full bg-ink-deep/70 p-0.5 text-honey backdrop-blur-md">
          <Crest className="h-10 w-10" />
        </a>

        <nav aria-label="Main" className="hidden rounded-full border border-paper/15 bg-ink-deep/70 p-1 backdrop-blur-md md:block">
          <ul className="flex items-center">
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive ? "text-ink" : "text-paper/80 hover:text-paper"}`}
                  >
                    {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-honey" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                    <span className="relative"><Roll>{item.name}</Roll></span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <p className="eyebrow hidden rounded-full border border-paper/15 bg-ink-deep/70 px-3 py-3 !text-[0.65rem] text-paper/80 backdrop-blur-md xl:block">
            Daska <span className="text-honey">{time}</span> {identity.timeZoneLabel}
          </p>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full border border-paper/20 bg-ink-deep/70 text-paper backdrop-blur-md md:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content asChild aria-describedby={undefined}>
                <motion.div
                  className="fixed inset-0 z-[80] flex flex-col bg-honey p-4 text-ink"
                  initial={{ clipPath: "circle(0% at 92% 4%)" }}
                  animate={{ clipPath: "circle(150% at 92% 4%)" }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <Dialog.Title className="sr-only">Menu</Dialog.Title>
                  <div className="flex items-center justify-between">
                    <Crest className="h-11 w-11" />
                    <Dialog.Close aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full border border-ink/40">
                      <X className="h-5 w-5" aria-hidden="true" />
                    </Dialog.Close>
                  </div>
                  <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center">
                    {navItems.map((item, i) => (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => go(e, item.href)}
                        className="border-b border-ink/20 py-2 font-serif text-5xl font-medium leading-none tracking-tight"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                      >
                        {item.name}
                      </motion.a>
                    ))}
                  </nav>
                  <a href={identity.cv} target="_blank" rel="noopener noreferrer" className="eyebrow py-3 underline underline-offset-4">Resume</a>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}

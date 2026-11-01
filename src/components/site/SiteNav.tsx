import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, useScroll, useSpring } from "framer-motion";
import { X } from "lucide-react";
import { identity, navItems } from "@/data/portfolio";
import { scrollToHash } from "@/lib/smoothScroll";
import { Crest } from "./Crest";
import { EASE, NAV_TONE_EVENT } from "./primitives";

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
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    // Wait for the menu's scroll lock to release before moving the page.
    window.setTimeout(() => scrollToHash(href), open ? 340 : 0);
  };

  return (
    <>
      <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[61] h-0.5 origin-left bg-honey" style={{ scaleX: bar }} />
      <div className={`pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-4 pt-4 transition-[transform,color] duration-500 has-[:focus-visible]:translate-y-0 motion-reduce:transition-none sm:px-6 md:px-12 md:pt-6 ${overLight ? "text-ink" : "text-honey"} ${hidden ? "-translate-y-full" : ""}`}>
        <a href="#home" onClick={(e) => go(e, "#home")} aria-label="Muhammad Luqman Khokhar, back to top" className="pointer-events-auto rounded-full">
          <Crest className="h-16 w-auto" />
        </a>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger aria-label="Open menu" className="group pointer-events-auto flex h-12 w-12 items-center justify-end rounded-full">
            {/* SVG bars antialias instead of snapping to device pixels, so browser zoom cannot leave one thinner. */}
            <svg aria-hidden="true" viewBox="0 0 32 14" className="h-3.5 w-8 overflow-visible fill-current">
              <rect width="32" height="2" className="transition-transform duration-300 group-hover:-translate-y-0.5" />
              <rect y="12" width="32" height="2" className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </svg>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content asChild aria-describedby={undefined} onOpenAutoFocus={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).focus(); }}>
              <motion.div
                className="fixed inset-0 z-[80] flex flex-col bg-ink p-4 text-paper outline-none sm:px-6 md:px-12 md:pt-6"
                initial={{ clipPath: "circle(0% at 96% 5%)" }}
                animate={{ clipPath: "circle(150% at 96% 5%)" }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="flex items-center justify-between">
                  <Crest className="h-16 w-auto text-honey" />
                  <Dialog.Close aria-label="Close menu" className="flex h-12 w-12 items-center justify-end rounded-full text-honey">
                    <X className="h-8 w-8" aria-hidden="true" />
                  </Dialog.Close>
                </div>
                <nav aria-label="Main" className="flex flex-1 flex-col justify-center">
                  {navItems.map((item, i) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => go(e, item.href)}
                      aria-current={active === item.href ? "true" : undefined}
                      className={`border-b border-paper/20 py-2 font-display text-5xl font-medium leading-none tracking-tight transition-colors hover:text-honey md:text-6xl ${active === item.href ? "text-honey" : ""}`}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </nav>
                <a href={identity.cv} target="_blank" rel="noopener noreferrer" className="eyebrow self-start py-3 underline underline-offset-4">Resume</a>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </>
  );
}

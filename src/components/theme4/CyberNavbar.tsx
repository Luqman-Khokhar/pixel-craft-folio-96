import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Download, Menu, X, Zap } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const CyberNavbar = () => {
  const [active, setActive] = useState("#home");
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 200], [8, 18]);
  const bgOpacity = useTransform(scrollY, [0, 200], [0.25, 0.55]);

  useEffect(() => {
    const onScroll = () => {
      const sections = links.map((l) => l.href);
      for (const id of sections) {
        const el = document.querySelector(id);
        if (!el) continue;
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom > 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-1/2 top-4 z-50 w-[min(96%,1100px)] -translate-x-1/2"
    >
      <motion.div
        style={{
          backdropFilter: `blur(${blur.get()}px)`,
          backgroundColor: `hsl(240 30% 6% / ${bgOpacity.get()})`,
        }}
        className="relative flex items-center justify-between rounded-2xl border border-[hsl(190_95%_55%/0.25)] bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl shadow-[0_0_40px_-10px_hsl(290_90%_60%/0.5)]"
      >
        {/* Glow border */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl [background:linear-gradient(120deg,hsl(190_95%_55%/0.25),transparent_30%,transparent_70%,hsl(290_90%_60%/0.25))] opacity-60" />

        {/* Logo */}
        <button
          onClick={() => scrollTo("#home")}
          className="relative flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[hsl(290_90%_55%)] to-[hsl(190_95%_55%)] shadow-[0_0_20px_-4px_hsl(290_90%_60%)]">
            <Zap className="h-4 w-4" />
          </span>
          <span className="bg-gradient-to-r from-[hsl(190_95%_75%)] to-[hsl(290_90%_75%)] bg-clip-text text-transparent">
            LK.dev
          </span>
        </button>

        {/* Desktop links */}
        <ul className="relative hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <button
                  onClick={() => scrollTo(l.href)}
                  className={`relative rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="cyber-nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg border border-[hsl(190_95%_55%/0.5)] bg-[hsl(190_95%_55%/0.1)] shadow-[0_0_20px_-4px_hsl(190_95%_55%)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {l.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* CV button */}
        <a
          href="/CV/Muhammad_Luqman_CV_(18Oct2025).pdf"
          download
          className="relative hidden items-center gap-2 overflow-hidden rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest text-white md:inline-flex"
          style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[hsl(290_90%_55%)] via-[hsl(330_90%_60%)] to-[hsl(190_95%_55%)] bg-[length:200%_100%] animate-[gradient_4s_linear_infinite]" />
          <span className="relative flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> CV
          </span>
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((s) => !s)}
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </motion.div>

      {/* Mobile sheet */}
      <motion.div
        initial={false}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden md:hidden"
      >
        <div className="mt-2 rounded-2xl border border-[hsl(190_95%_55%/0.25)] bg-[hsl(240_30%_6%/0.85)] p-3 backdrop-blur-xl">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold uppercase tracking-widest ${
                active === l.href
                  ? "bg-[hsl(190_95%_55%/0.12)] text-white"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              {l.label}
            </button>
          ))}
          <a
            href="/CV/Muhammad_Luqman_CV_(18Oct2025).pdf"
            download
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[hsl(290_90%_55%)] to-[hsl(190_95%_55%)] px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-white"
          >
            <Download className="h-3.5 w-3.5" /> Download CV
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default CyberNavbar;

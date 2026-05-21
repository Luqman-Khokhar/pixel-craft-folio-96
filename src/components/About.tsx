import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Calendar, Code, Zap, Smartphone, ExternalLink } from "lucide-react";

const stats = [
  { icon: Zap,       value: "2+",     label: "Years Exp.",    color: "text-orange-400" },
  { icon: Code,      value: "20+",    label: "Projects Built", color: "text-blue-400" },
  { icon: Smartphone,value: "React",  label: "/ Native",      color: "text-orange-400" },
];

const highlights = [
  { icon: Calendar, text: "Frontend Developer since 2023" },
  { icon: Code,     text: "React.js & React Native Specialist" },
  { icon: MapPin,   text: "Daska City, Pakistan" },
];

export const About = () => {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: "-80px" });

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="about" className="py-28 relative overflow-hidden" ref={ref}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/6 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-500/6  blur-[80px]  pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

          {/* ── Left: Copy ── */}
          <div>
            <motion.p {...fade(0)} className="section-label mb-3">01 — About me</motion.p>
            <motion.h2
              {...fade(0.08)}
              className="font-display text-4xl sm:text-5xl font-extrabold leading-tight mb-3"
            >
              Turning ideas into<br />
              <span className="gradient-text">digital reality</span>
            </motion.h2>
            <motion.div {...fade(0.12)} className="forge-line" />

            <motion.p {...fade(0.15)} className="text-muted-foreground leading-relaxed mb-4 text-base">
              I'm <span className="text-foreground font-semibold">Muhammad Luqman Khokhar</span> — a frontend developer
              with 2+ years of experience crafting intuitive, high-performance web &amp; mobile applications with
              React.js and React Native.
            </motion.p>
            <motion.p {...fade(0.2)} className="text-muted-foreground leading-relaxed mb-8 text-base">
              I thrive at the intersection of elegant design and clean code — building products that feel fast,
              look sharp, and scale well. From real-time chat apps to live streaming platforms, I've shipped
              across diverse domains.
            </motion.p>

            {/* Highlights */}
            <motion.div {...fade(0.24)} className="flex flex-col gap-3 mb-8">
              {highlights.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </span>
                  <span className="text-sm text-muted-foreground">{text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div {...fade(0.28)}>
              <a
                href="https://github.com/Luqman-Khokhar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4"
              >
                View GitHub profile <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          </div>

          {/* ── Right: Card stack ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col gap-4"
          >
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="forge-card rounded-xl p-5 text-center">
                  <Icon className={`h-5 w-5 ${color} mx-auto mb-2`} />
                  <p className="font-display text-2xl font-bold gradient-text">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* What I do card */}
            <div className="forge-card rounded-xl p-6">
              <p className="section-label mb-4">What I do</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Web Applications",    pct: 92, color: "bg-orange-500" },
                  { label: "Mobile Apps (React Native)", pct: 88, color: "bg-blue-500" },
                  { label: "UI / UX Implementation",     pct: 85, color: "bg-orange-400" },
                  { label: "API Integration",            pct: 80, color: "bg-blue-400" },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-mono-alt text-primary">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${pct}%` } : {}}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        className={`h-full rounded-full ${color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location badge */}
            <div className="forge-card rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">🇵🇰</span>
              <div>
                <p className="text-sm font-semibold">Daska City, Pakistan</p>
                <p className="text-xs text-muted-foreground">Open to remote opportunities worldwide</p>
              </div>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 pulse-glow" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

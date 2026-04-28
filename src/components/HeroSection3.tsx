import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDownRight, Sparkles, Github, Linkedin, Mail } from "lucide-react";

export const HeroSection3 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[hsl(222_47%_4%)] text-foreground"
    >
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[hsl(217_91%_60%/0.35)] blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-[hsl(262_83%_58%/0.35)] blur-[140px] animate-pulse [animation-delay:1.2s]" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-[hsl(190_95%_55%/0.25)] blur-[140px] animate-pulse [animation-delay:2.4s]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-24 lg:py-28"
      >
        {/* Glass badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-white/80 backdrop-blur-xl shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.08)]"
        >
          <Sparkles className="h-3.5 w-3.5 text-[hsl(190_95%_60%)]" />
          Available for new projects
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-center font-bold leading-[0.95] tracking-tight text-white text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem]"
        >
          <span className="block">Muhammad</span>
          <span className="block bg-gradient-to-r from-[hsl(190_95%_65%)] via-[hsl(217_91%_65%)] to-[hsl(290_85%_70%)] bg-clip-text text-transparent">
            Luqman Khokhar
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mx-auto mt-8 max-w-2xl text-center text-base sm:text-lg text-white/65"
        >
          Frontend Developer crafting immersive, premium web & mobile experiences with motion,
          3D, and modern design systems.
        </motion.p>

        {/* CTA group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="#projects"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_hsl(217_91%_60%/0.6)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[hsl(217_91%_60%)] via-[hsl(262_83%_58%)] to-[hsl(190_95%_55%)] bg-[length:200%_100%] animate-[gradient_5s_linear_infinite]" />
            <span className="relative">View My Work</span>
            <ArrowDownRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>

          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/30"
          >
            <Mail className="h-4 w-4" />
            Get in Touch
          </a>
        </motion.div>

        {/* Social glass row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-14 flex items-center gap-3"
        >
          {[
            { icon: Github, href: "https://github.com/Luqman-Khokhar", label: "GitHub" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/mluqmangn/", label: "LinkedIn" },
            { icon: Mail, href: "mailto:mluqmangn@gmail.com", label: "Email" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/80 backdrop-blur-xl shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.08),0_8px_24px_-12px_hsl(0_0%_0%/0.6)] transition-all hover:-translate-y-0.5 hover:text-white hover:border-white/30 hover:shadow-[0_0_30px_-5px_hsl(217_91%_60%/0.6)]"
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          ))}
        </motion.div>

        {/* Stats — neumorphic glass cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { k: "3+", v: "Years Exp." },
            { k: "25+", v: "Projects" },
            { k: "15+", v: "Clients" },
            { k: "∞", v: "Coffee Cups" },
          ].map((s) => (
            <div
              key={s.v}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.08),0_20px_40px_-25px_hsl(0_0%_0%/0.8)] transition-all hover:-translate-y-1 hover:border-white/20"
            >
              <div className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl font-bold text-transparent">
                {s.k}
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-white/50">{s.v}</div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 [background:radial-gradient(400px_circle_at_var(--x,50%)_var(--y,50%),hsl(217_91%_60%/0.12),transparent_40%)]" />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/40"
      >
        Scroll ↓
      </motion.div>
    </section>
  );
};

export default HeroSection3;

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { Github, Linkedin, Mail, Zap, ChevronDown, Cpu, Code2 } from "lucide-react";

/**
 * HeroSection4 — Futuristic Anime / Cyberpunk hero
 * Pure presentation. No data/logic changes.
 */
export const HeroSection4 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  // Cursor parallax for the avatar panel
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 12;
      const ny = (e.clientY / window.innerHeight - 0.5) * 12;
      setTilt({ x: nx, y: ny });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[hsl(240_30%_4%)] text-white"
    >
      {/* Neon orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full bg-[hsl(290_90%_60%/0.30)] blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full bg-[hsl(190_95%_55%/0.30)] blur-[140px] animate-pulse [animation-delay:1.4s]" />
        <div className="absolute bottom-0 left-1/3 h-[460px] w-[460px] rounded-full bg-[hsl(330_90%_60%/0.22)] blur-[140px] animate-pulse [animation-delay:2.6s]" />
      </div>

      {/* Cyber grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(190 95% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(290 90% 65%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 78%)",
        }}
      />

      {/* Animated scanlines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(0deg,transparent_0px,transparent_2px,hsl(0_0%_100%)_3px,transparent_4px)]" />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 4 + (i % 5),
              repeat: Infinity,
              delay: (i * 0.3) % 3,
            }}
            className="absolute h-1 w-1 rounded-full bg-[hsl(190_95%_70%)] shadow-[0_0_12px_2px_hsl(190_95%_70%)]"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-12 lg:py-28"
      >
        {/* LEFT — text */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(190_95%_55%/0.4)] bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-[hsl(190_95%_75%)] backdrop-blur-xl shadow-[0_0_30px_-8px_hsl(190_95%_55%/0.6)]"
          >
            <Zap className="h-3.5 w-3.5" />
            System Online · v4.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-bold leading-[0.95] tracking-tight text-5xl sm:text-6xl lg:text-7xl"
          >
            <span className="block text-white/95">Hi, I&apos;m</span>
            <span className="mt-2 block bg-gradient-to-r from-[hsl(190_95%_65%)] via-[hsl(290_90%_70%)] to-[hsl(330_90%_70%)] bg-clip-text text-transparent drop-shadow-[0_0_40px_hsl(290_90%_60%/0.4)]">
              Muhammad Luqman
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-lg sm:text-xl text-white/70 font-mono"
          >
            <span className="text-[hsl(190_95%_70%)]">&gt;_ </span>
            <TypeAnimation
              sequence={[
                "Frontend Developer",
                1500,
                "React & Next.js Engineer",
                1500,
                "Motion & 3D Enthusiast",
                1500,
                "UI/UX Architect",
                1500,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-white"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 max-w-xl text-base text-white/60"
          >
            Crafting immersive, neon-lit, cinematic web experiences where motion design
            meets cyberpunk aesthetics.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_40px_-8px_hsl(290_90%_60%/0.8)] transition-transform hover:-translate-y-0.5"
              style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[hsl(290_90%_55%)] via-[hsl(330_90%_60%)] to-[hsl(190_95%_55%)] bg-[length:200%_100%] animate-[gradient_4s_linear_infinite]" />
              <span className="relative">Enter Portfolio</span>
              <Code2 className="relative h-4 w-4" />
            </a>

            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-md border border-[hsl(190_95%_55%/0.5)] bg-white/5 px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-[hsl(190_95%_75%)] backdrop-blur-xl transition-all hover:bg-[hsl(190_95%_55%/0.1)] hover:shadow-[0_0_30px_-5px_hsl(190_95%_55%/0.6)]"
              style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
            >
              <Mail className="h-4 w-4" />
              Transmit
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-10 flex items-center gap-3"
          >
            {[
              { icon: Github, href: "https://github.com/Luqman-Khokhar", label: "GitHub", color: "290 90% 65%" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/mluqmangn/", label: "LinkedIn", color: "190 95% 60%" },
              { icon: Mail, href: "mailto:mluqmangn@gmail.com", label: "Email", color: "330 90% 65%" },
            ].map(({ icon: Icon, href, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/80 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:text-white"
                style={{ boxShadow: `0 0 0 0 hsl(${color}/0)` }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 24px -4px hsl(${color}/0.7)`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 0 0 hsl(${color}/0)`)}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — holographic avatar panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative lg:col-span-5"
          style={{ perspective: 1200 }}
        >
          <motion.div
            animate={{ rotateY: tilt.x, rotateX: -tilt.y }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="relative mx-auto aspect-[4/5] w-full max-w-md"
          >
            {/* Holo frame */}
            <div className="absolute inset-0 rounded-3xl border border-[hsl(190_95%_55%/0.4)] bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-xl shadow-[0_0_60px_-10px_hsl(290_90%_60%/0.5),inset_0_1px_0_0_hsl(0_0%_100%/0.1)]" />

            {/* Animated corners */}
            {[
              "top-3 left-3 border-t-2 border-l-2",
              "top-3 right-3 border-t-2 border-r-2",
              "bottom-3 left-3 border-b-2 border-l-2",
              "bottom-3 right-3 border-b-2 border-r-2",
            ].map((pos, i) => (
              <span
                key={i}
                className={`absolute h-6 w-6 ${pos} border-[hsl(190_95%_70%)] shadow-[0_0_12px_hsl(190_95%_60%)]`}
              />
            ))}

            {/* Avatar image (about-removebg.png from public) */}
            <div className="absolute inset-6 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-[hsl(290_90%_60%/0.15)] via-transparent to-[hsl(190_95%_55%/0.20)]" />
              <motion.img
                src="/about-removebg.png"
                alt="Developer avatar"
                className="absolute inset-0 h-full w-full object-contain object-bottom"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Scanline overlay */}
              <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay [background:repeating-linear-gradient(0deg,transparent_0px,transparent_3px,hsl(190_95%_70%)_4px,transparent_5px)]" />
              {/* Sweep */}
              <motion.div
                className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[hsl(190_95%_60%/0.25)] to-transparent"
                animate={{ y: ["-20%", "120%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* HUD chips */}
            <div className="absolute -left-4 top-10 hidden rounded-md border border-[hsl(190_95%_55%/0.5)] bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-[hsl(190_95%_75%)] backdrop-blur-md md:block">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3 w-3" /> CPU 87%
              </div>
            </div>
            <div className="absolute -right-4 bottom-12 hidden rounded-md border border-[hsl(290_90%_60%/0.5)] bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-[hsl(290_90%_75%)] backdrop-blur-md md:block">
              ONLINE
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#skills"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2 }, y: { duration: 1.8, repeat: Infinity } }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] uppercase tracking-[0.4em] text-white/50 hover:text-white"
      >
        Scroll
        <ChevronDown className="h-4 w-4" />
      </motion.a>
    </section>
  );
};

export default HeroSection4;

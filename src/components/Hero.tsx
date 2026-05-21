import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Github, Linkedin, Mail, ArrowDown, Download } from "lucide-react";

const OrbScene = lazy(() => import("./OrbScene"));

const stagger = {
  parent: { animate: { transition: { staggerChildren: 0.1 } } },
  child: {
    initial:  { opacity: 0, y: 24 },
    animate:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },
};

const stats = [
  { value: "2+",  label: "Years Exp." },
  { value: "20+", label: "Projects" },
  { value: "3",   label: "Companies" },
];

export const Hero = () => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth  - 0.5) * 2);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const scroll = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Gradient blobs */}
      <div className="absolute top-[15%] left-[5%]  w-[28rem] h-[28rem] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[22rem] h-[22rem] rounded-full bg-blue-500/10  blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto min-h-[calc(100vh-4rem)]">

          {/* ── Left: Text ── */}
          <motion.div
            variants={stagger.parent}
            initial="initial"
            animate="animate"
            className="order-2 lg:order-1 flex flex-col justify-center"
          >
            {/* Status badge */}
            <motion.div variants={stagger.child} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border forge-card text-xs font-mono-alt text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow" />
                Available for new opportunities
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={stagger.child}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight mb-5"
            >
              <span className="block text-foreground/70 text-2xl sm:text-3xl font-normal mb-2 font-mono-alt">
                Hey, I'm
              </span>
              <span className="gradient-text">Muhammad</span>
              <br />
              <span>Luqman</span>
            </motion.h1>

            {/* Role typer */}
            <motion.div
              variants={stagger.child}
              className="flex items-center gap-2 text-lg sm:text-xl font-mono-alt text-muted-foreground mb-6"
            >
              <span className="text-primary">▶</span>
              <TypeAnimation
                sequence={[
                  "React.js Developer",   2200,
                  "React Native Dev",     2200,
                  "Frontend Engineer",    2200,
                  "Mobile App Builder",   2200,
                ]}
                wrapper="span"
                speed={55}
                repeat={Infinity}
              />
              <span className="cursor-blink text-primary">_</span>
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={stagger.child}
              className="text-muted-foreground leading-relaxed mb-8 max-w-md text-base"
            >
              Crafting high-performance web &amp; mobile experiences with the React ecosystem.
              2+ years building products that users love — from real-time apps to live platforms.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={stagger.child} className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => scroll("#contact")}
                className="gradient-fill text-white px-6 py-2.5 rounded-md font-semibold text-sm shadow-lg hover:opacity-90 hover:shadow-orange-500/25 transition-all duration-200 flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Get in Touch
              </button>
              <button
                onClick={() => scroll("#projects")}
                className="px-6 py-2.5 rounded-md font-semibold text-sm border border-border hover:border-primary/40 hover:bg-secondary transition-all duration-200"
              >
                View Projects
              </button>
              <a
                href="/CV/Muhammad_Luqman_CV_(31Oct2025).pdf.pdf"
                download="Muhammad_Luqman_CV.pdf"
                className="px-6 py-2.5 rounded-md font-semibold text-sm border border-border hover:border-primary/40 hover:bg-secondary transition-all duration-200 flex items-center gap-2 text-foreground"
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
            </motion.div>

            {/* Socials + stats */}
            <motion.div variants={stagger.child} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {[
                  { icon: Github,   href: "https://github.com/Luqman-Khokhar",            label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/mluqmangn/",       label: "LinkedIn" },
                  { icon: Mail,     href: "mailto:mluqmangn@gmail.com",                   label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
                <span className="text-xs font-mono-alt text-muted-foreground/70 ml-1">mluqmangn@gmail.com</span>
              </div>

              {/* Stats row */}
              <div className="flex gap-6">
                {stats.map(({ value, label }) => (
                  <div key={label} className="flex flex-col">
                    <span className="font-display text-2xl font-bold gradient-text leading-none">{value}</span>
                    <span className="text-xs text-muted-foreground mt-0.5 font-mono-alt">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: 3D Orb ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 flex items-center justify-center"
          >
            <div className="relative w-full max-w-[440px] aspect-square">
              {/* Outer glow rings */}
              <div className="absolute inset-0 rounded-full bg-orange-500/8  blur-3xl" />
              <div className="absolute inset-8 rounded-full bg-blue-500/6   blur-2xl" />

              {/* 3D canvas */}
              <div className="relative w-full h-full">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  </div>
                }>
                  <OrbScene mouseX={mouseX} mouseY={mouseY} />
                </Suspense>
              </div>

              {/* Floating labels */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 -left-4 forge-card rounded-xl px-4 py-3 shadow-xl z-10"
              >
                <p className="text-[10px] font-mono-alt text-muted-foreground">Experience</p>
                <p className="text-lg font-display font-bold gradient-text">2+ Years</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 -right-4 forge-card rounded-xl px-4 py-3 shadow-xl z-10"
              >
                <p className="text-[10px] font-mono-alt text-muted-foreground">Projects</p>
                <p className="text-lg font-display font-bold gradient-text">20+</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.button
        onClick={() => scroll("#about")}
        animate={{ y: [0, 7, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowDown className="h-5 w-5" />
      </motion.button>
    </section>
  );
};

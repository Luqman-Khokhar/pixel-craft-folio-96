import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Github, Linkedin, Mail, ArrowDown, Download } from "lucide-react";

export const Hero = () => {
  const scroll = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left — text */}
          <div className="order-2 lg:order-1">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border glass text-sm font-medium text-muted-foreground mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-glow" />
              Available for new opportunities
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight"
            >
              Hi, I'm{" "}
              <span className="gradient-text block sm:inline">
                Luqman
              </span>
            </motion.h1>

            {/* Typed role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl sm:text-2xl font-mono font-semibold mb-6 text-muted-foreground"
            >
              <span className="text-primary mr-2">&gt;</span>
              <TypeAnimation
                sequence={[
                  "React.js Developer", 2000,
                  "React Native Developer", 2000,
                  "Frontend Engineer", 2000,
                  "Mobile App Developer", 2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
              <span className="cursor-blink ml-0.5 text-primary">_</span>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg"
            >
              Crafting high-performance web and mobile experiences with the React
              ecosystem. 2+ years building products that users love.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <button
                onClick={() => scroll("#contact")}
                className="gradient-fill text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Get in Touch
              </button>
              <button
                onClick={() => scroll("#projects")}
                className="px-6 py-3 rounded-xl font-semibold text-sm border border-border hover:bg-secondary transition-colors flex items-center gap-2"
              >
                View Projects
              </button>
              <a
                href="/CV/Muhammad_Luqman_CV_(31Oct2025).pdf.pdf"
                download="Muhammad_Luqman_CV.pdf"
                className="px-6 py-3 rounded-xl font-semibold text-sm border border-border hover:bg-secondary transition-colors flex items-center gap-2 text-foreground"
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-4"
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
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <span className="text-xs text-muted-foreground ml-2 font-mono">
                mluqmangn@gmail.com
              </span>
            </motion.div>
          </div>

          {/* Right — avatar card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl" />

              {/* Avatar */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-border/60 glass shadow-2xl float">
                <img
                  src="/mine.jpg"
                  alt="Muhammad Luqman Khokhar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/about-removebg.png";
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>

              {/* Floating stat badges */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-6 glass border border-border/60 rounded-2xl px-4 py-3 shadow-lg"
              >
                <p className="text-xs text-muted-foreground font-medium">Experience</p>
                <p className="text-xl font-bold gradient-text">2+ Years</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-6 glass border border-border/60 rounded-2xl px-4 py-3 shadow-lg"
              >
                <p className="text-xs text-muted-foreground font-medium">Projects</p>
                <p className="text-xl font-bold gradient-text">20+</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.button
        onClick={() => scroll("#about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowDown className="h-5 w-5" />
      </motion.button>
    </section>
  );
};

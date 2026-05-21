import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Code2, Smartphone, Database, Palette, GitBranch, Terminal, Layers } from "lucide-react";

const categories = [
  {
    id: "frontend",
    icon: Code2,
    title: "Frontend",
    color: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    skills: ["React.js","React Native","Next.js","TypeScript","Tailwind CSS","Ant Design","Material UI","Bootstrap","Aceternity UI","Formik & Yup"],
  },
  {
    id: "state",
    icon: Database,
    title: "State Management",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    skills: ["Context API","Redux","Redux Toolkit","Redux Thunk","Redux Saga","React Query","Zustand"],
  },
  {
    id: "realtime",
    icon: Smartphone,
    title: "Real-time & APIs",
    color: "text-orange-300",
    border: "border-orange-400/30",
    bg: "bg-orange-400/10",
    skills: ["Socket.io","Pusher","Firebase","Supabase","REST APIs","WebSockets","GraphQL"],
  },
  {
    id: "backend",
    icon: Terminal,
    title: "Backend",
    color: "text-blue-300",
    border: "border-blue-400/30",
    bg: "bg-blue-400/10",
    skills: ["Node.js","KeystoneJS","Laravel","Express.js"],
  },
  {
    id: "deploy",
    icon: GitBranch,
    title: "Deployment",
    color: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    skills: ["Vercel","Netlify","GoDaddy","Hostinger","Google Play Store","Apple App Store"],
  },
  {
    id: "ui",
    icon: Palette,
    title: "UI / UX",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    skills: ["Responsive Design","Animations & Transitions","Modern UI Libraries","Component Design","MVC / MVVM"],
  },
];

const allSkills = ["React.js","React Native","Next.js","TypeScript","Tailwind CSS","Socket.io","Firebase","Redux","Zustand","REST APIs","GraphQL","Node.js","Vercel","Framer Motion","Supabase","WebSockets"];

export const Skills = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState("all");

  const filtered = active === "all"
    ? categories
    : categories.filter((c) => c.id === active);

  return (
    <section id="skills" className="py-28 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-blue-500/8 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="section-label mb-3">02 — Tech Stack</p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-3">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="forge-line" />
        </motion.div>

        {/* Marquee strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative overflow-hidden mb-10 py-3 border-y border-border/50"
        >
          <div className="flex whitespace-nowrap marquee-track gap-6">
            {[...allSkills, ...allSkills].map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-sm font-mono-alt text-muted-foreground px-3 py-1 rounded border border-border/60 bg-secondary/50 flex-shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <button
            onClick={() => setActive("all")}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono-alt border transition-all duration-200 ${
              active === "all"
                ? "gradient-fill text-white border-transparent shadow-lg"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            <Layers className="h-3 w-3" /> All
          </button>
          {categories.map(({ id, icon: Icon, title }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono-alt border transition-all duration-200 ${
                active === id
                  ? "gradient-fill text-white border-transparent shadow-lg"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-3 w-3" /> {title}
            </button>
          ))}
        </motion.div>

        {/* Category cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map(({ id, icon: Icon, title, color, border, bg, skills }, idx) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`forge-card rounded-xl p-5 border ${border}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`h-4.5 w-4.5 ${color}`} />
                  </div>
                  <span className="font-display font-bold text-sm">{title}</span>
                  <span className="ml-auto font-mono-alt text-xs text-muted-foreground/60">{skills.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="tech-tag hover:border-primary/40 hover:text-foreground transition-colors cursor-default"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

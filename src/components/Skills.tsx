import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Smartphone, Database, Palette, GitBranch, Terminal } from "lucide-react";
import { InfiniteSkillsScroll } from "./ui/infiniteScroll";

const categories = [
  {
    icon: Code2,
    title: "Frontend",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    skills: ["React.js", "React Native", "Next.js", "TypeScript", "Tailwind CSS", "Ant Design", "Material UI", "Bootstrap", "Aceternity UI", "Formik & Yup"],
  },
  {
    icon: Database,
    title: "State Management",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    skills: ["Context API", "Redux", "Redux Toolkit", "Redux Thunk", "Redux Saga", "React Query", "Zustand"],
  },
  {
    icon: Smartphone,
    title: "Real-time & APIs",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    skills: ["Socket.io", "Pusher", "Firebase", "Supabase", "REST APIs", "WebSockets", "GraphQL"],
  },
  {
    icon: Terminal,
    title: "Backend Familiarity",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    skills: ["Node.js", "KeystoneJS", "Laravel", "Express.js"],
  },
  {
    icon: GitBranch,
    title: "Deployment",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    skills: ["Vercel", "Netlify", "GoDaddy", "Hostinger", "Google Play Store", "Apple App Store"],
  },
  {
    icon: Palette,
    title: "UI / UX",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    skills: ["Responsive Design", "Animations & Transitions", "Modern UI Libraries", "Component Design", "MVC / MVVM Structure"],
  },
];

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Orb */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary mb-2">// tech stack</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="section-line" />
        </motion.div>

        {/* Infinite scroll strip */}
        <div className="mb-12">
          <InfiniteSkillsScroll />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 pointer-events-none" />

              <div className="relative glass border border-border/60 rounded-2xl p-5 h-full hover:border-primary/30 transition-all duration-300">
                {/* Icon + title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.bg}`}>
                    <cat.icon className={`h-5 w-5 ${cat.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm">{cat.title}</h3>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="tech-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

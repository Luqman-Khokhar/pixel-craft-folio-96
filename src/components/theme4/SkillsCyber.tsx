import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Smartphone, Database, Palette, GitBranch, Terminal } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const skillCategories = [
  {
    title: "Frontend",
    icon: Code2,
    color: "190 95% 60%",
    skills: ["React.js", "React Native", "Next.js", "TypeScript", "Tailwind CSS", "Ant Design", "Material UI", "Bootstrap", "Aceternity UI", "Formik & Yup"],
  },
  {
    title: "State Management",
    icon: Database,
    color: "290 90% 65%",
    skills: ["Context API", "Redux", "Redux Toolkit", "Redux Thunk", "Redux Saga", "React Query", "Zustand"],
  },
  {
    title: "Real-time & APIs",
    icon: Smartphone,
    color: "330 90% 65%",
    skills: ["Socket.io", "Pusher", "Firebase", "Supabase", "REST APIs", "WebSockets", "GraphQl"],
  },
  {
    title: "Backend Familiarity",
    icon: Terminal,
    color: "217 91% 65%",
    skills: ["Node.js", "KeystoneJS", "Laravel", "Express.js"],
  },
  {
    title: "Deployment",
    icon: GitBranch,
    color: "262 83% 65%",
    skills: ["Vercel", "Netlify", "Godaddy", "Hostinger", "Google Play Store", "Apple App Store"],
  },
  {
    title: "UI / UX",
    icon: Palette,
    color: "160 85% 55%",
    skills: ["Responsive Design", "Animations & Transitions", "Modern UI Libraries", "Component Design", "MVC / MVVM Structure"],
  },
];

export const SkillsCyber = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" ref={ref} className="relative w-full overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Arsenal · 02"
          title="Technical"
          accent="Skills"
          description="The tech stack powering my digital combat suit."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              {/* Glow */}
              <div
                className="absolute -inset-px rounded-2xl opacity-0 blur transition-opacity group-hover:opacity-100"
                style={{ background: `linear-gradient(135deg, hsl(${cat.color}/0.6), transparent 60%)` }}
              />
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.06)] transition-all group-hover:border-white/20">
                {/* HUD corner */}
                <span
                  className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2"
                  style={{ borderColor: `hsl(${cat.color})`, boxShadow: `0 0 12px hsl(${cat.color}/0.6)` }}
                />

                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="grid h-11 w-11 place-items-center rounded-xl border"
                    style={{
                      backgroundColor: `hsl(${cat.color}/0.12)`,
                      borderColor: `hsl(${cat.color}/0.4)`,
                      boxShadow: `0 0 24px -6px hsl(${cat.color}/0.6)`,
                    }}
                  >
                    <cat.icon className="h-5 w-5" style={{ color: `hsl(${cat.color})` }} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80 transition-all hover:text-white"
                      style={{ borderColor: `hsl(${cat.color}/0.25)` }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Animated bar */}
                <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : {}}
                    transition={{ duration: 1.4, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                    className="h-full"
                    style={{
                      background: `linear-gradient(90deg, hsl(${cat.color}), transparent)`,
                      boxShadow: `0 0 12px hsl(${cat.color})`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsCyber;

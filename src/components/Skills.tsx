import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2,
  Smartphone,
  Database,
  Palette,
  GitBranch,
  Terminal,
} from "lucide-react";

const skillCategories = [
  {
    title: "Frontend",
    icon: Code2,
    skills: ["React.js", "React Native", "Next.js", "TypeScript", "Tailwind CSS", "Ant Design", "Material UI"],
  },
  {
    title: "State Management",
    icon: Database,
    skills: ["Redux Toolkit", "Redux Saga", "React Query", "Zustand", "Context API"],
  },
  {
    title: "Real-time & APIs",
    icon: Smartphone,
    skills: ["Socket.io", "Pusher", "Firebase Realtime DB", "Supabase", "REST APIs", "WebSockets"],
  },
  {
    title: "Backend Familiarity",
    icon: Terminal,
    skills: ["Node.js", "KeystoneJS", "Laravel", "Express.js"],
  },
  {
    title: "Deployment",
    icon: GitBranch,
    skills: ["Vercel", "Netlify", "Firebase", "GitHub Actions"],
  },
  {
    title: "UI/UX",
    icon: Palette,
    skills: ["Responsive Design", "Animations", "Modern UI Libraries", "Component Design"],
  },
];

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Technical <span className="bg-gradient-primary bg-clip-text text-transparent">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full border border-border hover:border-primary/50 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

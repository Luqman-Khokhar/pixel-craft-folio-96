import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";

const experiences = [
  {
    title: "Frontend Developer",
    company: "Adroid IT Solutions",
    period: "2025 – Present",
    current: true,
    description: "Leading the development of web and mobile interfaces with React.js and React Native.",
    achievements: [
      "Spearheaded frontend development of multiple mobile and web products, achieving improved responsiveness and user retention.",
      "Integrated AI chatbot & real-time notification systems, boosting user engagement and reducing manual support.",
      "Collaborated with backend teams on Node.js, KeystoneJS and Laravel integrations, enhancing system reliability.",
    ],
  },
  {
    title: "Frontend Developer",
    company: "AppCrates",
    period: "2024 – 2025",
    current: false,
    description: "Built and maintained production-level React and React Native apps with modern UI libraries.",
    achievements: [
      "Built responsive web and mobile UI components with React.js and React Native, improving customer satisfaction metrics.",
      "Streamlined state management and component architecture to reduce code complexity and accelerate feature delivery.",
      "Partnered with cross-discipline teams to implement new features and ensure scalable & maintainable solutions.",
    ],
  },
  {
    title: "Frontend Developer",
    company: "Al-Salam Tech House",
    period: "2023 – 2024",
    current: false,
    description: "Developed dynamic user interfaces and responsive layouts for web and mobile applications.",
    achievements: [
      "Developed CRM web applications and a ride-booking mobile app using React Native.",
      "Focused on performance optimization, UI/UX enhancements, and efficient state management.",
      "Collaborated with teams to implement new features and ensure scalable solutions.",
    ],
  },
];

export const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary mb-2">// career history</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <div className="section-line" />
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative pl-16"
              >
                {/* Dot */}
                <div className={`absolute left-4 top-6 w-4 h-4 rounded-full border-2 -translate-x-1/2 ${
                  exp.current
                    ? "bg-primary border-primary pulse-glow"
                    : "bg-background border-border"
                }`} />

                {/* Card */}
                <div className="glass border border-border/60 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group">
                  {/* Top row */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <h3 className="font-bold text-base">{exp.title}</h3>
                      </div>
                      <p className="text-primary font-semibold text-sm">{exp.company}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary rounded-full px-3 py-1.5">
                      <Calendar className="h-3 w-3" />
                      {exp.period}
                      {exp.current && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-semibold">
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>

                  {/* Achievements */}
                  <ul className="space-y-2">
                    {exp.achievements.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary/60 mt-0.5 flex-shrink-0" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

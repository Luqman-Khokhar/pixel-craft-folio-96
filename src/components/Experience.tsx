import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, CheckCircle2, MapPin } from "lucide-react";

const experiences = [
  {
    num: "01",
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
    num: "02",
    title: "Frontend Developer",
    company: "AppCrates",
    period: "2024 – 2025",
    current: false,
    description: "Built and maintained production-level React and React Native apps with modern UI libraries.",
    achievements: [
      "Built responsive web and mobile UI components with React.js and React Native, improving customer satisfaction.",
      "Streamlined state management and component architecture to reduce code complexity and accelerate feature delivery.",
      "Partnered with cross-discipline teams to implement new features and ensure scalable & maintainable solutions.",
    ],
  },
  {
    num: "03",
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
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="py-28 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-secondary/25" />
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-orange-500/6 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="section-label mb-3">04 — Experience</p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-3">
            Work <span className="gradient-text">History</span>
          </h2>
          <div className="forge-line" />
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto flex flex-col gap-0">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.num}
              initial={{ opacity: 0, x: -28 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid sm:grid-cols-[120px_1fr] gap-0"
            >
              {/* Left: number column */}
              <div className="hidden sm:flex flex-col items-center pt-1 pr-8">
                <span className="font-display text-5xl font-extrabold text-border/80 leading-none select-none">
                  {exp.num}
                </span>
                {/* Vertical line */}
                {idx < experiences.length - 1 && (
                  <div className="flex-1 w-[2px] mt-3 bg-gradient-to-b from-border/60 to-transparent" />
                )}
              </div>

              {/* Right: card */}
              <div className={`forge-card rounded-2xl p-6 mb-6 relative ${exp.current ? "border-primary/40" : ""}`}>
                {/* Current dot */}
                {exp.current && (
                  <span className="absolute top-4 right-4 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-glow" />
                    <span className="text-[10px] font-mono-alt text-emerald-400">Current</span>
                  </span>
                )}

                {/* Top row */}
                <div className="flex flex-wrap items-start gap-3 mb-1">
                  <div>
                    <h3 className="font-display font-bold text-lg leading-tight">{exp.title}</h3>
                    <p className="text-primary font-semibold text-sm mt-0.5">{exp.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono-alt text-muted-foreground mb-3">
                  <Calendar className="h-3 w-3" />
                  {exp.period}
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>

                {/* Divider */}
                <div className="h-px bg-border mb-4" />

                {/* Achievements */}
                <ul className="flex flex-col gap-2.5">
                  {exp.achievements.map((a, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

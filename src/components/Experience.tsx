import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Frontend Developer",
    company: "Adroid IT Solutions",
    period: "2025 - Present",
    description:
      "Leading the development of web and mobile interfaces with React.js and React Native.",
    achievements: [
      "Developed and enhanced gym, marketing, chat, and work management apps.",
      "Implemented AI LLM integrations while contributing to backend development in Node.js, KeystoneJS, and Laravel.",
      "Led real-time chat and notification features, optimized state management, and collaborated on robust app architecture.",
    ],
  },
  {
    title: "Frontend Developer",
    company: "AppCrates",
    period: "2024 - 2025",
    description:
      "Built and maintained production-level React and React Native apps with modern UI libraries.",
    achievements: [
      "Built and maintained mobile apps for gym, chat, and work management platforms.",
      "Integrated real-time communication features, optimized APIs, and improved front-end structure for scalability.",
      "Worked closely with cross-functional teams to deliver responsive and stable applications.",
    ],
  },
  {
    title: "Frontend Developer",
    company: "Al-Salam Tech House",
    period: "2023 - 2024",
    description:
      "Developed dynamic user interfaces and implemented responsive layouts for web applications.",
    achievements: [
      "Developed CRM web applications and a ride-booking mobile app using React Native.",
      "Focused on performance optimization, UI/UX improvements, and efficient state management.",
      "Collaborated with teams to implement new features and ensure scalable solutions.",
    ],
  },
];

export const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-20 relative w-full overflow-hidden" ref={ref}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[90rem] overflow-hidden">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Work{" "}
            <span className="rainbow bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <div className="w-20 h-1 bg-rainbow mx-auto rounded-full" />
        </motion.div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-rainbow -translate-x-[calc(50%-1px)] rounded-full" />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex flex-col md:flex-row items-center mb-16 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
            >
              {/* Connector Dot */}
              <div className="absolute left-1/2 w-5 h-5 bg-rainbow rounded-full -translate-x-1/2 z-10 border-4 border-background shadow-md" />

              {/* Spacer for alignment */}
              <div className="hidden md:block w-1/2" />

              {/* Card */}
              <div
                className={`w-full md:w-1/2 bg-card border border-border rounded-2xl p-6 relative shadow-md hover:border-primary/50 transition-all duration-300 ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                  }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-rainbow rounded-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                    <p className="text-primary font-semibold">{exp.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{exp.period}</span>
                </div>

                <p className="text-muted-foreground mb-4">{exp.description}</p>

                <ul className="space-y-2">
                  {exp.achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{a}</span>
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

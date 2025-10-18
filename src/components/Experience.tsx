import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Frontend Developer",
    company: "Adroid IT Solutions",
    period: "2025 - Present",
    description: "Leading the development of web and mobile interfaces with React.js and React Native.",
    achievements: [
      "Implementing real-time features with Socket.io and Pusher",
      "Optimizing frontend performance across web and mobile platforms",
      "Collaborating with cross-functional teams on product development",
    ],
  },
  {
    title: "Frontend Developer",
    company: "AppCrates",
    period: "2024 - 2025",
    description: "Built and maintained production-level React and React Native apps with modern UI libraries.",
    achievements: [
      "Integrated REST APIs and real-time data synchronization",
      "Developed responsive, animated components with Framer Motion",
      "Implemented state management solutions using Redux Toolkit and React Query",
    ],
  },
  {
    title: "Frontend Developer",
    company: "Al-Salam Tech House",
    period: "2023 - 2024",
    description: "Developed dynamic user interfaces and implemented responsive layouts for web applications.",
    achievements: [
      "Collaborated with backend teams for seamless API integration",
      "Built reusable component libraries with Ant Design and Material UI",
      "Improved application responsiveness and cross-browser compatibility",
    ],
  },
];

export const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Work <span className="bg-gradient-primary bg-clip-text text-transparent">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-primary transform md:-translate-x-1/2" />

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative mb-12 ${
                  index % 2 === 0 ? "md:pr-1/2 md:text-right" : "md:pl-1/2 md:ml-auto"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 bg-gradient-primary rounded-full transform md:-translate-x-1/2 border-4 border-background" />

                <div className="ml-8 md:ml-0">
                  <div className={`relative group ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"}`}>
                    <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <div className="relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-gradient-primary rounded-lg">
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
                        {exp.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="text-primary mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

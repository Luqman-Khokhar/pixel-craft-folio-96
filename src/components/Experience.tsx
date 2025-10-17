import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Senior React Developer",
    company: "Tech Solutions Inc.",
    period: "2022 - Present",
    description: "Leading development of scalable web applications using React and TypeScript. Mentoring junior developers and establishing best practices.",
    achievements: [
      "Improved app performance by 40% through optimization",
      "Led team of 5 developers on major product releases",
      "Implemented CI/CD pipeline reducing deployment time by 60%",
    ],
  },
  {
    title: "React Native Developer",
    company: "Mobile Innovations Ltd.",
    period: "2020 - 2022",
    description: "Developed cross-platform mobile applications for iOS and Android. Collaborated with designers and backend teams.",
    achievements: [
      "Built 3 production apps with 100K+ downloads each",
      "Reduced app size by 30% through code optimization",
      "Integrated payment systems and push notifications",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "StartUp Ventures",
    period: "2019 - 2020",
    description: "Built full-stack applications using React, Node.js, and MongoDB. Worked in fast-paced startup environment.",
    achievements: [
      "Developed MVP from scratch in 3 months",
      "Implemented real-time features using WebSockets",
      "Managed AWS infrastructure and deployments",
    ],
  },
  {
    title: "Junior Web Developer",
    company: "Digital Agency Co.",
    period: "2018 - 2019",
    description: "Created responsive websites and landing pages. Learned modern web development practices and frameworks.",
    achievements: [
      "Delivered 20+ client projects on time",
      "Improved website load times by 50%",
      "Collaborated with design team on UI implementations",
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

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const experiences = [
  {
    title: "Frontend Developer",
    company: "Adroid IT Solutions",
    period: "2025 - Present",
    description: "Leading the development of web and mobile interfaces with React.js and React Native.",
    achievements: [
      "Spearheaded frontend development of multiple mobile and web products, achieving improved responsiveness and user retention.",
      "Integrated AI chatbot & real-time notification systems, boosting user engagement and reducing manual support.",
      "Collaborated with backend teams on Node.js, KeystoneJS and Laravel integrations, enhancing system reliability and data flow.",
    ],
  },
  {
    title: "Frontend Developer",
    company: "AppCrates",
    period: "2024 - 2025",
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
    period: "2023 - 2024",
    description: "Developed dynamic user interfaces and implemented responsive layouts for web applications.",
    achievements: [
      "Developed CRM web applications and a ride-booking mobile app using React Native.",
      "Focused on performance optimization, UI/UX enhancements, and efficient state management.",
      "Collaborated with teams to implement new features and ensure scalable solutions.",
    ],
  },
];

const colors = ["190 95% 60%", "290 90% 65%", "330 90% 65%"];

export const ExperienceCyber = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" ref={ref} className="relative w-full overflow-hidden py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Mission Log · 04"
          title="Work"
          accent="Experience"
          description="Operational history across studios and product teams."
        />

        <div className="relative">
          {/* Vertical timeline */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[hsl(190_95%_60%)] via-[hsl(290_90%_65%)] to-[hsl(330_90%_65%)] shadow-[0_0_12px_hsl(290_90%_60%)] md:left-1/2 md:-translate-x-1/2" />

          {experiences.map((exp, i) => {
            const c = colors[i % colors.length];
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative mb-12 flex flex-col md:flex-row ${isLeft ? "md:flex-row-reverse" : ""}`}
              >
                {/* Dot */}
                <div
                  className="absolute left-4 top-6 h-4 w-4 -translate-x-1/2 rounded-full border-2 md:left-1/2"
                  style={{
                    backgroundColor: `hsl(${c})`,
                    borderColor: "hsl(240 30% 4%)",
                    boxShadow: `0 0 18px hsl(${c})`,
                  }}
                />

                <div className="hidden md:block md:w-1/2" />

                <div className={`w-full pl-12 md:w-1/2 md:pl-0 ${isLeft ? "md:pr-10" : "md:pl-10"}`}>
                  <div
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/25"
                    style={{ boxShadow: `0 20px 50px -20px hsl(${c}/0.4)` }}
                  >
                    <span
                      className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2"
                      style={{ borderColor: `hsl(${c})` }}
                    />

                    <div className="mb-3 flex items-start gap-3">
                      <div
                        className="grid h-10 w-10 place-items-center rounded-lg border"
                        style={{
                          backgroundColor: `hsl(${c}/0.12)`,
                          borderColor: `hsl(${c}/0.4)`,
                          boxShadow: `0 0 20px -6px hsl(${c}/0.6)`,
                        }}
                      >
                        <Briefcase className="h-4 w-4" style={{ color: `hsl(${c})` }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                        <p className="text-sm font-semibold" style={{ color: `hsl(${c})` }}>
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
                      <Calendar className="h-3.5 w-3.5" />
                      {exp.period}
                    </div>

                    <p className="mb-4 text-sm text-white/70">{exp.description}</p>

                    <ul className="space-y-2">
                      {exp.achievements.map((a, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-white/65">
                          <span
                            className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: `hsl(${c})`, boxShadow: `0 0 8px hsl(${c})` }}
                          />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceCyber;

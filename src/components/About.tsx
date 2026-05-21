import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Code, Smartphone, MapPin, Calendar } from "lucide-react";

const stats = [
  { icon: Zap, value: "2+", label: "Years Exp.", color: "text-amber-500" },
  { icon: Code, value: "20+", label: "Projects", color: "text-primary" },
  { icon: Smartphone, value: "React", label: "/ Native", color: "text-cyan-500" },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 relative overflow-hidden"
    >
      {/* Subtle orb */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-sm font-mono text-primary mb-2">// about me</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Who I <span className="gradient-text">Am</span>
          </h2>
          <div className="section-line" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left — image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-border/60 glass shadow-xl aspect-square max-w-sm mx-auto lg:mx-0">
              <img
                src="/about-removebg.png"
                alt="About Luqman"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
            </div>
            {/* Location badge */}
            <div className="absolute -bottom-4 left-1/2 lg:left-8 -translate-x-1/2 lg:translate-x-0 glass border border-border/60 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-lg">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Daska City, Pakistan</span>
            </div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-bold leading-snug">
              Turning ideas into{" "}
              <span className="gradient-text">digital reality</span>
            </h3>

            <p className="text-muted-foreground leading-relaxed">
              I'm a{" "}
              <span className="text-foreground font-semibold">
                Frontend Developer
              </span>{" "}
              with 2+ years of experience crafting intuitive, high-performance
              web and mobile applications using React.js and React Native.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              I focus on detail-oriented interfaces, real-time features, and
              efficient architectures that scale gracefully. My passion lies in
              blending creativity and logic to deliver smooth, visually stunning
              user experiences.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {stats.map(({ icon: Icon, value, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="glass border border-border/60 rounded-2xl p-4 text-center hover:border-primary/40 transition-colors"
                >
                  <Icon className={`h-5 w-5 ${color} mx-auto mb-2`} />
                  <p className="text-xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick info */}
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { icon: Calendar, text: "Frontend Developer since 2023" },
                { icon: Code, text: "React / React Native Specialist" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary rounded-full px-3 py-1.5"
                >
                  <Icon className="h-3 w-3 text-primary" />
                  {text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

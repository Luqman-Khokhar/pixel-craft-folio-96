import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-30" />
              <div className="relative bg-card rounded-2xl overflow-hidden border border-border shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
                  alt="Profile"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold">
              Frontend Developer
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm a Frontend Developer with over 2 years of professional experience specializing in building modern, responsive, and high-performance web and mobile applications. I focus on crafting smooth UI/UX experiences using React.js and React Native.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I love bringing ideas to life with clean, efficient code and real-time functionality.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  2+
                </div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  30+
                </div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  20+
                </div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  15+
                </div>
                <div className="text-sm text-muted-foreground">Technologies</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

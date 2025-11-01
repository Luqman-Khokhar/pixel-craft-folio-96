import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code, Smartphone, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { isDark } = useTheme();

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background w-full overflow-x-hidden"
    >
      {/* subtle background light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,132,0,0.08),transparent_70%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 tracking-tight leading-tight">
            About{" "}
            <span className="rainbow bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="mt-3 sm:mt-5 w-16 sm:w-24 h-1 bg-rainbow mx-auto rounded-full" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5 sm:space-y-7 text-center md:text-left px-2"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Turning ideas into{" "}
              <span className="text-primary">digital reality</span>
            </h3>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              I'm a{" "}
              <span className="text-foreground font-semibold">
                Frontend Developer
              </span>{" "}
              with 2+ years of experience building intuitive, high-performance
              web and mobile applications using React.js and React Native.
            </p>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              I focus on detail-oriented interfaces, real-time features, and
              efficient architectures that scale gracefully. My passion lies in
              blending creativity and logic to deliver smooth, visually stunning
              user experiences.
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6">
              {[
                { icon: <Zap className="text-orange-500" />, value: "2+", label: "Years" },
                { icon: <Code className="text-pink-500" />, value: "20+", label: "Projects" },
                { icon: <Smartphone className="text-blue-500" />, value: "React / RN", label: "Tech Focus" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card/80 border border-border rounded-lg sm:rounded-xl py-3 sm:py-5 flex flex-col items-center justify-center shadow-md backdrop-blur-lg"
                >
                  <div className="mb-1 sm:mb-2">{item.icon}</div>
                  <div className="text-base sm:text-xl font-bold">{item.value}</div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative flex justify-center mt-6 md:mt-0"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-[90%] sm:w-[80%] md:w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              <div className="absolute -inset-6 sm:-inset-10 bg-rainbow opacity-25 blur-[90px] sm:blur-[120px] rounded-full mix-blend-screen" />
              <motion.img
                src="/about-removebg.png"
                alt="Profile"
                className="relative z-10 w-full h-auto max-h-[420px] sm:max-h-[480px] object-contain drop-shadow-2xl"
              />
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-transparent ${
                  isDark ? "to-[#0a0a0a]" : "to-primary/10"
                }`}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

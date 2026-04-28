import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code, Smartphone, Zap } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export const AboutCyber = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { icon: <Zap className="h-5 w-5" />, value: "2+", label: "Years", color: "190 95% 60%" },
    { icon: <Code className="h-5 w-5" />, value: "20+", label: "Projects", color: "290 90% 65%" },
    { icon: <Smartphone className="h-5 w-5" />, value: "React / RN", label: "Tech Focus", color: "330 90% 65%" },
  ];

  return (
    <section id="about" ref={ref} className="relative w-full overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Profile · 01"
          title="About"
          accent="Me"
          description="Decoding pixels into living, breathing interfaces."
        />

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
          {/* LEFT — text glass panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[hsl(190_95%_55%/0.3)] bg-white/[0.03] p-7 backdrop-blur-xl shadow-[0_0_40px_-10px_hsl(290_90%_60%/0.4),inset_0_1px_0_0_hsl(0_0%_100%/0.08)]">
              {/* HUD corners */}
              {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map(
                (p, i) => (
                  <span key={i} className={`absolute h-4 w-4 ${p} border-[hsl(190_95%_70%)]`} />
                )
              )}

              <h3 className="text-2xl sm:text-3xl font-bold leading-tight text-white">
                Turning ideas into{" "}
                <span className="bg-gradient-to-r from-[hsl(190_95%_70%)] to-[hsl(290_90%_70%)] bg-clip-text text-transparent">
                  digital reality
                </span>
              </h3>

              <p className="mt-5 text-sm sm:text-base text-white/70 leading-relaxed">
                I'm a <span className="font-semibold text-white">Frontend Developer</span> with 2+
                years of experience building intuitive, high-performance web and mobile applications
                using React.js and React Native.
              </p>
              <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
                I focus on detail-oriented interfaces, real-time features, and efficient
                architectures that scale gracefully. My passion lies in blending creativity and
                logic to deliver smooth, visually stunning user experiences.
              </p>

              {/* Stat chips */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-xl"
                    style={{ boxShadow: `0 0 0 0 hsl(${s.color}/0)` }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 10px 30px -10px hsl(${s.color}/0.6)`)}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 0 0 hsl(${s.color}/0)`)}
                  >
                    <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white" style={{ color: `hsl(${s.color})` }}>
                      {s.icon}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/50">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — avatar holo card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="relative aspect-[4/5] w-full">
              <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(circle_at_50%_30%,hsl(290_90%_60%/0.35),transparent_60%)] blur-2xl" />
              <div className="absolute inset-0 rounded-3xl border border-[hsl(290_90%_60%/0.4)] bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-xl shadow-[0_0_60px_-10px_hsl(190_95%_55%/0.5)]" />

              {/* Animated corners */}
              {["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map(
                (p, i) => (
                  <span key={i} className={`absolute h-6 w-6 ${p} border-[hsl(290_90%_70%)] shadow-[0_0_12px_hsl(290_90%_60%)]`} />
                )
              )}

              <div className="absolute inset-6 overflow-hidden rounded-2xl">
                <motion.img
                  src="/about-removebg.png"
                  alt="Profile"
                  className="absolute inset-0 h-full w-full object-contain object-bottom"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay [background:repeating-linear-gradient(0deg,transparent_0px,transparent_3px,hsl(190_95%_70%)_4px,transparent_5px)]" />
                <motion.div
                  className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[hsl(290_90%_60%/0.3)] to-transparent"
                  animate={{ y: ["-20%", "120%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutCyber;

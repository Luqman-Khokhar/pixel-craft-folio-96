"use client";
import { motion } from "framer-motion";
import {
  
  Github,
  Figma,
  Code2,
  Smartphone,
  Database,
  Cloud,
  Server,
  GitBranch,
  Rocket,
  Cpu,
  Palette,
  Terminal,
} from "lucide-react";

const icons = [
  Code2,
  Smartphone,
  Database,
  Cloud,
  GitBranch,
  Server,
  Cpu,
  Palette,
  Figma,
  Github,
  Terminal,
  Rocket,
];

export const InfiniteSkillsScroll = () => {
  return (
    <div className="relative w-full overflow-hidden py-10 bg-transparent">
      <motion.div
        className="flex gap-10 w-max"
        animate={{
          x: ["0%", "-50%"], // Scroll halfway then loop (since we duplicate icons)
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20, // speed (lower = faster)
        }}
      >
        {[...icons, ...icons].map((Icon, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-300"
          >
            <Icon className="w-8 h-8 text-primary" />
          </div>
        ))}
      </motion.div>

      {/* gradient fade on sides */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
};

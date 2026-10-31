import { motion, useReducedMotion } from "framer-motion";

const HEX = "M50 4 L90 27 L90 73 L50 96 L10 73 L10 27 Z";
const INNER = "M50 12 L83 31 L83 69 L50 88 L17 69 L17 31 Z";
const TICKS = ["M50 0 V4", "M94 25 L90 27", "M94 75 L90 73", "M50 100 V96", "M6 75 L10 73", "M6 25 L10 27"];

/** Hexagonal "LK" seal: the brand mark, drawn stroke-by-stroke on the entry screen. */
export function Crest({ className = "", draw = false }: { className?: string; draw?: boolean }) {
  const reduce = useReducedMotion();
  const animated = draw && !reduce;
  const stroke = (delay: number, duration = 1) =>
    animated
      ? {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration, delay, ease: [0.6, 0, 0.2, 1] as const },
        }
      : {};
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <motion.path d={HEX} strokeWidth={2.2} {...stroke(0)} />
      <motion.path d={INNER} strokeWidth={0.8} {...stroke(0.15)} />
      {TICKS.map((d) => (
        <motion.path key={d} d={d} strokeWidth={2.2} {...stroke(0.55, 0.3)} />
      ))}
      <motion.text
        x="50"
        y="63"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="Melodrama, Georgia, serif"
        fontWeight={700}
        fontSize="38"
        initial={animated ? { opacity: 0 } : undefined}
        animate={animated ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        LK
      </motion.text>
    </svg>
  );
}

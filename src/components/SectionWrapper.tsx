import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SectionWrapperProps {
  children: ReactNode;
  zIndex: number;
  isFirst?: boolean;
  isLast?: boolean;
}

/**
 * Stacked-card parallax wrapper.
 *
 * Visual contract:
 * • First section (Hero): no border-radius, no margin, base layer.
 * • Every subsequent section: rounded top corners + strong top-shadow
 *   slides OVER the previous one, like a card being dealt onto a pile.
 * • While a section scrolls OUT (progress 0→1 via useScroll target):
 *   - scale shrinks  1 → 0.88
 *   - opacity fades  1 → 0.70
 *   - a dark scrim   0 → 0.40  covers it (simulates going into shadow)
 */
export function SectionWrapper({
  children,
  zIndex,
  isFirst = false,
  isLast  = false,
}: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Tracks: 0 = this section's TOP at viewport TOP
  //          1 = this section's BOTTOM at viewport TOP  (fully scrolled out)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale        = useTransform(scrollYProgress, [0, 1],         [1,    0.88]);
  const opacity      = useTransform(scrollYProgress, [0, 0.75, 1],   [1,    0.95, 0.70]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.4,  1],   [0,    0.08, 0.40]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        zIndex,
        // Overlap: card slides over previous section
        marginTop: isFirst ? 0 : "-40px",
        // Rounded top = "card" feel (no overflow:hidden so sticky inside still works)
        borderRadius: isFirst ? 0 : "28px 28px 0 0",
        // No bottom radius except final section
        ...(isLast ? { borderRadius: "28px 28px 28px 28px" } : {}),
        overflow: "hidden",
      }}
      className={
        isFirst
          ? ""
          : "shadow-[0_-28px_80px_rgba(0,0,0,0.65)]"
      }
    >
      {/* Content scales + fades as next card covers it */}
      <motion.div
        style={{
          scale,
          opacity,
          transformOrigin: "top center",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </motion.div>

      {/* Dark scrim overlay — intensifies as section is covered */}
      <motion.div
        aria-hidden
        style={{ opacity: scrimOpacity }}
        className="absolute inset-0 bg-black pointer-events-none"
      />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { EASE } from "./primitives";

const FONT = "700 100px Melodrama";

function measure(text: string): number {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * 42;
  ctx.font = FONT;
  return ctx.measureText(text).width;
}

/** One line of display type sized to span its container exactly, capped by viewport height. */
function useFitSize(text: string, maxVh: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setSize(Math.min((el.clientWidth / measure(text)) * 100, (window.innerHeight * maxVh) / 0.8));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [text, maxVh]);
  return { ref, size };
}

interface FitLineProps {
  text: string;
  ready: boolean;
  maxVh: number;
  outline: MotionValue<number>;
  fill: MotionValue<number>;
  delay?: number;
}

export function FitLine({ text, ready, maxVh, outline, fill, delay = 0 }: FitLineProps) {
  const { ref, size } = useFitSize(text, maxVh);
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="relative w-full" style={{ height: size * 0.8 }}>
      <motion.div
        className="absolute inset-0 flex justify-center overflow-hidden whitespace-pre font-display font-bold leading-[0.8] text-paper"
        style={{ fontSize: size, opacity: fill }}
      >
        {text.split("").map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={reduce ? false : { y: "105%" }}
            animate={ready ? { y: 0 } : undefined}
            transition={{ duration: 1.1, delay: delay + i * 0.035, ease: EASE }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.div>
      <motion.div
        className="title-outline absolute inset-0 flex justify-center whitespace-pre font-display font-bold leading-[0.8]"
        style={{ fontSize: size, opacity: outline }}
      >
        {text}
      </motion.div>
    </div>
  );
}

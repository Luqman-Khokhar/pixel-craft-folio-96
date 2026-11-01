import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { EASE_SOFT } from "./primitives";

const FONT = "700 100px Melodrama";
const LINE = 0.8;
// Room below the line for the Q's tail, so the reveal mask doesn't clip it.
const MASK = 1;

function measure(text: string): number {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * 42;
  ctx.font = FONT;
  return ctx.measureText(text).width;
}

/** Font size that spans the box exactly, and the box height the width/height ratio asks for. */
function useFit(text: string, ratio: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ size: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setFit({ size: (el.clientWidth / measure(text)) * 100, height: el.clientWidth / ratio });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    document.fonts?.ready.then(update);
    return () => ro.disconnect();
  }, [text, ratio]);
  return { ref, ...fit };
}

interface EchoTitleProps {
  text: string;
  ready: boolean;
  /** Width over height of the title: lower stretches the letters taller. */
  ratio: number;
  /** One hollow copy per entry, moved by its own scroll-driven offset. */
  echoes: { y: MotionValue<number>; opacity: MotionValue<number> }[];
}

/** One line of display type stretched to fill a poster-sized box, with hollow copies that fall away behind it. */
export function EchoTitle({ text, ready, ratio, echoes }: EchoTitleProps) {
  const { ref, size, height } = useFit(text, ratio);
  const reduce = useReducedMotion();
  const line = {
    fontSize: size,
    lineHeight: LINE,
    height: size * MASK,
    transform: `scaleY(${size ? height / (size * LINE) : 1})`,
    transformOrigin: "top",
  };
  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {!reduce && echoes.map((echo, i) => (
        <motion.div key={i} className="absolute inset-x-0 top-0" style={{ y: echo.y, opacity: echo.opacity }}>
          <div className="title-outline flex justify-center whitespace-pre font-display font-bold" style={line}>{text}</div>
        </motion.div>
      ))}
      <div className="title-solid absolute inset-x-0 top-0 flex justify-center overflow-hidden whitespace-pre font-display font-bold" style={line}>
        {text.split("").map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            // A transform string, not y: runs on the compositor, so the rise stays smooth while the WebGL symbols start up.
            initial={reduce ? false : { transform: "translateY(105%)", opacity: 0 }}
            animate={ready ? { transform: "translateY(0%)", opacity: 1 } : undefined}
            transition={{ duration: 1.5, delay: 0.25 + i * 0.025, ease: EASE_SOFT }}
          >
            {ch}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

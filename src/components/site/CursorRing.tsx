import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "./primitives";

/** A ring trailing the native cursor (kept visible). Swells over anything clickable. */
export function CursorRing() {
  const fine = useMediaQuery("(pointer: fine)");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 420, damping: 36, mass: 0.5 });
  const [hot, setHot] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!fine || reduce) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target instanceof Element ? e.target : null;
      // The WebGL scene names its hover through the body; only trust that while over a canvas.
      const named = (t?.closest("canvas") && document.body.dataset.cursorLabel) || "";
      setLabel(named);
      setHot(!!named || !!t?.closest("a, button, input, textarea, [role='button']"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, reduce, x, y]);

  if (!fine || reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[90] -ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-full border border-honey text-ink transition-colors duration-200 ${label ? "bg-honey" : "bg-transparent"}`}
      style={{ x: sx, y: sy }}
      animate={{ scale: label ? 2.1 : hot ? 1.5 : 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {label ? <span className="font-mono text-[0.4rem] font-medium uppercase tracking-widest">{label}</span> : null}
    </motion.div>
  );
}

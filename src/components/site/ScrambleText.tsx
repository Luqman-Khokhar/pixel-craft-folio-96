import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHKLMNOPRSTUVXYZ0123456789/+*";

/** Text that resolves letter by letter from noise when its value changes. */
export function ScrambleText({ text, duration = 650 }: { text: string; duration?: number }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(text);
  const raf = useRef(0);

  useEffect(() => {
    if (reduce) {
      setShown(text);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min((now - start) / duration, 1);
      const settled = Math.floor(k * text.length);
      let out = text.slice(0, settled);
      for (let i = settled; i < text.length; i++) {
        out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setShown(out);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [text, duration, reduce]);

  return (
    <span aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}

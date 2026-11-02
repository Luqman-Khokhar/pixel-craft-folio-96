import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

export const EASE = [0.7, 0, 0.2, 1] as const;
export const EASE_OUT = [0.19, 1, 0.22, 1] as const;
export const EASE_WIPE = [0.76, 0, 0.24, 1] as const;
// Starts from rest and settles slowly: for things arriving while something else is still moving.
export const EASE_SOFT = [0.33, 0, 0.15, 1] as const;

export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** Fired when a scene changes the surface behind the nav marks without the page scrolling. */
export const NAV_TONE_EVENT = "nav-tone";

/** Live time at the owner's location. */
export function useClock(timeZone: string): string {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 20000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
}

/** Label that rolls upward on hover or focus of the parent link/button. */
export const Roll = ({ children }: { children: string }) => (
  <span className="roll">
    <span>{children}</span>
    <span aria-hidden="true">{children}</span>
  </span>
);

/** Heading letters rising out of a mask once in view. */
export function RiseText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, w, words) => (
        <span key={w} aria-hidden="true" className="inline-block overflow-hidden whitespace-nowrap pb-[0.08em] align-bottom">
          {word.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={reduce ? false : { y: "115%" }}
              animate={inView ? { y: 0 } : undefined}
              transition={{ duration: 0.9, delay: delay + (w * 3 + i) * 0.025, ease: EASE }}
            >
              {ch}
            </motion.span>
          ))}
          {w < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}

const Word = ({ word, progress, start, end }: { word: string; progress: MotionValue<number>; start: number; end: number }) => {
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  return <motion.span style={{ opacity }} className="inline-block whitespace-pre">{word} </motion.span>;
};

/** Paragraph whose words ink in as it is scrolled through. */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 62%"] });
  const words = text.split(" ");
  if (reduce) return <p ref={ref} className={className}>{text}</p>;
  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} start={i / words.length} end={(i + 1.6) / words.length} />
        ))}
      </span>
    </p>
  );
}

/** Soft rise-and-fade wrapper for non-heading blocks. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

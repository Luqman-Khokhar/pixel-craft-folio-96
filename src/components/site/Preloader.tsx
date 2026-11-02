import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { symbolsWarm } from "@/lib/symbolsWarm";
import { LoaderSeal } from "./LoaderSeal";

// The seal finishes inking at about 2330ms; the rest of the hold lets the finished mark register.
const HOLD_MS = 2800;
const LIFT_SECONDS = 2;
// Eases in briefly: a long slow start would spend the fully visible part of the lift barely moving.
const LIFT_EASE = [0.45, 0, 0.25, 1] as const;
// Rise first, fade second: the screen only starts to fade once the rise has clearly read.
const FADE_DELAY = 0.7;
// The seal clears sooner than the screen, so it never ghosts over the hero's text arriving beneath it.
const SEAL_FADE_DELAY = 0.8;
const SEAL_FADE_SECONDS = 0.8;
// The hero starts as the fade does, so the two overlap and read as a single move.
const HERO_CUE_MS = 700;
// How far the screen rises: enough to read as a lift, while keeping the seal on screen so its fade is seen.
const RISE_PERCENT = 32;
// Soft trailing edge below the screen, seen as its lower edge rises over the hero.
const FEATHER_VH = 30;

// Animated as transform strings, not x/y: those run on the compositor, so the lift stays smooth while the hero's WebGL scene starts up on the main thread.
const SCREEN_EXIT: TargetAndTransition = {
  transform: `translateY(-${RISE_PERCENT}%)`,
  opacity: 0,
  transition: {
    transform: { duration: LIFT_SECONDS, ease: LIFT_EASE },
    opacity: { duration: LIFT_SECONDS - FADE_DELAY, delay: FADE_DELAY, ease: [0.4, 0, 0.6, 1] },
  },
};
const SEAL_EXIT: TargetAndTransition = {
  opacity: 0,
  transition: { duration: SEAL_FADE_SECONDS, delay: SEAL_FADE_DELAY, ease: [0.4, 0, 0.6, 1] },
};
const FADE_EXIT = { opacity: 0, transition: { duration: 0.3 } };

/** Entry screen, on every page load: the seal inks itself in, then the whole screen rises and fades off the hero. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hold = reduce ? 800 : HOLD_MS;
    let cancelled = false;
    let cue = 0;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const wait = new Promise((r) => window.setTimeout(r, hold));
    // Never let a slow font network hold the entry screen hostage.
    const cap = new Promise((r) => window.setTimeout(r, hold + 1800));
    Promise.race([Promise.all([fonts, wait, symbolsWarm]), cap]).then(() => {
      if (cancelled) return;
      setVisible(false);
      cue = window.setTimeout(onDone, reduce ? 0 : HERO_CUE_MS);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(cue);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="screen-deepen fixed inset-0 z-[100] grid place-items-center bg-ink-deep text-honey"
          style={{ transform: "translateY(0%)" }}
          exit={reduce ? FADE_EXIT : SCREEN_EXIT}
          role="status"
          aria-label="Loading portfolio"
        >
          <motion.div exit={reduce ? FADE_EXIT : SEAL_EXIT}>
            <LoaderSeal className="seal-breathe h-56 w-auto sm:h-64" />
          </motion.div>
          <div aria-hidden="true" className="absolute inset-x-0 top-full bg-gradient-to-b from-ink-deep to-transparent" style={{ height: `${FEATHER_VH}vh` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

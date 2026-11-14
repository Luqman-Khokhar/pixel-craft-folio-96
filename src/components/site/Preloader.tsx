import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { SEEN_KEY, introSeen, symbolsWarm } from "@/lib/symbolsWarm";
import { LoaderSeal } from "./LoaderSeal";

// The seal finishes inking at about 750ms; first visit reaches a visible hero by ~1.1s and is clear by ~1.4s.
const HOLD_MS = 800;
const LIFT_SECONDS = 0.6;
const LIFT_EASE = [0.45, 0, 0.25, 1] as const;
const FADE_DELAY = 0.15;
const SEAL_FADE_DELAY = 0.05;
const SEAL_FADE_SECONDS = 0.3;
// The hero starts as the screen begins to lift, so the two overlap and read as a single move.
const HERO_CUE_MS = 250;
const RISE_PERCENT = 20;
const FEATHER_VH = 20;

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

/** Entry screen, first visit per session only: the seal inks itself in, then the screen lifts off the hero. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [skip] = useState(introSeen);
  const [visible, setVisible] = useState(!skip);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: the intro just plays again next load */
    }
    const hold = reduce ? 300 : HOLD_MS;
    let cancelled = false;
    let cue = 0;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const wait = new Promise((r) => window.setTimeout(r, hold));
    // Never let a slow font network or the WebGL warm-up hold the entry screen hostage.
    const cap = new Promise((r) => window.setTimeout(r, hold + 150));
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

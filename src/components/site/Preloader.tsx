import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Crest } from "./Crest";

const SEEN_KEY = "lk-entry-seen";

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** Entry screen: the seal draws itself, then lifts away. Short on repeat visits in a session. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hold = reduce || alreadySeen() ? 150 : 1500;
    let cancelled = false;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const wait = new Promise((r) => window.setTimeout(r, hold));
    // Never let a slow font network hold the entry screen hostage.
    const cap = new Promise((r) => window.setTimeout(r, hold + 1800));
    Promise.race([Promise.all([fonts, wait]), cap]).then(() => {
      if (cancelled) return;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage unavailable: entry just plays in full next time */
      }
      setVisible(false);
      onDone();
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink text-honey"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          role="status"
          aria-label="Loading portfolio"
        >
          <motion.div exit={{ scale: 0.82, opacity: 0 }} transition={{ duration: 0.4 }}>
            <Crest draw className="h-24 w-24 sm:h-32 sm:w-32" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

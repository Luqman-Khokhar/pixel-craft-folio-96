import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { symbolsWarm } from "@/lib/symbolsWarm";
import { LoaderSeal } from "./LoaderSeal";

/** Entry screen, on every page load: the seal draws itself, then lifts away. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hold = reduce ? 800 : 2600;
    let cancelled = false;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const wait = new Promise((r) => window.setTimeout(r, hold));
    // Never let a slow font network hold the entry screen hostage.
    const cap = new Promise((r) => window.setTimeout(r, hold + 1800));
    Promise.race([Promise.all([fonts, wait, symbolsWarm]), cap]).then(() => {
      if (cancelled) return;
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
            <LoaderSeal className="seal-breathe h-56 w-auto sm:h-64" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

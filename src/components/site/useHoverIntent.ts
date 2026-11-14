import { useEffect, useRef, type PointerEvent } from "react";

// A pointer that comes to rest on a row for this long means it.
const REST_MS = 90;
// Moving mostly rightward is the pointer on its way to the stage: rows crossed on the way have to be held much longer.
const PASSING_MS = 280;

/**
 * Selection that follows the mouse without snatching at every row it crosses.
 * A row is picked once the pointer settles on it; a quick sweep across the list, or a diagonal run to the stage, picks nothing.
 * Scrolling the page under a still pointer picks nothing either. Touch and pen are left to click.
 */
export function useHoverIntent(onIntent: (index: number) => void, enabled: boolean) {
  const timer = useRef<number>();
  const last = useRef<{ x: number; y: number } | null>(null);
  const latest = useRef(onIntent);
  latest.current = onIntent;

  const cancel = () => window.clearTimeout(timer.current);
  useEffect(() => cancel, []);

  return (index: number) =>
    enabled
      ? {
          onPointerMove: (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const from = last.current;
            last.current = { x: e.clientX, y: e.clientY };
            // The page moved under a pointer that didn't: not a choice.
            if (from && from.x === e.clientX && from.y === e.clientY) return;
            const dx = from ? e.clientX - from.x : 0;
            const dy = from ? e.clientY - from.y : 0;
            const passing = dx > 1 && dx > Math.abs(dy) * 1.2;
            cancel();
            timer.current = window.setTimeout(() => latest.current(index), passing ? PASSING_MS : REST_MS);
          },
          onPointerLeave: cancel,
        }
      : {};
}

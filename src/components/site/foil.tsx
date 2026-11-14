import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { chamferPath } from "./foilGeometry";

/** A card is 275 wide; a plate scales the card's cut, foil and margin by its own width, up to this much. */
const CARD_W = 275;
const MAX_UNIT = 1.6;

/**
 * Paper stock with the card's honey foil frame, cut to whatever size its content makes it.
 * Same geometry as a table card (10 cut, foil 7 in, margin 7.5%), scaled to the plate.
 */
export function FoilPlate({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize((s) => (s && s.w === el.offsetWidth && s.h === el.offsetHeight ? s : { w: el.offsetWidth, h: el.offsetHeight }));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const u = size ? Math.min(MAX_UNIT, Math.max(1, size.w / CARD_W)) : 1;
  const style = { "--u": u, padding: `${(CARD_W * 0.075 * u).toFixed(2)}px` } as CSSProperties;

  return (
    <div ref={ref} className={`foil-plate relative text-ink ${className}`} style={style}>
      {size && (
        <svg aria-hidden="true" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} className="pointer-events-none absolute inset-0 overflow-visible">
          <path d={chamferPath(size.w, size.h, 0, 10 * u)} className="fill-paper" />
          <path d={chamferPath(size.w, size.h, 7 * u, 7 * u)} vectorEffect="non-scaling-stroke" strokeWidth="1.25" className="fill-none stroke-honey-deep/70" />
        </svg>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

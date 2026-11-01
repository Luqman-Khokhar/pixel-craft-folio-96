import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { animate, easeOut, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import type { TableCard } from "@/data/portfolio";
import { EASE_OUT } from "./primitives";

const DOUBLE_CLICK_MS = 400;
const W = 275;
const H = 350;

/** A rectangle with cut corners, drawn `inset` in from the card edge. */
const chamfered = (inset: number, cut: number) =>
  `M${inset + cut} ${inset} H${W - inset - cut} L${W - inset} ${inset + cut} V${H - inset - cut} L${W - inset - cut} ${H - inset} H${inset + cut} L${inset} ${H - inset - cut} V${inset + cut} Z`;

const OUTER = chamfered(1.5, 9);
const INNER = chamfered(7, 7);

export interface DeckSlot {
  /** Landscape position, as % of the table. */
  lx: number;
  ly: number;
  /** Portrait position, as % of the table. */
  px: number;
  py: number;
  /** Size relative to a normal card, in each orientation. */
  k?: number;
  pk?: number;
  rot: number;
  /** Place in the order the cards are dealt. */
  order: number;
}

interface DeckCardProps {
  card: TableCard;
  slot: DeckSlot;
  /** Scroll progress of the whole table, 0 to 1. */
  progress: MotionValue<number>;
  /** The stretch of progress over which this card falls into place. */
  range: [number, number];
  /** Where the fall starts, in vh above the card's place. */
  fallFrom: number;
  animated: boolean;
  focused: boolean;
  z: number;
  fine: boolean;
  table: RefObject<HTMLDivElement>;
  onPick: () => void;
  onOpen: () => void;
  onReveal: () => void;
}

/** One card on the table: scrolling deals it in from above and takes it back out, it lifts when picked up, drags anywhere, opens on a double click or Enter. */
export function DeckCard({ card, slot, progress, range, fallFrom, animated, focused, z, fine, table, onPick, onOpen, onReveal }: DeckCardProps) {
  const [landed, setLanded] = useState(() => !animated || progress.get() >= range[1]);
  const dragged = useRef(false);
  const lastClick = useRef(0);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const fall = useTransform(progress, range, [`${fallFrom}vh`, "0vh"], { ease: easeOut });
  const turn = useTransform(progress, range, [slot.rot * 0.3, slot.rot]);
  const style = { "--lx": `${slot.lx}%`, "--ly": `${slot.ly}%`, "--px": `${slot.px}%`, "--py": `${slot.py}%`, "--k": slot.k ?? 1, "--pk": slot.pk ?? 1, zIndex: z } as CSSProperties;

  useMotionValueEvent(progress, "change", (p) => {
    if (animated) setLanded(p >= range[1]);
  });

  // Dealt back out: a moved card goes home on its way up, so the next fall starts clean.
  useEffect(() => {
    if (landed) return;
    const moves = [animate(dragX, 0, { duration: 0.45, ease: EASE_OUT }), animate(dragY, 0, { duration: 0.45, ease: EASE_OUT })];
    return () => moves.forEach((move) => move.stop());
  }, [landed, dragX, dragY]);

  return (
    <li className="deck-slot" style={style}>
      <motion.div className="h-full w-full" style={{ y: animated ? fall : 0 }}>
        <motion.button
          type="button"
          aria-label={`${card.title}, ${card.sheet.type}. Press Enter to open details.`}
          className={`relative block h-full w-full select-none text-ink ${landed ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
          style={{ x: dragX, y: dragY, rotate: animated ? turn : slot.rot }}
          initial={false}
          animate={{ scale: focused ? 1.05 : 1 }}
          whileHover={fine ? { scale: focused ? 1.05 : 1.02 } : undefined}
          whileDrag={{ scale: 1.07 }}
          transition={{ scale: { duration: 0.35, ease: EASE_OUT } }}
          drag={!landed ? false : fine ? true : "x"}
          dragConstraints={table}
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={() => {
            dragged.current = true;
          }}
          onPointerDown={(e) => {
            dragged.current = false;
            if (e.pointerType !== "touch") onPick();
          }}
          onFocus={(e) => {
            if (!e.currentTarget.matches(":focus-visible")) return;
            onPick();
            if (!landed) onReveal();
          }}
          onClick={(e) => {
            if (dragged.current) {
              lastClick.current = 0;
              return;
            }
            onPick();
            // Enter and Space report detail 0: a keyboard user has no double click to reach for.
            if (e.detail === 0 || e.timeStamp - lastClick.current < DOUBLE_CLICK_MS) {
              lastClick.current = 0;
              onOpen();
              return;
            }
            lastClick.current = e.timeStamp;
          }}
        >
          <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
            <path d={OUTER} vectorEffect="non-scaling-stroke" strokeWidth="2.25" className={`fill-azure transition-[stroke] duration-300 ${focused ? "stroke-honey" : "stroke-ink"}`} />
            <path d={INNER} vectorEffect="non-scaling-stroke" strokeWidth="1.25" className={`fill-none transition-[stroke] duration-300 ${focused ? "stroke-honey/70" : "stroke-ink/55"}`} />
          </svg>

          <span className="relative flex h-full w-full flex-col items-center justify-center px-[9%] pb-[8%] text-center [container-type:inline-size]">
            <span className="block text-[max(0.6875rem,4.5cqw)] font-medium leading-tight">{card.label}</span>
            <span aria-hidden="true" className="my-[6cqw] flex w-[45cqw] items-center gap-[3cqw]">
              <span className="h-px flex-1 bg-honey" />
              <span className="h-[2cqw] min-h-1 w-[2cqw] min-w-1 rotate-45 bg-honey" />
              <span className="h-px flex-1 bg-honey" />
            </span>
            <span className="block font-display text-[16cqw] font-bold leading-[1.02] tracking-tight [text-wrap:balance]">{card.title}</span>
            <span className="mt-[4.5cqw] block font-display text-[max(0.75rem,7.2cqw)] font-bold leading-tight">{card.sub}</span>
            {card.accent && <span className="deck-note mt-[3.5cqw] block font-display text-[max(0.75rem,6.4cqw)] font-bold leading-tight text-honey-deep">{card.accent}</span>}
            {card.note && <span className="deck-note mt-[3.5cqw] block text-[max(0.625rem,3.7cqw)] leading-snug text-ink/70">{card.note}</span>}
          </span>
        </motion.button>
      </motion.div>
    </li>
  );
}

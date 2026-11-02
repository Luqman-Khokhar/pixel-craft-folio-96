import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { animate, easeOut, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { platformLabel, type TableCard } from "@/data/portfolio";
import { PLATFORM_ICONS } from "./platformIcons";
import { EASE_OUT } from "./primitives";

const W = 275;
const H = 350;

/** A rectangle with cut corners, drawn `inset` in from the card edge. */
const chamfered = (inset: number, cut: number) =>
  `M${inset + cut} ${inset} H${W - inset - cut} L${W - inset} ${inset + cut} V${H - inset - cut} L${W - inset - cut} ${H - inset} H${inset + cut} L${inset} ${H - inset - cut} V${inset + cut} Z`;

const OUTER = chamfered(0, 10);
const FOIL = chamfered(7, 7);
const FOIL_INNER = chamfered(10.5, 5.5);

/** The card's stock and the foil frame printed inside it. */
function Stock({ fill, foil, double = false }: { fill: string; foil: string; double?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
      <path d={OUTER} className={fill} />
      <path d={FOIL} vectorEffect="non-scaling-stroke" strokeWidth="1.25" className={`fill-none transition-[stroke] duration-200 ${foil}`} />
      {double && <path d={FOIL_INNER} vectorEffect="non-scaling-stroke" strokeWidth="0.75" className={`fill-none ${foil}`} />}
    </svg>
  );
}

/** The printed face of a card. Fills its parent, which sets the size. A project shows its cover and platform; a stat card shows its figure. */
export function CardFace({ card, focused = false }: { card: TableCard; focused?: boolean }) {
  const { cover, platform } = card.sheet;

  if (!cover) {
    return (
      <span className="absolute inset-0 text-paper [container-type:inline-size]">
        <Stock fill="fill-ink" foil={focused ? "stroke-honey" : "stroke-honey/55"} double />
        <span className="relative flex h-full w-full flex-col items-center justify-center px-[10%] text-center">
          <span className="block text-[max(0.6875rem,4.6cqw)] font-medium leading-tight text-paper/80">{card.label}</span>
          <span className="mt-[3cqw] block font-display text-[34cqw] font-bold leading-[0.9] text-honey">{card.title}</span>
          <span className="mt-[4cqw] block font-display text-[max(0.8125rem,8cqw)] font-bold leading-tight">{card.sub}</span>
        </span>
      </span>
    );
  }

  const icons = PLATFORM_ICONS[platform];
  return (
    <span className="absolute inset-0 text-ink [container-type:inline-size]">
      <Stock fill="fill-paper" foil={focused ? "stroke-honey-deep" : "stroke-honey-deep/45"} />
      <span className="card-window absolute left-[7.5cqw] right-[7.5cqw] top-[7.5cqw] h-[66cqw] bg-ink">
        <img src={cover} alt="" width={1600} height={1000} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
      </span>
      {/* Set from the foot of the card up, so a one-line name and a two-line name both sit on the same baseline. */}
      <span className="absolute inset-x-[9cqw] bottom-[10cqw] flex flex-col items-start text-left">
        <span className="flex items-center gap-[1.4cqw] text-[max(0.6875rem,4.3cqw)] font-medium leading-none text-ink/80">
          {icons.map((Icon, i) => (
            <Icon key={i} aria-hidden="true" strokeWidth={1.75} className="h-[max(0.75rem,4.8cqw)] w-[max(0.75rem,4.8cqw)] shrink-0" />
          ))}
          <span className="ml-[0.6cqw]">{platformLabel[platform]}</span>
        </span>
        <span className="mt-[2.6cqw] block font-display text-[11.5cqw] font-bold leading-[1.02] tracking-[-0.01em] [text-wrap:balance]">{card.title}</span>
        <span className="deck-note mt-[2.4cqw] block text-[max(0.6875rem,4.3cqw)] leading-tight text-ink/70">{card.label}</span>
      </span>
    </span>
  );
}

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
  /** Lifted off the table into the close-up: its place stays, the card is in hand. */
  held: boolean;
  z: number;
  fine: boolean;
  table: RefObject<HTMLDivElement>;
  buttonRef: (el: HTMLButtonElement | null) => void;
  onPick: () => void;
  onOpen: () => void;
  onReveal: () => void;
}

const TILT = 9;

/** One card on the table: scrolling deals it in from above and takes it back out, it tilts toward the mouse, drags anywhere, and a click picks it up. */
export function DeckCard({ card, slot, progress, range, fallFrom, animated, focused, held, z, fine, table, buttonRef, onPick, onOpen, onReveal }: DeckCardProps) {
  const reduce = useReducedMotion();
  const [landed, setLanded] = useState(() => !animated || progress.get() >= range[1]);
  const [dragging, setDragging] = useState(false);
  const dragged = useRef(false);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const fall = useTransform(progress, range, [`${fallFrom}vh`, "0vh"], { ease: easeOut });
  const turn = useTransform(progress, range, [slot.rot * 0.3, slot.rot]);
  const tiltX = useSpring(0, { stiffness: 240, damping: 20, mass: 0.6 });
  const tiltY = useSpring(0, { stiffness: 240, damping: 20, mass: 0.6 });
  const tilts = fine && !reduce && landed;
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

  const level = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <li className={`deck-slot ${held ? "invisible" : ""}`} style={style}>
      <motion.div className="h-full w-full" style={{ y: animated ? fall : 0 }}>
        <motion.button
          ref={buttonRef}
          type="button"
          aria-haspopup="dialog"
          aria-label={`${card.title}: ${card.sheet.type}${card.sheet.cover ? `, ${platformLabel[card.sheet.platform]}` : ""}`}
          data-lifted={focused || dragging || undefined}
          data-airborne={!landed || undefined}
          className={`deck-card relative block h-full w-full select-none ${landed ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
          style={{ x: dragX, y: dragY, rotate: animated ? turn : slot.rot, rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
          initial={false}
          animate={{ scale: dragging ? 1.07 : focused ? 1.05 : 1 }}
          whileHover={fine && !dragging ? { scale: focused ? 1.05 : 1.025 } : undefined}
          transition={{ scale: { type: "spring", stiffness: 420, damping: 30 } }}
          drag={!landed ? false : fine ? true : "x"}
          dragConstraints={table}
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={() => {
            dragged.current = true;
            setDragging(true);
            level();
          }}
          onDragEnd={() => setDragging(false)}
          onPointerMove={(e) => {
            if (!tilts || dragging || e.buttons) return;
            const box = e.currentTarget.getBoundingClientRect();
            tiltY.set(((e.clientX - box.left) / box.width - 0.5) * 2 * TILT);
            tiltX.set(-((e.clientY - box.top) / box.height - 0.5) * 2 * TILT);
          }}
          onPointerLeave={level}
          onPointerDown={(e) => {
            dragged.current = false;
            if (e.pointerType !== "touch") onPick();
          }}
          onFocus={(e) => {
            if (!e.currentTarget.matches(":focus-visible")) return;
            onPick();
            if (!landed) onReveal();
          }}
          onClick={() => {
            if (dragged.current) return;
            level();
            onPick();
            onOpen();
          }}
        >
          <CardFace card={card} focused={focused} />
        </motion.button>
      </motion.div>
    </li>
  );
}

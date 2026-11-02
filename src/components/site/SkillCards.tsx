import { useEffect, useRef, useState, type FocusEvent, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, type MotionValue } from "framer-motion";
import type { TableCard } from "@/data/portfolio";
import { CardFace } from "./DeckCard";
import { EASE_OUT, useMediaQuery } from "./primitives";

export interface SkillProof {
  name: string;
  cards: TableCard[];
}

const CARD_RATIO = 350 / 275;
const GAP = 24;
const EDGE = 16;
// Moving between neighbouring skills crosses a gap; the cards should not drop in it.
const HIDE_DELAY_MS = 90;
// Skills sliding under a resting mouse during a scroll are not a hover.
const SCROLL_QUIET_MS = 160;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/** Step between fanned cards: enough to read every title, tightened only where the screen can't hold them. */
const spreadOf = (cardWidth: number, count: number) =>
  count < 2 ? 0 : Math.min(cardWidth * 0.86, (window.innerWidth - 2 * EDGE - cardWidth) / (count - 1));

/** Which skill's project cards are showing, and where. A mouse carries them along; touch and keyboard pin them to the skill. */
export function useSkillCards() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const cardWidth = wide ? 168 : 104;

  const [open, setOpen] = useState<SkillProof | null>(null);
  const openRef = useRef<SkillProof | null>(null);
  openRef.current = open;
  const pinned = useRef<HTMLElement | null>(null);
  const hideTimer = useRef(0);
  const lastScroll = useRef(0);
  const lastPointer = useRef("");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  /** Centres the fan on `middle`, above `upper` or else below `lower`, so it never covers the skill it belongs to. */
  const place = (middle: number, upper: number, lower: number, count: number, jump: boolean) => {
    const width = cardWidth + (count - 1) * spreadOf(cardWidth, count);
    const height = cardWidth * CARD_RATIO;
    const above = upper - height - GAP;
    const left = clamp(middle - width / 2, EDGE, window.innerWidth - width - EDGE);
    const top = clamp(above >= EDGE ? above : lower + GAP, EDGE, window.innerHeight - height - EDGE);
    if (jump) {
      x.jump(left);
      y.jump(top);
      springX.jump(left);
      springY.jump(top);
    } else {
      x.set(left);
      y.set(top);
    }
  };

  const toCursor = (clientX: number, clientY: number, count: number, jump: boolean) => place(clientX, clientY, clientY, count, jump);

  const toSkill = (el: HTMLElement, count: number, jump: boolean) => {
    const box = el.getBoundingClientRect();
    place(box.left + box.width / 2, box.top, box.bottom, count, jump);
  };

  const show = (proof: SkillProof, place: (jump: boolean) => void) => {
    window.clearTimeout(hideTimer.current);
    place(!openRef.current);
    setOpen(proof);
  };

  const hide = () => {
    window.clearTimeout(hideTimer.current);
    pinned.current = null;
    setOpen(null);
  };

  const pin = (proof: SkillProof, el: HTMLElement) => {
    pinned.current = el;
    show(proof, (jump) => toSkill(el, proof.cards.length, jump));
  };

  useEffect(() => {
    const onScroll = () => {
      lastScroll.current = performance.now();
      const el = pinned.current;
      const proof = openRef.current;
      if (!proof) return;
      if (!el) return hide();
      const box = el.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return hide();
      toSkill(el, proof.cards.length, true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target instanceof Element && e.target.closest("[data-skill-proof]"))) hide();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
      window.clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardWidth]);

  /** Props for the button of a skill with projects behind it. */
  const propsFor = (proof: SkillProof) => ({
    "data-skill-proof": true,
    "data-open": open?.name === proof.name ? true : undefined,
    onPointerEnter: (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (e.pointerType !== "mouse" || performance.now() - lastScroll.current < SCROLL_QUIET_MS) return;
      if (reduce) return pin(proof, e.currentTarget);
      pinned.current = null;
      show(proof, (jump) => toCursor(e.clientX, e.clientY, proof.cards.length, jump));
    },
    onPointerMove: (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (e.pointerType !== "mouse" || reduce || openRef.current?.name !== proof.name) return;
      toCursor(e.clientX, e.clientY, proof.cards.length, false);
    },
    onPointerLeave: (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (e.pointerType !== "mouse" || e.currentTarget === document.activeElement) return;
      hideTimer.current = window.setTimeout(hide, HIDE_DELAY_MS);
    },
    onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
      lastPointer.current = e.pointerType;
    },
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      const touched = lastPointer.current === "touch" || lastPointer.current === "pen";
      lastPointer.current = "";
      if (!touched) return;
      if (openRef.current?.name === proof.name) hide();
      else pin(proof, e.currentTarget);
    },
    onFocus: (e: FocusEvent<HTMLButtonElement>) => {
      if (e.currentTarget.matches(":focus-visible")) pin(proof, e.currentTarget);
    },
    onBlur: () => {
      if (pinned.current) hide();
    },
  });

  return { open, propsFor, left: reduce ? x : springX, top: reduce ? y : springY, cardWidth };
}

interface SkillCardsProps {
  open: SkillProof | null;
  left: MotionValue<number>;
  top: MotionValue<number>;
  cardWidth: number;
}

/** A small fan of project cards, dealt in over the page. Decorative to assistive tech: the skill's button names the same projects. */
export function SkillCards({ open, left, top, cardWidth }: SkillCardsProps) {
  const reduce = useReducedMotion();
  const cards = open?.cards ?? [];
  const middle = (cards.length - 1) / 2;
  const spread = spreadOf(cardWidth, cards.length);
  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[55] text-ink" style={{ x: left, y: top }}>
      <AnimatePresence>
        {cards.map((card, i) => {
          const rotate = cards.length === 1 ? -2.6 : (i - middle) * 3;
          return (
            <motion.div
              key={card.title}
              className="deck-card absolute left-0 top-0"
              style={{ width: cardWidth, height: cardWidth * CARD_RATIO, zIndex: i }}
              initial={reduce ? false : { x: i * spread, y: -36, rotate: rotate * 0.3, opacity: 0 }}
              animate={{ x: i * spread, y: Math.abs(i - middle) * 6, rotate, opacity: 1 }}
              exit={reduce ? undefined : { y: 20, opacity: 0, transition: { duration: 0.15, ease: EASE_OUT } }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: EASE_OUT }}
            >
              <CardFace card={card} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

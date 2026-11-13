import type { FocusEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, Ref } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SkillProof, useSkillCards } from "./SkillCards";

type ProofProps = ReturnType<ReturnType<typeof useSkillCards>["propsFor"]>;

/** Runs the key's own handler, then the project fan's. */
const both =
  <E,>(own?: (e: E) => void, fan?: (e: E) => void) =>
  (e: E) => {
    own?.(e);
    fan?.(e);
  };

export interface Ripple {
  id: number;
  delay: number;
}

interface KeycapProps {
  proof: SkillProof;
  label: string;
  /** Seconds this key waits before dropping in, so a board lands row by row. */
  delay: number;
  compact: boolean;
  shown: boolean;
  pressed: boolean;
  dimmed: boolean;
  focusable: boolean;
  ripple: Ripple | null;
  proofProps?: ProofProps;
  buttonRef: Ref<HTMLButtonElement>;
  onPress: () => void;
  onHover: (on: boolean) => void;
  onFocusKey: () => void;
}

/** One skill as a key. Width follows the legend so every row fills like a real board; a latched key stays lit until another is pressed. */
export function Keycap({ proof, label, delay, compact, shown, pressed, dimmed, focusable, ripple, proofProps, buttonRef, onPress, onHover, onFocusKey }: KeycapProps) {
  const reduce = useReducedMotion();
  const count = proof.cards.length;
  // Arriving keys drop in on a spring; leaving ones just get out of the way.
  const variants = reduce
    ? { on: { opacity: 1, transition: { duration: 0.15 } }, off: { opacity: 0, transition: { duration: 0.1 } } }
    : {
        on: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 420, damping: 26, delay } },
        off: { opacity: 0, y: -22, transition: { duration: 0.12 } },
      };

  return (
    <motion.li
      className={`flex min-w-[5.5rem] ${compact ? "" : "lg:min-w-0"}`}
      style={{ flexGrow: Math.max(5, proof.name.length), flexBasis: 0 }}
      variants={variants}
      initial={reduce ? false : "off"}
      animate={shown ? "on" : "off"}
    >
      <button
        ref={buttonRef}
        type="button"
        tabIndex={focusable ? 0 : -1}
        aria-pressed={pressed}
        aria-label={label}
        data-dim={dimmed ? true : undefined}
        className={`keycap relative flex w-full items-center justify-center rounded-xl px-3 py-1.5 text-center font-medium leading-tight [text-wrap:balance] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-honey ${
          compact ? "min-h-[clamp(2.75rem,7.5svh,4.25rem)] text-[0.875rem] [@media(max-height:480px)]:min-h-9" : "min-h-[2.25rem] text-[clamp(0.8125rem,1.45svh,1.125rem)]"
        }`}
        {...proofProps}
        onPointerEnter={both((e: ReactPointerEvent<HTMLButtonElement>) => e.pointerType === "mouse" && onHover(true), proofProps?.onPointerEnter)}
        onPointerLeave={both((e: ReactPointerEvent<HTMLButtonElement>) => e.pointerType === "mouse" && onHover(false), proofProps?.onPointerLeave)}
        onClick={both((_: ReactMouseEvent<HTMLButtonElement>) => onPress(), proofProps?.onClick)}
        onFocus={both((_: FocusEvent<HTMLButtonElement>) => onFocusKey(), proofProps?.onFocus)}
      >
        {ripple && !reduce && <span key={ripple.id} aria-hidden="true" className="key-ripple" style={{ animationDelay: `${ripple.delay}ms` }} />}
        {proof.name}
        {count > 0 && (
          <span aria-hidden="true" className="absolute right-1.5 top-1 font-mono text-[0.625rem] leading-none opacity-60">
            {count}
          </span>
        )}
      </button>
    </motion.li>
  );
}

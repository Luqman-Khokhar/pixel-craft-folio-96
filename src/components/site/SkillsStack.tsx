import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { cardsUsing, skills } from "@/data/portfolio";
import { scrollToY } from "@/lib/smoothScroll";
import { RiseText, useMediaQuery } from "./primitives";
import { SkillCards, useSkillCards, type SkillProof } from "./SkillCards";
import { StackPlates } from "./StackPlates";

// Top of the app to the bottom: what people touch, down to where it ships.
const ORDER = ["UI / UX", "Frontend", "State Management", "Real-time & APIs", "Backend Familiarity", "Deployment"];
const rank = (category: string) => {
  const i = ORDER.indexOf(category);
  return i === -1 ? ORDER.length : i;
};

/** "A", "A and B", "A, B and C". */
const listFormat = {
  format: (names: string[]) => (names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`),
};

const LAYERS = [...skills]
  .sort((a, b) => rank(a.category) - rank(b.category))
  .map((group) => {
    const proofs = group.items.map((name): SkillProof => ({ name, cards: cardsUsing(name) }));
    const shippedIn = [...new Set(proofs.flatMap((proof) => proof.cards.map((card) => card.title)))];
    return { ...group, proofs, shippedIn };
  });

// The first stretch of scroll pulls the app apart; then each layer gets an equal turn, and a short hold ends it.
const OPEN_END = 0.1;
const TURN = 0.84 / LAYERS.length;
const layerAt = (p: number) => Math.min(Math.max(Math.floor((p - OPEN_END) / TURN), 0), LAYERS.length - 1);

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

interface Swap {
  dir: number;
  /** Arriving from fully hidden, so it may start from its offset; otherwise it retargets from wherever it is. */
  fresh: boolean;
}

interface LayerPanelProps {
  layer: (typeof LAYERS)[number];
  index: number;
  on: boolean;
  dir: number;
  propsFor: ReturnType<typeof useSkillCards>["propsFor"];
}

/** One layer's skills. All six share one grid cell, so the tallest sets the height and nothing jumps when they swap. */
function LayerPanel({ layer, index, on, dir, propsFor }: LayerPanelProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Stays painted only while it leaves, then drops out of sight and out of the tab order.
  const [painted, setPainted] = useState(on);
  useEffect(() => {
    if (on) setPainted(true);
    if (ref.current) ref.current.inert = !on;
  }, [on]);

  // Going down the stack the next layer rises from below; going back up it drops in from above.
  // Enter 280ms, exit 150ms, both ease-out: the leaving layer gets out of the way before the new one settles.
  const variants = reduce
    ? { on: { opacity: 1, transition: { duration: 0.2 } }, off: { opacity: 0, transition: { duration: 0.12 } } }
    : {
        on: ({ dir: d, fresh }: Swap) => ({
          opacity: 1,
          y: fresh ? [16 * d, 0] : 0,
          filter: "blur(0px)",
          transition: { duration: 0.28, delay: 0.04, ease: EASE_OUT_STRONG },
        }),
        off: ({ dir: d }: Swap) => ({ opacity: 0, y: -12 * d, filter: "blur(4px)", transition: { duration: 0.15, ease: EASE_OUT_STRONG } }),
      };
  const swap: Swap = { dir, fresh: on && !painted };

  return (
    <motion.div
      ref={ref}
      id={`skill-layer-${index}`}
      aria-hidden={!on}
      className="[grid-area:1/1]"
      style={{ visibility: painted ? "visible" : "hidden" }}
      custom={swap}
      variants={variants}
      initial={false}
      animate={on ? "on" : "off"}
      onAnimationComplete={(definition) => definition === "off" && setPainted(false)}
    >
      <h3 className="font-display text-[clamp(2.5rem,5.2vw,5.75rem)] font-bold leading-[0.95] tracking-[-0.02em] [text-wrap:balance]">{layer.category}</h3>
      <p className="mt-2 text-lg leading-snug text-honey md:mt-4 md:text-xl">{layer.layer}</p>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-base leading-relaxed md:mt-7 md:gap-x-6 md:gap-y-2 md:text-xl">
        {layer.proofs.map((proof) => (
          <li key={proof.name}>
            {proof.cards.length > 0 ? (
              <button
                type="button"
                aria-label={`${proof.name}, shipped in ${listFormat.format(proof.cards.map((card) => card.title))}`}
                className="rounded-sm underline decoration-honey decoration-1 underline-offset-[0.3em] transition-transform duration-150 ease-out active:scale-[0.97] data-[open]:decoration-2 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-2"
                {...propsFor(proof)}
              >
                {proof.name}
              </button>
            ) : (
              <span>{proof.name}</span>
            )}
          </li>
        ))}
      </ul>
      {layer.shippedIn.length > 0 && (
        <p className="mt-4 max-w-[34rem] text-[0.9375rem] leading-snug text-paper/75 md:mt-7 md:text-base">
          Shipped in {listFormat.format(layer.shippedIn)}
        </p>
      )}
    </motion.div>
  );
}

function StackHeading({ className = "" }: { className?: string }) {
  return (
    <header className={className}>
      <h2 className="font-display text-[clamp(2.5rem,3.4vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.02em]">
        <RiseText text="Skills" />
      </h2>
      <p className="mt-2 max-w-[24rem] text-base leading-relaxed text-paper/80 md:mt-4 md:text-lg">
        Six layers of an app, from the screen you touch to the store it ships from.
      </p>
    </header>
  );
}

/** The skills as the layers of one app. Scrolling pulls the stack apart and hands each layer out in turn, top to bottom; a layer can also be picked from the stack or the list. */
export function SkillsStack() {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const pinned = !reduce;
  const wide = useMediaQuery("(min-width: 768px)");
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [peek, setPeek] = useState<number | null>(null);
  const activeRef = useRef(0);
  const { open: fan, propsFor, left, top, cardWidth } = useSkillCards();

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 30, restDelta: 0.0005 });
  const opening = useTransform(smooth, [0, OPEN_END], [0, 1], { clamp: true });
  const fullyOpen = useMotionValue(1);

  // The last screen is held under the projects sheet: the stage stays pinned and sinks back as the sheet slides over it.
  const cover = useRef<HTMLDivElement>(null);
  const { scrollYProgress: covered } = useScroll({ target: cover, offset: ["start end", "start start"] });
  const sink = useTransform(covered, [0, 1], [1, 0.94]);
  const shade = useTransform(covered, [0, 1], [0, 0.6]);

  const choose = (next: number) => {
    if (next === activeRef.current) return;
    setDir(next > activeRef.current ? 1 : -1);
    activeRef.current = next;
    setActive(next);
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (pinned) choose(layerAt(p));
  });
  useEffect(() => {
    if (pinned) choose(layerAt(scrollYProgress.get()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned]);

  // Pinned, a layer is reached by scrolling to its turn, so the stack and the page never disagree.
  // A keyboard press jumps straight there: animating a keyboard action only makes it feel slow.
  const go = (i: number, instant = false) => {
    const el = track.current;
    if (!pinned || !el) return choose(i);
    const start = el.getBoundingClientRect().top + window.scrollY;
    const y = start + (el.offsetHeight - window.innerHeight) * (OPEN_END + (i + 0.5) * TURN);
    if (instant) window.scrollTo(0, y);
    else scrollToY(y);
  };

  return (
    <section id="skills" className="sheet-edge relative -mt-10 bg-ink text-paper md:-mt-16">
      {/* A phone needs the whole pinned screen for the stack, so the heading scrolls past first. */}
      {!wide && <StackHeading className="mx-auto max-w-[100rem] px-4 pt-20 sm:px-6" />}
      {/* Pinned: 460svh of layers, then one more screen that the projects sheet covers (it overlaps by exactly that much). */}
      <div className={pinned ? "relative h-[560svh]" : "relative"}>
        <div ref={track} aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 ${pinned ? "h-[460svh]" : "h-full"}`} />
        <div ref={cover} aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 ${pinned ? "h-svh" : "h-0"}`} />
        {/* The frame stays full size so the whole screen dims evenly; only what is on it sinks back. */}
        <div className={pinned ? "sticky top-0 h-svh" : ""}>
        <motion.div
          style={pinned ? { scale: sink } : undefined}
          className={`${pinned ? "h-full origin-[50%_35%] pb-6 md:pb-12" : "min-h-svh pb-20 md:pb-28"} mx-auto flex max-w-[100rem] flex-col px-4 pt-16 sm:px-6 md:grid md:grid-cols-12 md:grid-rows-[auto_minmax(0,1fr)] md:gap-x-10 md:pt-28`}
        >
          {wide && <StackHeading className="md:col-span-5 md:row-start-1" />}

          <div className="relative my-4 min-h-[9rem] flex-1 md:col-span-7 md:col-start-6 md:row-span-2 md:row-start-1 md:my-0">
            <StackPlates layers={LAYERS} active={active} open={pinned ? opening : fullyOpen} openGap={wide ? 100 : 74} peek={peek} onPick={go} onPeek={setPeek} />
          </div>

          <div className="md:col-span-5 md:row-start-2 md:self-end">
            <div className="grid">
              {LAYERS.map((layer, i) => (
                <LayerPanel key={layer.category} layer={layer} index={i} on={i === active} dir={dir} propsFor={propsFor} />
              ))}
            </div>

            <nav aria-label="Skill layers" className="mt-8 max-md:sr-only max-md:focus-within:not-sr-only max-md:focus-within:mt-4">
              <ol className="flex flex-wrap gap-x-5 gap-y-1">
                {LAYERS.map((layer, i) => (
                  <li key={layer.category}>
                    <button
                      type="button"
                      aria-current={i === active ? "true" : undefined}
                      aria-controls={`skill-layer-${i}`}
                      onClick={(e) => go(i, e.detail === 0)}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setPeek(i)}
                      onPointerLeave={(e) => e.pointerType === "mouse" && setPeek(null)}
                      className={`flex items-center gap-2 py-1 text-[0.9375rem] transition-[color,transform] duration-150 ease-out active:scale-[0.97] ${
                        i === active ? "text-honey" : "text-paper/70 [@media(hover:hover)]:hover:text-paper"
                      }`}
                    >
                      <span aria-hidden="true" className="relative h-2 w-2">
                        {i === active && (
                          <motion.span
                            layoutId={reduce ? undefined : "skill-layer-mark"}
                            className="absolute inset-0"
                            transition={{ type: "spring", stiffness: 520, damping: 40 }}
                          >
                            <span className="absolute inset-0 rotate-45 bg-honey" />
                          </motion.span>
                        )}
                      </span>
                      {layer.category}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </motion.div>
        {pinned && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink-deep" style={{ opacity: shade }} />}
        </div>
      </div>

      <SkillCards open={fan} left={left} top={top} cardWidth={cardWidth} />
    </section>
  );
}

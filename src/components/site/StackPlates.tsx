import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";

export interface StackLayer {
  category: string;
  items: string[];
}

// One slab in its own plane, before it is turned to the isometric view.
const W = 500;
const H = 320;
const R = 28;
// Turned 45° and squashed: x' = A·x + C·y, y' = B·x + D·y.
const SQUASH = 0.56;
const A = Math.SQRT1_2;
const B = SQUASH * Math.SQRT1_2;
const C = -Math.SQRT1_2;
const D = SQUASH * Math.SQRT1_2;
const MATRIX = `matrix(${A} ${B} ${C} ${D} 0 0)`;

/** Screen units of a slab's side. */
const THICK = 18;
const SIDE_STEP = 3;
const SIDES = Array.from({ length: THICK / SIDE_STEP }, (_, i) => THICK - i * SIDE_STEP);
/** Plane units the layer in hand slides out toward the reader, and a hovered one peeks. */
const PULL = 170;
const PEEK = 38;

const SLAB = `M${R} 0H${W - R}A${R} ${R} 0 0 1 ${W} ${R}V${H - R}A${R} ${R} 0 0 1 ${W - R} ${H}H${R}A${R} ${R} 0 0 1 0 ${H - R}V${R}A${R} ${R} 0 0 1 ${R} 0Z`;

const FACE_HEIGHT = B * W + D * H;
const LEFT = C * H + C * PULL;
const RIGHT = A * W;
const PAD = 10;

/** The stack's full height at a given gap between slabs, without a pulled slab's overhang. */
const heightAt = (gap: number, count: number) => FACE_HEIGHT + (count - 1) * gap + THICK;

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

// The printed skill list: flows in lines across the face and sits just above the layer's name, as large as four lines allow.
// Anchored to the front edge, because the back of a pulled slab is still under the one above it.
const PRINT_LEFT = 32;
const PRINT_WIDTH = W - 2 * PRINT_LEFT;
const PRINT_LAST_LINE = 202;
const PRINT_MAX_LINES = 4;
const PRINT_SIZES = [24, 22, 20, 18];
const PRINT_FONT = (size: number) => `500 ${size}px "General Sans", system-ui, sans-serif`;

interface Print {
  size: number;
  words: { text: string; x: number; y: number }[];
}

let measurer: CanvasRenderingContext2D | null = null;
const measure = (text: string, size: number) => {
  measurer ??= document.createElement("canvas").getContext("2d");
  if (!measurer) return text.length * size * 0.56;
  measurer.font = PRINT_FONT(size);
  return measurer.measureText(text).width;
};

/** Wraps the items at the largest size that keeps them to five lines. */
function layOut(items: string[]): Print {
  let lines: { text: string; x: number; line: number }[] = [];
  let size = PRINT_SIZES[0];
  let count = 1;
  for (size of PRINT_SIZES) {
    const gap = size * 0.85;
    let x = 0;
    let line = 0;
    lines = items.map((text) => {
      const w = measure(text, size);
      if (x > 0 && x + w > PRINT_WIDTH) {
        line += 1;
        x = 0;
      }
      const at = { text, x: PRINT_LEFT + x, line };
      x += w + gap;
      return at;
    });
    count = line + 1;
    if (count <= PRINT_MAX_LINES) break;
  }
  const lead = size * 1.32;
  const first = PRINT_LAST_LINE - (count - 1) * lead;
  return { size, words: lines.map(({ text, x, line }) => ({ text, x, y: first + line * lead })) };
}

/** Measuring before the face has loaded would wrap the list for the fallback font. */
function usePrintFontReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    const fonts = document.fonts;
    if (!fonts) return setReady(true);
    fonts.load(PRINT_FONT(PRINT_SIZES[0])).finally(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, []);
  return ready;
}

interface SlabProps {
  layer: StackLayer;
  print: Print;
  index: number;
  count: number;
  gap: MotionValue<number>;
  lift: MotionValue<number>;
  open: MotionValue<number>;
  pulled: boolean;
  peeking: boolean;
  shown: boolean;
  onPick: (i: number) => void;
  onPeek: (i: number | null) => void;
}

function Slab({ layer, print, index, count, gap, lift, open, pulled, peeking, shown, onPick, onPeek }: SlabProps) {
  const reduce = useReducedMotion();
  const slide = useSpring(0, { stiffness: 320, damping: 34, mass: 0.9 });
  const target = pulled ? PULL : peeking ? PEEK : 0;
  useEffect(() => {
    if (reduce) slide.jump(target);
    else slide.set(target);
  }, [reduce, slide, target]);

  // A closed app has nothing pulled out: the slide grows with the opening.
  const x = useTransform([slide, open], ([s, o]: number[]) => C * s * o);
  const y = useTransform([gap, lift, slide, open], ([g, l, s, o]: number[]) => l + index * g + D * s * o);
  // The printed list is only legible where nothing rests on it: the top slab, or the one pulled out.
  const printed = pulled || index === 0;

  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, y: -80 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: (count - 1 - index) * 0.07, ease: EASE_OUT_STRONG }}
    >
      <motion.g
        style={{ x, y }}
        data-on={pulled || undefined}
        className="stack-slab cursor-pointer"
        whileTap={reduce ? undefined : { scale: 0.985 }}
        onClick={() => onPick(index)}
        onPointerEnter={(e) => e.pointerType === "mouse" && onPeek(index)}
        onPointerLeave={(e) => e.pointerType === "mouse" && onPeek(null)}
      >
        {SIDES.map((t) => (
          <path key={t} d={SLAB} transform={`translate(0 ${t}) ${MATRIX}`} className={pulled ? "fill-honey-deep" : "fill-paper-shade"} />
        ))}
        <g transform={MATRIX}>
          <path d={SLAB} className={pulled ? "fill-honey" : "fill-paper"} />
          <g className={`transition-opacity duration-200 ease-out ${printed ? "opacity-100" : "opacity-0"}`}>
            {print.words.map((word) => (
              <text key={word.text} x={word.x} y={word.y} fontSize={print.size} className="fill-ink font-sans font-medium">
                {word.text}
              </text>
            ))}
          </g>
          <text x={32} y={H - 36} fontSize={46} className="fill-ink font-display font-bold">
            {layer.category}
          </text>
        </g>
      </motion.g>
    </motion.g>
  );
}

interface StackPlatesProps {
  layers: StackLayer[];
  active: number;
  /** 0 is the closed app, 1 is the stack pulled fully apart. */
  open: MotionValue<number>;
  /** Screen units between slabs once fully open. */
  openGap: number;
  peek: number | null;
  onPick: (i: number) => void;
  onPeek: (i: number | null) => void;
}

/** The app as a stack of slabs, top layer first. Opening spreads them; the layer in hand slides out toward the reader and turns honey. Decorative to assistive tech: the layer buttons beside it do the same job. */
export function StackPlates({ layers, active, open, openGap, peek, onPick, onPeek }: StackPlatesProps) {
  const ref = useRef<SVGSVGElement>(null);
  const shown = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = layers.length;
  const full = heightAt(openGap, count);
  const gap = useTransform(open, (o) => THICK + (openGap - THICK) * o);
  // Keeps the stack centred as it opens, so it grows both ways.
  const lift = useTransform(gap, (g) => (full - heightAt(g, count)) / 2);
  const fontReady = usePrintFontReady();
  const prints = useMemo(() => layers.map((layer) => layOut(layer.items)), [layers, fontReady]); // eslint-disable-line react-hooks/exhaustive-deps
  const overhang = D * PULL;
  const viewBox = `${LEFT - PAD} ${-PAD} ${RIGHT - LEFT + 2 * PAD} ${full + overhang + 2 * PAD}`;

  return (
    <svg ref={ref} aria-hidden="true" viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full overflow-visible">
      {/* Painted bottom first, so each slab rests over the one below it. */}
      {layers
        .map((layer, index) => ({ layer, index }))
        .reverse()
        .map(({ layer, index }) => (
          <Slab
            key={layer.category}
            layer={layer}
            print={prints[index]}
            index={index}
            count={count}
            gap={gap}
            lift={lift}
            open={open}
            pulled={index === active}
            peeking={index === peek && index !== active}
            shown={shown}
            onPick={onPick}
            onPeek={onPeek}
          />
        ))}
    </svg>
  );
}

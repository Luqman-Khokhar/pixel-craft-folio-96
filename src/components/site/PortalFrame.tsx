import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { about } from "@/data/portfolio";
import { createTornPaint } from "@/lib/tornPaint";
import { OrnateFrame } from "./OrnateFrame";
import { NAV_TONE_EVENT } from "./primitives";

// Where each part of the scene plays, as shares of the pinned scroll.
const WORDS_START = 0.12;
const WORDS_SPREAD = 0.14;
const WORD_FADE = 0.08;
const PAINT = [0.24, 0.8];
const ZOOM = [0.3, 0.82];
const CUE_TRACK_END = 0.66;
const CUE_FADE = [0.62, 0.68];

// Share of the frame artwork that is border, from OrnateFrame's 400 x 500 drawing.
const BORDER_X = 15 / 400;
const BORDER_Y = 15 / 500;
// Past the screen edge, so the notched corners are gone by the time the scene unpins.
const COVER_MARGIN = 1.3;
const PAINT_REACH = 0.55;
// Where the nav marks sit, from the top corner of the screen.
const NAV_MARK = { x: 56, y: 48 };

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const FRAME_SIZE = "relative aspect-[4/5] h-[min(68svh,calc((100vw-2.5rem)*1.25))]";
const FRAME_TEXT = "absolute inset-[14%] grid place-items-center text-balance text-center font-display text-[clamp(1.9rem,6.4svh,3.9rem)] font-medium leading-[1.04] tracking-tight text-ink";

/** Reads a theme color token as the 0–1 rgb the shader wants. */
function tokenRgb(token: string): [number, number, number] {
  const probe = document.createElement("div");
  probe.style.color = `hsl(${getComputedStyle(document.documentElement).getPropertyValue(token).trim()})`;
  document.body.appendChild(probe);
  const [r, g, b] = (getComputedStyle(probe).color.match(/[\d.]+/g) ?? ["255", "255", "255"]).map(Number);
  probe.remove();
  return [r / 255, g / 255, b / 255];
}

function FadingWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = WORDS_START + (WORDS_SPREAD * index) / Math.max(total - 1, 1);
  const opacity = useTransform(progress, [start, start + WORD_FADE], [1, 0]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

function ScrollPortal() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cover = useRef(8);
  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });

  const scale = useTransform(p, (v) => Math.pow(cover.current, easeInOut(clamp01((v - ZOOM[0]) / (ZOOM[1] - ZOOM[0])))));
  const track = useTransform(p, [0, CUE_TRACK_END], [0, 1]);
  const cueOpacity = useTransform(p, CUE_FADE, [1, 0]);
  const cueY = useTransform(p, CUE_FADE, [0, 12]);
  const words = about.headline.split(" ");

  useEffect(() => {
    const stageEl = stage.current;
    const frameEl = frame.current;
    const canvasEl = canvas.current;
    if (!stageEl || !frameEl || !canvasEl) return;
    const paint = createTornPaint(canvasEl, tokenRgb("--paper"));

    const measure = () => {
      const innerW = frameEl.offsetWidth * (1 - BORDER_X * 2);
      const innerH = frameEl.offsetHeight * (1 - BORDER_Y * 2);
      cover.current = COVER_MARGIN * Math.max(stageEl.offsetWidth / innerW, stageEl.offsetHeight / innerH);
      paint?.resize();
    };
    measure();
    const resized = new ResizeObserver(measure);
    resized.observe(stageEl);

    let raf = 0;
    let painted = false;
    const setNavTone = (tone: "light" | "dark") => {
      const sectionEl = section.current;
      if (!sectionEl || sectionEl.dataset.navTone === tone) return;
      sectionEl.dataset.navTone = tone;
      window.dispatchEvent(new Event(NAV_TONE_EVENT));
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!paint) return;
      const grown = clamp01((p.get() - PAINT[0]) / (PAINT[1] - PAINT[0]));
      const spread = (grown * grown * Math.hypot(stageEl.offsetWidth, stageEl.offsetHeight)) / PAINT_REACH;
      if (spread < 0.5) {
        if (painted) paint.clear();
        painted = false;
        stageEl.dataset.tone = "dark";
        setNavTone("dark");
        return;
      }
      const box = frameEl.getBoundingClientRect();
      const home = stageEl.getBoundingClientRect();
      const borderX = box.width * BORDER_X;
      const borderY = box.height * BORDER_Y;
      paint.draw(
        { x: box.left - home.left + borderX, y: box.top - home.top + borderY, width: box.width - borderX * 2, height: box.height - borderY * 2 },
        spread,
        now / 1000
      );
      painted = true;
      // Cue text sits on navy until the paint has reached it.
      stageEl.dataset.tone = spread * PAINT_REACH > box.top - home.top + borderY ? "light" : "dark";
      // Paint grows as a distance from the frame's inner rectangle, and its torn streaks run out to the full spread.
      const inner = { left: box.left - home.left + borderX, top: box.top - home.top + borderY };
      const markGap = Math.hypot(Math.max(inner.left - NAV_MARK.x, 0), Math.max(inner.top - NAV_MARK.y, 0));
      setNavTone(spread > markGap ? "light" : "dark");
    };
    const seen = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    seen.observe(stageEl);

    return () => {
      cancelAnimationFrame(raf);
      seen.disconnect();
      resized.disconnect();
      paint?.dispose();
    };
  }, [p]);

  return (
    <section ref={section} aria-label={about.headline} className="relative h-[260svh] bg-ink">
      <div ref={stage} data-tone="dark" className="group sticky top-0 grid h-svh place-items-center [overflow:clip]">
        <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
        <motion.div ref={frame} className={`${FRAME_SIZE} z-[1]`} style={{ scale }}>
          <OrnateFrame className="absolute inset-0 h-full w-full" />
          <p className={FRAME_TEXT}>
            <span>
              {words.map((word, i) => (
                <FadingWord key={i} word={word} index={i} total={words.length} progress={p} />
              ))}
            </span>
          </p>
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-paper transition-colors duration-300 group-data-[tone=light]:text-ink"
          style={{ opacity: cueOpacity, y: cueY }}
        >
          <span className="flex items-baseline gap-1 whitespace-nowrap text-sm leading-none">
            Keep scrolling <span className="cue-nudge inline-block text-honey-deep group-data-[tone=dark]:text-honey">↓</span>
          </span>
          <span className="block h-px w-[clamp(4.5rem,7vw,7.5rem)] bg-current/20">
            <motion.span className="block h-full origin-left bg-honey" style={{ scaleX: track }} />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/** Scene between hero and About: a framed line, then torn paper spreading until the frame fills the screen. */
export function PortalFrame() {
  const reduce = useReducedMotion();
  if (!reduce) return <ScrollPortal />;
  return (
    <section className="grid place-items-center bg-ink px-5 py-24">
      <div className={FRAME_SIZE}>
        <OrnateFrame className="absolute inset-0 h-full w-full" />
        <p className={FRAME_TEXT}>{about.headline}</p>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { projects } from "@/data/portfolio";
import { FoilPlate } from "./foil";
import { ProjectDetails } from "./ProjectDetails";
import { STAGE_ID, coverSources, tabId } from "./projectMedia";
import { EASE_OUT, EASE_WIPE } from "./primitives";


/** The stage is at most about half the viewport wide beside the index, full width above it on a tablet. */
const SIZES = "(min-width: 1024px) min(48vw, 56rem), min(100vw, 52rem)";
// A swipe has to travel this far, and mostly sideways, before it changes the project.
const SWIPE = 48;

interface Layer {
  key: number;
  index: number;
  /** +1 arrived from further down the list, -1 from further up, 0 the first one shown. */
  dir: number;
}

interface ProjectStageProps {
  active: number;
  dir: number;
  /** Fetch the other covers in the background once the first is in. */
  warm: boolean;
  onStep: (by: number) => void;
}

/** The selected project on a foil plate: its cover wipes in over the last one, its sheet rises in beneath. */
export function ProjectStage({ active, dir, warm, onStep }: ProjectStageProps) {
  const reduce = useReducedMotion();
  const [layers, setLayers] = useState<Layer[]>([{ key: 0, index: active, dir: 0 }]);
  const [firstIn, setFirstIn] = useState(false);
  const seq = useRef(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const shown = layers[layers.length - 1].index;
  const hasLinks = Boolean(projects[active].demo || projects[active].company);

  // A new cover is decoded off-screen first, so the wipe never uncovers a blank. Only the latest pick lands.
  useEffect(() => {
    if (shown === active) return;
    let live = true;
    const img = new Image();
    img.sizes = SIZES;
    const { src, srcSet } = coverSources(projects[active].cover);
    img.srcset = srcSet;
    img.src = src;
    img
      .decode()
      .catch(() => undefined)
      .then(() => {
        if (live) setLayers((ls) => [...ls.slice(-2), { key: ++seq.current, index: active, dir }]);
      });
    return () => {
      live = false;
    };
  }, [active, dir, shown]);

  // Browsing should never wait on the network: once the first cover is in, the rest are fetched quietly. Not decoded until picked.
  useEffect(() => {
    if (!warm || !firstIn) return;
    const id = window.setTimeout(() => {
      projects.forEach((p, i) => {
        if (i === active) return;
        const img = new Image();
        img.fetchPriority = "low";
        img.sizes = SIZES;
        const { src, srcSet } = coverSources(p.cover);
        img.srcset = srcSet;
        img.src = src;
      });
    }, 400);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warm, firstIn]);

  const settle = (key: number) => setLayers((ls) => (ls.length > 1 && ls[ls.length - 1].key === key ? [ls[ls.length - 1]] : ls));

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "touch") swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const from = swipe.current;
    swipe.current = null;
    if (!from) return;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy) * 1.5) onStep(dx < 0 ? 1 : -1);
  };

  return (
    <div role="tabpanel" id={STAGE_ID} aria-labelledby={tabId(active)} tabIndex={hasLinks ? undefined : 0} className="rounded-sm">
      <FoilPlate className="foil-shadow">
        <div
          className="plate-window relative aspect-[16/10] overflow-hidden bg-ink [touch-action:pan-y]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current = null)}
        >
          {layers.map((layer, n) => {
            const top = n === layers.length - 1;
            const p = projects[layer.index];
            const wipeFrom = layer.dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)";
            return (
              <motion.img
                key={layer.key}
                {...coverSources(p.cover)}
                sizes={SIZES}
                alt={top ? p.coverAlt : ""}
                aria-hidden={top ? undefined : true}
                width={1600}
                height={1000}
                loading={layer.dir === 0 ? "lazy" : undefined}
                decoding="async"
                draggable={false}
                onLoad={() => setFirstIn(true)}
                className="absolute inset-0 h-full w-full select-none object-cover"
                initial={layer.dir === 0 ? false : reduce ? { opacity: 0 } : { clipPath: wipeFrom, scale: 1.035 }}
                animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                transition={
                  reduce
                    ? { duration: 0.15, ease: "easeOut" }
                    : { clipPath: { duration: 0.46, ease: EASE_WIPE }, scale: { duration: 0.8, ease: EASE_OUT } }
                }
                onAnimationComplete={() => top && settle(layer.key)}
              />
            );
          })}
        </div>

        {/* Every sheet sits in the same cell, so the plate is always as tall as the longest one and never jumps. */}
        <div className="mt-[calc(var(--u)*1.1rem)] grid">
          {projects.map((p, i) => (
            <div key={p.title} data-on={i === active} className="detail-sheet [grid-area:1/1]">
              <ProjectDetails project={p} variant="stage" />
            </div>
          ))}
        </div>
      </FoilPlate>
    </div>
  );
}

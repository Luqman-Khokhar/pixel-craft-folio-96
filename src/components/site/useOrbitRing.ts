import { useEffect, useMemo, useRef, type RefObject } from "react";
import { buildRing, depthAt, opacityAt, scaleAt, type Ring } from "@/lib/orbitGeometry";

const TURNS_PER_SECOND = 1 / 80;
const NAV_CLEARANCE = 68;
// The next sheet overlaps the section by 4rem, so the ring stops short of it.
const BOTTOM_CLEARANCE = 80;
const DRAG_THRESHOLD = 6;
const BURST_AT = 0.85;
const BURST_LENGTH = 1.5;
const COPY_AT = 1.55;
const CRUISE_AT = 1.7;
const IMAGE_WAIT = 1200;

type Reason = "hover" | "focus" | "paused" | "open";

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const expoInOut = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
};
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
/** Stable per-card noise: the opening pile looks hand-dropped but never changes between visits. */
const noise = (a: number, b: number) => {
  const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * Drives the ring outside React: cards are written straight to the DOM each frame, and the loop
 * sleeps whenever the section is off screen or the tab is hidden.
 */
export function useOrbitRing(stage: RefObject<HTMLElement>, onEntered: () => void) {
  const holds = useRef(new Set<Reason>());
  const bring = useRef<(index: number) => void>(() => undefined);
  const entered = useRef(onEntered);
  entered.current = onEntered;

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-orbit-card]"));
    const track = el.querySelector<HTMLElement>("[data-orbit-track]");
    const line = el.querySelector<SVGEllipseElement>("[data-orbit-line]");
    const count = cards.length;
    if (!count || !track) return;

    let ring: Ring = buildRing(el.clientWidth, el.clientHeight, NAV_CLEARANCE, BOTTOM_CLEARANCE, count);
    let offset = ring.frontT;
    let speed = 0;
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    let lastMove = 0;
    let moved = 0;
    let rotateSign = 1;
    let scrollY = window.scrollY;
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    let glide: { from: number; delta: number; t: number } | null = null;

    // Opening: one card rises alone, then the rest burst out from under it into the ring.
    let clock = -1;
    const pile = cards.map((_, i) => ({
      x: (noise(i, 1) - 0.5) * 34,
      y: (noise(i, 2) - 0.5) * 22,
      rot: (noise(i, 3) - 0.5) * 16,
      delay: BURST_AT + (i === 0 ? 0.2 : noise(i, 4) * 0.22),
    }));

    const layout = () => {
      ring = buildRing(el.clientWidth, el.clientHeight, NAV_CLEARANCE, BOTTOM_CLEARANCE, count);
      el.style.setProperty("--card-w", `${ring.cardW}px`);
      el.style.setProperty("--card-h", `${ring.cardH}px`);
      el.style.setProperty("--center-y", `${ring.centerY}px`);
      line?.setAttribute("cx", String(el.clientWidth / 2));
      line?.setAttribute("cy", String(el.clientHeight / 2 + ring.centerY));
      line?.setAttribute("rx", String(ring.a));
      line?.setAttribute("ry", String(ring.b));
    };

    const paint = () => {
      const opening = clock < pile[count - 1].delay + BURST_LENGTH + 0.3;
      for (let i = 0; i < count; i++) {
        const angle = ring.angleAt(offset + i / count);
        let x = ring.a * Math.cos(angle);
        let y = ring.b * Math.sin(angle);
        let scale = scaleAt(angle);
        let opacity = opacityAt(angle);
        let rot = 0;
        let z = Math.round(20 * depthAt(angle));
        if (opening) {
          const first = i === 0;
          const p = expoInOut((clock - pile[i].delay) / BURST_LENGTH);
          const rise = first ? 1 - expoOut(clock / 1.1) : 0;
          const shown = first ? clock >= 0 : clock >= BURST_AT;
          x = lerp(pile[i].x, x, p);
          y = lerp(pile[i].y + rise * el.clientHeight * 0.75, y, p);
          scale = lerp(first ? 1 : 0.94, scale, p);
          rot = lerp(pile[i].rot + (first ? rise * 8 : 0), 0, p);
          opacity = shown ? lerp(1, opacity, p) : 0;
          if (first && p < 1) z = 40;
        }
        const card = cards[i];
        card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = String(z);
      }
    };

    let raf = 0;
    let running = false;
    let visible = false;
    let last = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (clock >= 0) {
        const was = clock;
        clock += dt;
        if (was < COPY_AT && clock >= COPY_AT) entered.current();
      }
      const cruising = clock >= CRUISE_AT && holds.current.size === 0 && !dragging;
      speed += ((cruising ? 1 : 0) - speed) * (1 - Math.exp(-dt * 3));
      if (!dragging) velocity *= Math.pow(0.08, dt);
      if (glide) {
        glide.t = Math.min(glide.t + dt / 0.9, 1);
        offset = glide.from + glide.delta * easeInOut(glide.t);
        velocity = 0;
        if (glide.t >= 1) glide = null;
      } else if (!dragging) {
        offset += (speed * TURNS_PER_SECOND + velocity) * dt;
      }
      tilt.x += (tilt.tx - tilt.x) * (1 - Math.exp(-dt * 3));
      tilt.y += (tilt.ty - tilt.y) * (1 - Math.exp(-dt * 3));
      track.style.transform = `translate3d(${tilt.x.toFixed(2)}px, ${tilt.y.toFixed(2)}px, 0)`;
      paint();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as Element).closest("[data-orbit-ignore]")) return;
      const box = el.getBoundingClientRect();
      // Bottom of the ring travels opposite the top: flip so a card always follows the finger.
      rotateSign = e.clientY - box.top > el.clientHeight / 2 + ring.centerY ? -1 : 1;
      dragging = true;
      glide = null;
      velocity = 0;
      moved = 0;
      lastX = e.clientX;
      lastMove = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        const box = el.getBoundingClientRect();
        tilt.tx = ((e.clientX - box.left) / box.width - 0.5) * 24;
        tilt.ty = ((e.clientY - box.top) / box.height - 0.5) * 14;
      }
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const turn = (rotateSign * dx) / ring.perimeter;
      offset += turn;
      velocity = Math.max(Math.min(turn / Math.max((now - lastMove) / 1000, 0.008), 0.6), -0.6);
      moved += Math.abs(dx);
      lastX = e.clientX;
      lastMove = now;
    };
    const onUp = () => {
      if (dragging && performance.now() - lastMove > 90) velocity = 0;
      dragging = false;
    };
    const onClick = (e: MouseEvent) => {
      if (moved > DRAG_THRESHOLD) {
        e.preventDefault();
        e.stopPropagation();
      }
      moved = 0;
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (running && holds.current.size === 0) velocity += (y - scrollY) * 0.00002;
      scrollY = y;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    bring.current = (index) => {
      const delta = ((((ring.frontT - index / count - offset + 0.5) % 1) + 1) % 1) - 0.5;
      glide = { from: offset, delta, t: 0 };
    };

    const beginOpening = () => {
      if (clock >= 0) return;
      const covers = cards.map((card) => {
        const img = card.querySelector("img");
        if (!img || img.complete) return Promise.resolve();
        return new Promise<void>((done) => {
          img.addEventListener("load", () => done(), { once: true });
          img.addEventListener("error", () => done(), { once: true });
        });
      });
      const cap = new Promise<void>((done) => window.setTimeout(done, IMAGE_WAIT));
      Promise.race([Promise.all(covers), cap]).then(() => {
        if (clock < 0) clock = 0;
      });
    };

    layout();
    paint();

    const seen = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
        if (entry.intersectionRatio >= 0.35) beginOpening();
      },
      { threshold: [0, 0.35] }
    );
    seen.observe(el);

    const resized = new ResizeObserver(() => {
      layout();
      paint();
    });
    resized.observe(el);

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("click", onClick, true);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      seen.disconnect();
      resized.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("click", onClick, true);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [stage]);

  return useMemo(
    () => ({
      /** Hold or release the slow drift. Any active reason keeps it stopped. */
      hold: (reason: Reason, on: boolean) => {
        if (on) holds.current.add(reason);
        else holds.current.delete(reason);
      },
      /** Rotate a card round to the front, so keyboard focus never lands off screen. */
      bringToFront: (index: number) => bring.current(index),
    }),
    []
  );
}

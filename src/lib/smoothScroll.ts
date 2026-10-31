// Small wheel smoother on top of native scroll: sticky, anchors, keyboard and touch stay native.
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let current = 0;
let target = 0;
let wheelRaf = 0;
let wheelActive = false;
let jumpRaf = 0;

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

function isInsideScrollable(node: EventTarget | null): boolean {
  let el = node instanceof Element ? node : null;
  while (el && el !== document.body) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) return true;
    el = el.parentElement;
  }
  return false;
}

export function initSmoothWheel(): () => void {
  if (reducedMotion() || !window.matchMedia("(pointer: fine)").matches) return () => undefined;
  current = target = window.scrollY;
  let last = performance.now();

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    current += (target - current) * (1 - Math.exp(-dt * 11));
    if (Math.abs(target - current) < 0.4) {
      current = target;
      wheelActive = false;
    }
    window.scrollTo(0, current);
    if (wheelActive) wheelRaf = requestAnimationFrame(tick);
  };

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey || document.body.hasAttribute("data-scroll-locked") || isInsideScrollable(e.target)) return;
    e.preventDefault();
    cancelAnimationFrame(jumpRaf);
    const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? window.innerHeight : 1;
    if (!wheelActive) current = target = window.scrollY;
    target = clamp(target + e.deltaY * unit, 0, maxScroll());
    if (!wheelActive) {
      wheelActive = true;
      last = performance.now();
      wheelRaf = requestAnimationFrame(tick);
    }
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  return () => {
    window.removeEventListener("wheel", onWheel);
    cancelAnimationFrame(wheelRaf);
    wheelActive = false;
  };
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function scrollToY(y: number) {
  cancelAnimationFrame(wheelRaf);
  cancelAnimationFrame(jumpRaf);
  wheelActive = false;
  const to = clamp(y, 0, maxScroll());
  if (reducedMotion()) {
    window.scrollTo(0, to);
    return;
  }
  const from = window.scrollY;
  const duration = clamp(600 + Math.abs(to - from) * 0.12, 700, 1900);
  const start = performance.now();
  const step = (now: number) => {
    const k = Math.min((now - start) / duration, 1);
    window.scrollTo(0, from + (to - from) * easeInOut(k));
    if (k < 1) jumpRaf = requestAnimationFrame(step);
  };
  jumpRaf = requestAnimationFrame(step);
}

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY);
}

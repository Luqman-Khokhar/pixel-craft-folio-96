// Geometry for the project ring: an ellipse sized to the stage, with cards spaced by the room they take up.
const SAMPLES = 720;
const COVER_ASPECT = 1000 / 1600;
const GUTTER = 16;
const PACKING = 1.14;

export const depthAt = (angle: number) => (Math.sin(angle) + 1) / 2;
export const scaleAt = (angle: number) => 0.74 + 0.26 * depthAt(angle);
export const opacityAt = (angle: number) => 0.45 + 0.55 * depthAt(angle);

export type Ring = {
  a: number;
  b: number;
  cardW: number;
  cardH: number;
  centerY: number;
  perimeter: number;
  /** Ring position (0–1) of the front of the ellipse, nearest the viewer. */
  frontT: number;
  angleAt: (t: number) => number;
};

/** Running total of card footprints around the ellipse, so spacing stays even at any point. */
function trace(a: number, b: number) {
  const table = new Float64Array(SAMPLES + 1);
  let perimeter = 0;
  let px = a;
  let py = 0;
  for (let i = 1; i <= SAMPLES; i++) {
    const angle = (i / SAMPLES) * Math.PI * 2;
    const x = a * Math.cos(angle);
    const y = b * Math.sin(angle);
    const step = Math.hypot(x - px, y - py) || 1e-6;
    const along = Math.max(Math.abs(x - px) / step, 1e-6);
    const across = Math.max(Math.abs(y - py) / step, 1e-6);
    const footprint = Math.min(1 / along, COVER_ASPECT / across);
    table[i] = table[i - 1] + step / (footprint * scaleAt(angle));
    perimeter += step;
    px = x;
    py = y;
  }
  return { table, perimeter };
}

export function buildRing(width: number, height: number, top: number, bottom: number, count: number): Ring {
  const areaH = Math.max(height - top - bottom, 120);
  // Tall screens: the ring runs past the side edges, leaving the centre clear for the copy.
  const portrait = width < 768 && height > width;
  const wanted = portrait ? Math.min(width * 0.62, 280) : Math.max(Math.min(width * 0.25, areaH * 0.4, 400), 120);

  let cardW = wanted;
  let a = 0;
  let b = 0;
  let traced = trace(1, 1);
  for (let pass = 0; pass < 4; pass++) {
    a = portrait ? Math.max(areaH / 2 - cardW * 0.2, width * 0.95) : width / 2 - GUTTER - cardW / 2;
    b = areaH / 2 - (cardW * COVER_ASPECT) / 2;
    traced = trace(a, b);
    cardW = Math.min(wanted, traced.table[SAMPLES] / (PACKING * count));
  }

  const { table, perimeter } = traced;
  const total = table[SAMPLES];
  return {
    a,
    b,
    cardW,
    cardH: cardW * COVER_ASPECT,
    centerY: (top - bottom) / 2,
    perimeter,
    frontT: table[SAMPLES / 4] / total,
    angleAt: (t) => {
      const target = ((t % 1) + 1) % 1 * total;
      let lo = 1;
      let hi = SAMPLES;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (table[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      const span = table[lo] - table[lo - 1];
      const part = span > 0 ? (target - table[lo - 1]) / span : 0;
      return ((lo - 1 + part) / SAMPLES) * Math.PI * 2;
    },
  };
}

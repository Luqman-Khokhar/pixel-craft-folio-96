import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

// Canvas and three.js colors are literal. Navy mirrors --ink; the rest come from the golden portrait.
const NAVY = "#08335e";
const NAVY_DEEP = "#05243f";
const HONEY = "#f7b538";
const OCHRE = "#c98f2e";
const PALE_GOLD = "#f7cd79";
const CREAM = "#fdf0ca";
const WHITE = "#fdffff";
const BROWN = "#6b3a14";
const OUTLINE = "#5a2d0c";
const COOL_LINE = "#c7d0da";

// Official logo outlines. TS letters are holes in its square, so they are lifted out below.
const TS_LOGO = "M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49.19 49.19 0 01.12-5.17C29.08 59 39 59 51 59h21.83z";
const NEXT_N = "M7.2 7.2H9.219L18.3 18.9L17.05 20.15L8.815 9.251V16.796H7.2Z M15.333 7.2H16.933V15.506L15.333 13.445Z";
const NODE_MARK = "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z";
const APPLE = "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701";
export const NODE_HEX = "M12 0.3L22.4 6.15V17.85L12 23.7L1.6 17.85V6.15Z";

export const shapesOf = (d: string) =>
  SVGLoader.createShapes(new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`).paths[0]);

const tsLetters = () => {
  const path = new Path2D();
  shapesOf(TS_LOGO)[0].holes.forEach((hole) => {
    hole.getPoints(16).forEach((point, i) => (i ? path.lineTo(point.x, point.y) : path.moveTo(point.x, point.y)));
    path.closePath();
  });
  return path;
};

type Outline = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
type Paint = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

const rounded = (radius: number): Outline => (ctx, w, h) => ctx.roundRect(0, 0, w, h, radius);
const circle: Outline = (ctx, w, h) => ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
const hexagon: Outline = (ctx, w) => {
  const unit = w / 24;
  [[12, 0.3], [22.4, 6.15], [22.4, 17.85], [12, 23.7], [1.6, 17.85], [1.6, 6.15]].forEach(([x, y], i) =>
    i ? ctx.lineTo(x * unit, y * unit) : ctx.moveTo(x * unit, y * unit)
  );
  ctx.closePath();
};

/** Traces the shape shrunk toward its centre by `inset` pixels, ready to stroke or clip at normal line width. */
function traceInset(ctx: CanvasRenderingContext2D, outline: Outline, w: number, h: number, inset: number) {
  const k = (w - inset * 2) / w;
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(k, (h - inset * 2) / h);
  ctx.translate(-w / 2, -h / 2);
  ctx.beginPath();
  outline(ctx, w, h);
  ctx.restore();
}

function line(ctx: CanvasRenderingContext2D, outline: Outline, w: number, h: number, inset: number, color: string, width: number) {
  traceInset(ctx, outline, w, h, inset);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

/** A logo printed on the face, centred on `center` and `size` wide as a share of the face. */
function print(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mark: { path: Path2D; box: number; center: [number, number]; size: number },
  fill: string,
  edge?: string
) {
  const scale = (w * mark.size) / mark.box;
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(scale, scale);
  ctx.translate(-mark.center[0], -mark.center[1]);
  if (edge) {
    ctx.lineJoin = "round";
    ctx.strokeStyle = edge;
    ctx.lineWidth = mark.box * 0.03;
    ctx.stroke(mark.path);
  }
  ctx.fillStyle = fill;
  ctx.fill(mark.path);
  ctx.restore();
}

/** One side as a material. Everything outside the shape stays transparent, so the gold body shows as a rim. */
function face(pixels: number, aspect: number, outline: Outline, paint: Paint) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(pixels * aspect);
  canvas.height = pixels;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.beginPath();
    outline(ctx, canvas.width, canvas.height);
    ctx.clip();
    paint(ctx, canvas.width, canvas.height);
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  return new THREE.MeshBasicMaterial({ map, transparent: true, alphaTest: 0.5, toneMapped: false });
}

/** The shared dark side: navy, gold lines, a lattice, and a deep glow behind the mark. */
function darkSide(ctx: CanvasRenderingContext2D, outline: Outline, w: number, h: number, inner: number) {
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  traceInset(ctx, outline, w, h, inner);
  ctx.clip();
  ctx.strokeStyle = "rgba(247, 181, 56, 0.42)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = -h; x < w + h; x += 36) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h, h);
    ctx.moveTo(x, h);
    ctx.lineTo(x + h, 0);
  }
  ctx.stroke();
  const glow = ctx.createRadialGradient(w / 2, h / 2, w * 0.08, w / 2, h / 2, w * 0.42);
  glow.addColorStop(0, NAVY_DEEP);
  glow.addColorStop(0.62, NAVY_DEEP);
  glow.addColorStop(1, "rgba(5, 36, 63, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** Corner index on the white card: small navy apple and honey diamond. */
const cornerMark = (ctx: CanvasRenderingContext2D, apple: Path2D) => {
  ctx.save();
  ctx.translate(66, 62);
  ctx.scale(3, 3);
  ctx.fillStyle = NAVY;
  ctx.fill(apple);
  ctx.restore();
  ctx.save();
  ctx.translate(102, 176);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = HONEY;
  ctx.fillRect(-11, -11, 22, 22);
  ctx.restore();
};

export const CARD_FACE: [number, number] = [0.7, 0.96];
const cardOutline = rounded(34);
const appleMark = () => ({ path: new Path2D(APPLE), box: 24, center: [12, 12] as [number, number], size: 0.36 });

export const APPLE_DARK = face(1200, CARD_FACE[0] / CARD_FACE[1], cardOutline, (ctx, w, h) => {
  darkSide(ctx, cardOutline, w, h, 62);
  line(ctx, cardOutline, w, h, 22, HONEY, 12);
  line(ctx, cardOutline, w, h, 46, HONEY, 3.5);
  line(ctx, cardOutline, w, h, 62, OCHRE, 2.5);
  print(ctx, w, h, appleMark(), HONEY, OCHRE);
});

export const APPLE_LIGHT = face(1200, CARD_FACE[0] / CARD_FACE[1], cardOutline, (ctx, w, h) => {
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, w, h);
  line(ctx, cardOutline, w, h, 24, PALE_GOLD, 9);
  line(ctx, cardOutline, w, h, 44, COOL_LINE, 3.5);
  print(ctx, w, h, appleMark(), HONEY, OUTLINE);
  const apple = new Path2D(APPLE);
  cornerMark(ctx, apple);
  ctx.translate(w, h);
  ctx.rotate(Math.PI);
  cornerMark(ctx, apple);
});

const tileOutline = rounded(26);
const tsMark = () => ({ path: tsLetters(), box: 128, center: [64, 64] as [number, number], size: 0.82 });

export const TS_LIGHT = face(640, 1, tileOutline, (ctx, w, h) => {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  line(ctx, tileOutline, w, h, 16, PALE_GOLD, 7);
  line(ctx, tileOutline, w, h, 30, COOL_LINE, 2.5);
  print(ctx, w, h, tsMark(), NAVY);
});

export const TS_DARK = face(640, 1, tileOutline, (ctx, w, h) => {
  darkSide(ctx, tileOutline, w, h, 40);
  line(ctx, tileOutline, w, h, 14, HONEY, 9);
  line(ctx, tileOutline, w, h, 30, HONEY, 2.5);
  line(ctx, tileOutline, w, h, 40, OCHRE, 2);
  print(ctx, w, h, tsMark(), HONEY);
});

const nodeMark = () => ({ path: new Path2D(NODE_MARK), box: 24, center: [12, 12] as [number, number], size: 0.72 });

export const NODE_LIGHT = face(900, 1, hexagon, (ctx, w, h) => {
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, w, h);
  line(ctx, hexagon, w, h, 20, PALE_GOLD, 8);
  print(ctx, w, h, nodeMark(), BROWN);
});

export const NODE_DARK = face(900, 1, hexagon, (ctx, w, h) => {
  darkSide(ctx, hexagon, w, h, 46);
  line(ctx, hexagon, w, h, 18, HONEY, 10);
  line(ctx, hexagon, w, h, 36, HONEY, 3);
  print(ctx, w, h, nodeMark(), HONEY);
});

const nextMark = () => ({ path: new Path2D(NEXT_N), box: 24, center: [12, 12] as [number, number], size: 0.86 });

export const NEXT_LIGHT = face(640, 1, circle, (ctx, w, h) => {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  line(ctx, circle, w, h, 26, HONEY, 9);
  print(ctx, w, h, nextMark(), BROWN);
});

export const NEXT_DARK = face(640, 1, circle, (ctx, w, h) => {
  darkSide(ctx, circle, w, h, 40);
  line(ctx, circle, w, h, 16, HONEY, 9);
  line(ctx, circle, w, h, 34, HONEY, 2.5);
  print(ctx, w, h, nextMark(), HONEY);
});

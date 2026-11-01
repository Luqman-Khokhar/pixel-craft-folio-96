// Artwork is centred on 0,0. One eighth of the wreath is drawn, then mirrored and rotated into all eight.
const WREATH = [
  "M6,-80 A80 80 0 0 1 56.6,-56.6",
  "M7,-84 C14,-98 40,-98 54,-69 C42,-81 25,-86 7,-84 Z",
  "M14,-86 C24,-91 37,-87 47,-75",
  "M9,-77 C20,-81 33,-75 40,-63 C30,-70 19,-74 9,-77 Z",
  "M53,-66 C62,-77 74,-68 70,-58 C67,-51 58,-53 59,-60 C60,-64 65,-63 65,-60",
];
const FLEUR = [
  "M0,-110 C6,-103 8,-96 3,-90 L0,-90",
  "M3,-98 C9,-105 19,-102 18,-94 C17,-88 10,-88 11,-93",
  "M3,-90 C7,-92 11,-90 13,-86",
  "M0,-87 H10 M0,-84 H10",
  "M0,-84 C4,-80 4,-75 0,-71",
  "M4,-84 C8,-81 14,-80 20,-84",
];

const SUITS = [
  { x: -86, y: -66, d: ["M0,-10 C4,-5 9,-2 9,2 C9,6 4,7 1.5,4 C2,7 3,9 5,10 H-5 C-3,9 -2,7 -1.5,4 C-4,7 -9,6 -9,2 C-9,-2 -4,-5 0,-10 Z"] },
  { x: 86, y: -66, d: ["M-2.8,-0.9 A5 5 0 1 1 2.8,-0.9 A5 5 0 1 1 1.4,5.3 C1.6,7 2.6,9 4.5,10 H-4.5 C-2.6,9 -1.6,7 -1.4,5.3 A5 5 0 1 1 -2.8,-0.9 Z"] },
  { x: -86, y: 66, d: ["M0,-11 C3,-6 5,-3 8,0 C5,3 3,6 0,11 C-3,6 -5,3 -8,0 C-5,-3 -3,-6 0,-11 Z", "M0,-5 L3.5,0 L0,5 L-3.5,0 Z"] },
  { x: 86, y: 66, d: ["M0,10 C-5,5 -10,1 -10,-4 C-10,-8 -6,-10 -3.5,-9 C-2,-8.4 -0.8,-7 0,-5.5 C0.8,-7 2,-8.4 3.5,-9 C6,-10 10,-8 10,-4 C10,1 5,5 0,10 Z"] },
];

// Tall engraved serifs with a ruled line down each heavy stroke.
const LETTERS = [
  "M-49,-52 H-17 V-49 C-22,-49 -25,-48 -25,-44 V44 C-25,47 -23,48 -20,48 H-13 C-9,48 -6,42 -5,33 H-3 L-4,52 H-49 V49 C-44,49 -41,48 -41,44 V-44 C-41,-48 -44,-49 -49,-49 Z",
  "M-33,-44 V44",
  "M1,-52 H33 V-49 C28,-49 25,-48 25,-44 V-5 L43,-43 C44,-47 42,-49 38,-49 V-52 H59 V-49 C54,-49 51,-47 49,-43 L37,-16 L55,44 C56,47 58,49 61,49 V52 H36 V49 C39,49 40,47 39,44 L27,-1 L25,3 V44 C25,48 27,49 30,49 V52 H1 V49 C6,49 9,48 9,44 V-44 C9,-48 6,-49 1,-49 Z",
  "M17,-44 V44",
  "M36,-6 L47,39",
];

const TURNS = [0, 90, 180, 270];
const eightfold = (place: (turn: number) => string) =>
  TURNS.flatMap((turn) => [place(turn), `${place(turn)} scale(-1 1)`]);
const WREATH_COPIES = eightfold((turn) => `rotate(${turn})`);
// North and south fleurs sit further out, which gives the seal its upright oval.
const FLEUR_COPIES = eightfold((turn) => `rotate(${turn}) translate(0 ${turn % 180 ? -6 : -12})`);

const Stroke = ({ d, delay, width = 1.5, still = false }: { d: string; delay: number; width?: number; still?: boolean }) =>
  still ? (
    // At logo size the artwork scales far below a pixel, so line weight is fixed in screen pixels instead.
    <path d={d} strokeWidth={width / 2} vectorEffect="non-scaling-stroke" />
  ) : (
    <path d={d} pathLength={1} strokeWidth={width} className="seal-stroke" style={{ animationDelay: `${delay}ms` }} />
  );

/** Ornate "LK" monogram that inks itself in: wreath first, then the card suits and the letters. `still` skips the inking. */
export function LoaderSeal({ className = "", still = false }: { className?: string; still?: boolean }) {
  return (
    <svg viewBox="-122 -134 244 268" className={className} fill="none" stroke="currentColor" strokeLinejoin="round" aria-hidden="true">
      {WREATH_COPIES.map((transform, copy) => (
        <g key={transform} transform={transform}>
          {WREATH.map((d, i) => (
            <Stroke key={d} d={d} delay={i * 70 + copy * 25} width={i === 0 ? 1.1 : 1.5} still={still} />
          ))}
        </g>
      ))}
      {FLEUR_COPIES.map((transform, copy) => (
        <g key={transform} transform={transform}>
          {FLEUR.map((d, i) => (
            <Stroke key={d} d={d} delay={250 + i * 70 + copy * 25} still={still} />
          ))}
        </g>
      ))}
      {SUITS.map(({ x, y, d }, suit) => (
        <g key={`${x},${y}`} transform={`translate(${x} ${y})`}>
          {d.map((path) => (
            <Stroke key={path} d={path} delay={850 + suit * 90} still={still} />
          ))}
        </g>
      ))}
      <g transform="translate(-5 0)" fill={still ? "currentColor" : undefined}>
        {LETTERS.map((d, i) => (
          <Stroke key={d} d={d} delay={750 + i * 120} width={1.3} still={still} />
        ))}
      </g>
    </svg>
  );
}

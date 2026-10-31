/** Paper card with notched, double-ruled honey corners. Scales cleanly: it's all vector. */
const notched = (i: number, w: number, h: number, r: number) =>
  `M${i + r} ${i} H${w - i - r} A${r} ${r} 0 0 0 ${w - i} ${i + r} V${h - i - r} A${r} ${r} 0 0 0 ${w - i - r} ${h - i} H${i + r} A${r} ${r} 0 0 0 ${i} ${h - i - r} V${i + r} A${r} ${r} 0 0 0 ${i + r} ${i} Z`;

export function OrnateFrame({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 500" className={className} aria-hidden="true">
      <path d={notched(0, 400, 500, 26)} className="fill-honey" />
      <path d={notched(7, 400, 500, 24)} className="fill-honey-deep" />
      <path d={notched(10, 400, 500, 23)} className="fill-honey" />
      <path d={notched(15, 400, 500, 21)} className="fill-paper" />
      <path d={notched(24, 400, 500, 18)} fill="none" strokeWidth="0.75" className="stroke-honey-deep" />
    </svg>
  );
}

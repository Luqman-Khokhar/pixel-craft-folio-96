import { useEffect, useState } from "react";

const SIZE = 100;
const FONT = `700 ${SIZE}px Melodrama`;

function inkBox(text: string): string | null {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  ctx.font = FONT;
  const m = ctx.measureText(text);
  return `${-m.actualBoundingBoxLeft} ${-m.actualBoundingBoxAscent} ${m.actualBoundingBoxLeft + m.actualBoundingBoxRight} ${m.actualBoundingBoxAscent + m.actualBoundingBoxDescent}`;
}

/** Hollow display word stretched to fill its box edge to edge. The hairline stays even however far it stretches. */
export function OutlineWord({ text, className = "" }: { text: string; className?: string }) {
  const [box, setBox] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    document.fonts.load(FONT, text).then(() => {
      if (live) setBox(inkBox(text));
    });
    return () => {
      live = false;
    };
  }, [text]);

  return (
    <svg aria-hidden="true" viewBox={box ?? "0 0 100 100"} preserveAspectRatio="none" className={`overflow-visible ${className}`}>
      {box && (
        <text x="0" y="0" fontFamily="Melodrama" fontWeight="700" fontSize={SIZE} className="fill-none stroke-ink" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
          {text}
        </text>
      )}
    </svg>
  );
}

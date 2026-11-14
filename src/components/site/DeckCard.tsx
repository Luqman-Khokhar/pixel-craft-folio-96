import { platformLabel, type TableCard } from "@/data/portfolio";
import { PLATFORM_ICONS } from "./platformIcons";
import { chamferPath } from "./foilGeometry";

const W = 275;
const H = 350;

/** A rectangle with cut corners, drawn `inset` in from the card edge. */
const chamfered = (inset: number, cut: number) => chamferPath(W, H, inset, cut);

const OUTER = chamfered(0, 10);
const FOIL = chamfered(7, 7);
const FOIL_INNER = chamfered(10.5, 5.5);

/** The card's stock and the foil frame printed inside it. */
function Stock({ fill, foil, double = false }: { fill: string; foil: string; double?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
      <path d={OUTER} className={fill} />
      <path d={FOIL} vectorEffect="non-scaling-stroke" strokeWidth="1.25" className={`fill-none transition-[stroke] duration-200 ${foil}`} />
      {double && <path d={FOIL_INNER} vectorEffect="non-scaling-stroke" strokeWidth="0.75" className={`fill-none ${foil}`} />}
    </svg>
  );
}

/** The printed face of a card. Fills its parent, which sets the size. A project shows its cover and platform; a stat card shows its figure. */
export function CardFace({ card, focused = false }: { card: TableCard; focused?: boolean }) {
  const { cover, platform } = card.sheet;

  if (!cover) {
    return (
      <span className="absolute inset-0 text-paper [container-type:inline-size]">
        <Stock fill="fill-ink" foil={focused ? "stroke-honey" : "stroke-honey/55"} double />
        <span className="relative flex h-full w-full flex-col items-center justify-center px-[10%] text-center">
          <span className="block text-[max(0.6875rem,4.6cqw)] font-medium leading-tight text-paper/80">{card.label}</span>
          <span className="mt-[3cqw] block font-display text-[34cqw] font-bold leading-[0.9] text-honey">{card.title}</span>
          <span className="mt-[4cqw] block font-display text-[max(0.8125rem,8cqw)] font-bold leading-tight">{card.sub}</span>
        </span>
      </span>
    );
  }

  const icons = PLATFORM_ICONS[platform];
  return (
    <span className="absolute inset-0 text-ink [container-type:inline-size]">
      <Stock fill="fill-paper" foil={focused ? "stroke-honey-deep" : "stroke-honey-deep/45"} />
      <span className="card-window absolute left-[7.5cqw] right-[7.5cqw] top-[7.5cqw] h-[66cqw] bg-ink">
        <img src={cover} alt="" width={1600} height={1000} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
      </span>
      {/* Set from the foot of the card up, so a one-line name and a two-line name both sit on the same baseline. */}
      <span className="absolute inset-x-[9cqw] bottom-[10cqw] flex flex-col items-start text-left">
        <span className="flex items-center gap-[1.4cqw] text-[max(0.6875rem,4.3cqw)] font-medium leading-none text-ink/80">
          {icons.map((Icon, i) => (
            <Icon key={i} aria-hidden="true" strokeWidth={1.75} className="h-[max(0.75rem,4.8cqw)] w-[max(0.75rem,4.8cqw)] shrink-0" />
          ))}
          <span className="ml-[0.6cqw]">{platformLabel[platform]}</span>
        </span>
        <span className="mt-[2.6cqw] block font-display text-[11.5cqw] font-bold leading-[1.02] tracking-[-0.01em] [text-wrap:balance]">{card.title}</span>
        <span className="deck-note mt-[2.4cqw] block text-[max(0.6875rem,4.3cqw)] leading-tight text-ink/70">{card.label}</span>
      </span>
    </span>
  );
}

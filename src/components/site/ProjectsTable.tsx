import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { tableCards } from "@/data/portfolio";
import { scrollToY } from "@/lib/smoothScroll";
import { DeckCard, type DeckSlot } from "./DeckCard";
import { OutlineWord } from "./OutlineWord";
import { ProjectCase } from "./ProjectCase";
import { useMediaQuery } from "./primitives";

// One slot per entry of tableCards, same order. The columns are dealt right to left, the centre card last.
const SLOTS: DeckSlot[] = [
  { lx: 50, ly: 46.1, px: 50, py: 48.5, k: 1.32, pk: 1.05, rot: -0.2, order: 8 },
  { lx: 64.8, ly: 22.3, px: 73, py: 34.5, rot: -2.6, order: 2 },
  { lx: 35.2, ly: 22.3, px: 27, py: 34.5, rot: 3.1, order: 4 },
  { lx: 12.1, ly: 78.5, px: 27, py: 64.5, rot: 2.1, order: 7 },
  { lx: 35.2, ly: 78.5, px: 27, py: 83, rot: 3, order: 5 },
  { lx: 64.8, ly: 78.5, px: 73, py: 83, rot: -2.7, order: 3 },
  { lx: 87.9, ly: 78.5, px: 73, py: 64.5, rot: -2, order: 1 },
  { lx: 11.8, ly: 22.3, px: 27, py: 16, rot: -2.8, order: 6 },
  { lx: 88.2, ly: 22.3, px: 73, py: 16, rot: 2.5, order: 0 },
];

// Lowest first. The centre card lands on top of everything.
const STACK = [3, 7, 4, 2, 5, 1, 6, 8, 0];
const CENTRE = 0;

// The last stretch of scroll deals nothing, so the full table can be played with before the page moves on.
const DEAL_ENDS_AT = 0.87;
// Each card overlaps the next a little, so there is always something moving.
const CARD_SPAN = 1.2;
const STEP = DEAL_ENDS_AT / (SLOTS.length - 1 + CARD_SPAN);
const rangeOf = (slot: DeckSlot): [number, number] => [slot.order * STEP, (slot.order + CARD_SPAN) * STEP];

/** Hollow PROJECTS on a white table, pinned while scrolling deals the cards in one by one. Scrolling back takes them out again. Cards can be picked up and moved, one is selected at a time, and a double click opens one. */
export function ProjectsTable() {
  const track = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLDivElement>(null);
  const animated = !useMediaQuery("(prefers-reduced-motion: reduce)");
  const fine = useMediaQuery("(pointer: fine)");
  const portrait = useMediaQuery("(max-aspect-ratio: 1/1)");
  const [stack, setStack] = useState(STACK);
  const [focused, setFocused] = useState<number | null>(CENTRE);
  const [open, setOpen] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 170, damping: 30, restDelta: 0.0005 });

  // Back at the start with an empty table: the next deal begins the same way.
  useMotionValueEvent(progress, "change", (p) => {
    if (p > 0.001) return;
    setStack(STACK);
    setFocused(CENTRE);
  });

  const pick = (i: number) => {
    setFocused(i);
    setStack((s) => (s[s.length - 1] === i ? s : [...s.filter((n) => n !== i), i]));
  };

  // Tabbing to a card that hasn't been dealt yet scrolls to the point where it lands.
  const reveal = (slot: DeckSlot) => {
    const el = track.current;
    if (!el) return;
    scrollToY(el.getBoundingClientRect().top + window.scrollY + (el.offsetHeight - window.innerHeight) * rangeOf(slot)[1]);
  };

  // Each card starts just above the screen, so a lower card covers more ground in its turn.
  const fallFrom = (slot: DeckSlot) => (portrait ? -(slot.py + 15) : -(slot.ly + 30));

  return (
    <section id="projects" className="sheet-edge relative -mt-10 bg-azure text-ink [overflow:clip] md:-mt-16">
      <h2 className="sr-only">Projects</h2>
      <div ref={track} className={`relative ${animated ? "h-[560svh]" : "h-svh"}`}>
        <div
          ref={table}
          className="deck-table sticky top-0 h-svh"
          onPointerDown={(e) => {
            if (!(e.target as Element).closest("button")) setFocused(null);
          }}
        >
          <OutlineWord text="PROJECTS" className="absolute left-[5%] top-[13.7%] h-[57.9%] w-[90%]" />

          <ul aria-label="Projects">
            {tableCards.map((card, i) => (
              <DeckCard
                key={card.title}
                card={card}
                slot={SLOTS[i]}
                progress={progress}
                range={rangeOf(SLOTS[i])}
                fallFrom={fallFrom(SLOTS[i])}
                animated={animated}
                focused={focused === i}
                z={stack.indexOf(i) + 1}
                fine={fine}
                table={table}
                onPick={() => pick(i)}
                onOpen={() => setOpen(i)}
                onReveal={() => reveal(SLOTS[i])}
              />
            ))}
          </ul>

          <p className="deck-caption absolute inset-x-4 bottom-[1.5%] mx-auto text-center text-[0.8125rem] leading-snug text-ink/70 md:bottom-[2.5%]">
            {fine ? "Pick up a card and move it around the table" : "Slide a card around the table"}
            <br />
            {fine ? "Double-click a card to open it" : "Double-tap a card to open it"}
          </p>
        </div>
      </div>
      {/* The next sheet overlaps this strip; the rest keeps its shadow off the table. */}
      <div aria-hidden="true" className="h-[6.5rem] md:h-32" />

      <ProjectCase project={open === null ? null : tableCards[open].sheet} index={open ?? 0} total={tableCards.length} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </section>
  );
}

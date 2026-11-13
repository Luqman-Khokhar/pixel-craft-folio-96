import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { RiseText, useMediaQuery } from "./primitives";
import { SkillCards, useSkillCards } from "./SkillCards";
import { Keycap, type Ripple } from "./Keycap";
import { ROWS, labelFor, same, shippedIn, type At } from "./keyboardRows";

const RIPPLE_STEP_MS = 35;
// Scroll the pinned board absorbs before the projects sheet starts to rise.
const DWELL = "70svh";
// Too narrow or too short for six rows at once: a function row picks which row of keys is on show.
const COMPACT_QUERY = "(max-width: 767px), (max-height: 600px)";

/** The skills as one keyboard: a row per layer of an app, a key per skill. Pressing a key types it on the screen and deals out the projects it shipped in. Always one screen tall. */
export function SkillsKeyboard() {
  const reduce = useReducedMotion();
  const narrowOrShort = useMediaQuery(COMPACT_QUERY);
  const sideBySide = useMediaQuery("(min-width: 640px)");
  // Set when the full board was tried and still ran past the screen.
  const [tooTall, setTooTall] = useState(false);
  const compact = narrowOrShort || tooTall;
  const compactRef = useRef(compact);
  compactRef.current = compact;

  const [pressed, setPressed] = useState<At | null>(null);
  const [hot, setHot] = useState<At | null>(null);
  const [focus, setFocus] = useState<At>({ row: 0, col: 0 });
  const [row, setRow] = useState(0);
  const [ripples, setRipples] = useState<Record<number, Ripple & { col: number }>>({});
  const [said, setSaid] = useState("");
  const keys = useRef(new Map<string, HTMLButtonElement>());
  const { open: fan, propsFor, left, top, cardWidth } = useSkillCards();

  const board = useRef<HTMLDivElement>(null);
  const shown = useInView(board, { once: true, margin: "-15% 0px" });

  // The stage sticks once its bottom meets the screen's, rests for DWELL so a small scroll doesn't carry the visitor past the board,
  // then holds for one more screen while the projects sheet slides over it.
  const stage = useRef<HTMLDivElement>(null);
  const [stageHeight, setStageHeight] = useState(0);
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setStageHeight(el.offsetHeight);
      if (!compactRef.current && el.offsetHeight > window.innerHeight + 2) setTooTall(true);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // A wider window may now fit the full board, so try it again. Height-only changes are a phone's toolbar; ignore them.
  useEffect(() => {
    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      setTooTall(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cover = useRef<HTMLDivElement>(null);
  const { scrollYProgress: covered } = useScroll({ target: cover, offset: ["start end", "start start"] });
  const sink = useTransform(covered, [0, 1], [1, 0.94]);
  const shade = useTransform(covered, [0, 1], [0, 0.6]);

  const press = (at: At) => {
    const proof = ROWS[at.row].proofs[at.col];
    setPressed(at);
    setFocus(at);
    setRow(at.row);
    setRipples((r) => ({ ...r, [at.row]: { id: (r[at.row]?.id ?? 0) + 1, delay: 0, col: at.col } }));
    const shipped = shippedIn(proof);
    setSaid(`${proof.name}. ${ROWS[at.row].category}.${shipped ? ` Shipped in ${shipped}.` : ""}`);
  };

  // In compact mode the target row may be hidden until this render lands, so focus it on the next frame.
  const moveTo = (at: At) => {
    setFocus(at);
    setRow(at.row);
    requestAnimationFrame(() => keys.current.get(`${at.row}-${at.col}`)?.focus());
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const { row: r, col } = focus;
    const flat = ROWS.flatMap((rw, ri) => rw.proofs.map((p, ci) => ({ row: ri, col: ci, name: p.name })));
    const here = flat.findIndex((k) => k.row === r && k.col === col);
    let next: At | null = null;
    if (e.key === "ArrowRight") next = flat[(here + 1) % flat.length];
    else if (e.key === "ArrowLeft") next = flat[(here - 1 + flat.length) % flat.length];
    else if (e.key === "ArrowDown" && r < ROWS.length - 1) next = { row: r + 1, col: Math.min(col, ROWS[r + 1].proofs.length - 1) };
    else if (e.key === "ArrowUp" && r > 0) next = { row: r - 1, col: Math.min(col, ROWS[r - 1].proofs.length - 1) };
    else if (e.key === "Home") next = { row: r, col: 0 };
    else if (e.key === "End") next = { row: r, col: ROWS[r].proofs.length - 1 };
    else if (e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
      // Type-to-jump: the next skill after this one that starts with the letter.
      const letter = e.key.toLowerCase();
      for (let step = 1; step <= flat.length && !next; step++) {
        const k = flat[(here + step) % flat.length];
        if (k.name.toLowerCase().startsWith(letter)) next = k;
      }
    }
    if (!next) return;
    e.preventDefault();
    moveTo({ row: next.row, col: next.col });
  };

  const twoColumn = compact && sideBySide;

  const keysOf = (r: number) => (
    <ul className={`flex flex-1 flex-wrap gap-2 ${compact ? "content-start" : "lg:flex-nowrap"}`}>
      {ROWS[r].proofs.map((p, c) => {
        const at = { row: r, col: c };
        const ripple = ripples[r];
        return (
          <Keycap
            key={p.name}
            proof={p}
            label={labelFor(p)}
            delay={compact ? c * 0.03 : r * 0.07 + c * 0.02}
            compact={compact}
            shown={shown && (!compact || r === row)}
            pressed={same(pressed, at)}
            dimmed={!!hot && !same(hot, at)}
            focusable={same(focus, at)}
            ripple={ripple ? { id: ripple.id, delay: Math.abs(c - ripple.col) * RIPPLE_STEP_MS } : null}
            proofProps={p.cards.length ? propsFor(p) : undefined}
            buttonRef={(el) => {
              if (el) keys.current.set(`${r}-${c}`, el);
              else keys.current.delete(`${r}-${c}`);
            }}
            onPress={() => press(at)}
            onHover={(on) => setHot(on ? at : null)}
            onFocusKey={() => setFocus(at)}
          />
        );
      })}
    </ul>
  );

  return (
    <section id="skills" className="sheet-edge relative -mt-10 bg-graphite text-bone md:-mt-16">
      <div className="relative" style={reduce ? undefined : { height: `calc(${stageHeight}px + ${DWELL} + 100svh)` }}>
        <div ref={cover} aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 ${reduce ? "h-0" : "h-svh"}`} />
        <div ref={stage} className={reduce ? "" : "sticky"} style={reduce ? undefined : { top: `min(0px, calc(100svh - ${stageHeight}px))` }}>
          <motion.div
            style={reduce ? undefined : { scale: sink }}
            className={`mx-auto flex min-h-svh max-w-[100rem] origin-[50%_35%] flex-col justify-center px-4 sm:px-6 ${
              compact ? "pb-4 pt-[4.75rem] [@media(max-height:600px)]:pt-[4.25rem]" :"pb-[clamp(1.5rem,5svh,6rem)] pt-[max(5.5rem,11svh)]"
            }`}
          >
            {/* The board takes every pixel of height the heading leaves; the full board stops growing where keys stop looking like keys. */}
            <div className={twoColumn ? "grid grid-cols-2 items-center gap-x-6" : `flex flex-col ${compact ? "" : "flex-1 justify-center"}`}>
              <header className={compact ? "" : "flex items-end justify-between gap-10"}>
                <h2 className={`font-display font-bold leading-[0.9] tracking-[-0.02em] ${compact ? "text-[clamp(2.25rem,6svh,3rem)]" : "text-[clamp(2.75rem,7svh,6rem)]"}`}>
                  <RiseText text="Skills" />
                </h2>
                <p className={`max-w-[26rem] leading-relaxed text-bone/80 [@media(max-height:640px)]:hidden ${compact ? "mt-1.5 text-[0.9375rem]" : "pb-1 text-[clamp(1rem,1.6svh,1.25rem)]"}`}>
                  Six layers of an app, from the screen you touch to the store it ships from. Press a key.
                </p>
              </header>

              <div
                ref={board}
                onKeyDown={onKeyDown}
                className={`kb-case flex flex-col rounded-[1.75rem] ${
                  compact
                    ? `gap-3 p-3 ${twoColumn ? "" : "mt-4"}`
                    : "mt-[clamp(1rem,3svh,2.5rem)] max-h-[56rem] flex-1 gap-[clamp(0.375rem,1.1svh,0.75rem)] p-[clamp(0.75rem,1.8svh,1.25rem)]"
                }`}
              >
                {compact ? (
                  <>
                    <div role="group" aria-label="Skill layers" className="grid grid-cols-6 gap-1.5">
                      {ROWS.map((rw, r) => (
                        <button
                          key={rw.category}
                          type="button"
                          aria-label={rw.category}
                          aria-pressed={r === row}
                          onClick={() => {
                            setRow(r);
                            setHot(null);
                          }}
                          className="keycap-mod min-h-11 rounded-lg [@media(max-height:480px)]:min-h-9 px-0.5 font-mono text-[0.625rem] uppercase tracking-[0.06em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey"
                        >
                          {rw.short}
                        </button>
                      ))}
                    </div>
                    {/* Every row shares one cell, so the tallest sets the height and switching rows never moves the page. */}
                    <div className="grid">
                      {ROWS.map((rw, r) => (
                        <div
                          key={rw.category}
                          role="group"
                          aria-label={rw.category}
                          aria-hidden={r !== row}
                          className="flex [grid-area:1/1]"
                          style={{ visibility: r === row ? "visible" : "hidden" }}
                        >
                          {keysOf(r)}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  ROWS.map((rw, r) => (
                    <div key={rw.category} role="group" aria-label={rw.category} className="flex flex-1 items-stretch gap-2">
                      <div aria-hidden="true" className="keycap-mod flex w-28 shrink-0 items-end rounded-xl px-3 pb-2 font-mono text-[clamp(0.6875rem,1.1svh,0.875rem)] uppercase leading-tight tracking-[0.1em] lg:w-44 2xl:w-52">
                        {rw.category}
                      </div>
                      {keysOf(r)}
                    </div>
                  ))
                )}
              </div>
            </div>
            <p aria-live="polite" className="sr-only">{said}</p>
          </motion.div>
          {!reduce && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-graphite-deep" style={{ opacity: shade }} />}
        </div>
      </div>

      <SkillCards open={fan} left={left} top={top} cardWidth={cardWidth} />
    </section>
  );
}

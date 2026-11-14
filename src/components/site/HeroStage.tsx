import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { hero, identity } from "@/data/portfolio";
import { introSeen, markSymbolsWarm } from "@/lib/symbolsWarm";
import { goToAnchor } from "@/lib/smoothScroll";
import { EchoTitle } from "./FitTitle";
import { useMediaQuery } from "./primitives";

const HeroSymbols = lazy(() => import("./HeroSymbols"));

const ECHO_DROP = [0.22, 0.42];
// Loading three.js blocks the page, so it waits until the preloader's seal has finished drawing (immediately when the intro is skipped).
const SEAL_DRAWN_MS = 600;

const hasWebGL = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
};

/** The symbols are decoration: if WebGL fails, the hero simply carries on without them. */
class SymbolsBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    markSymbolsWarm();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Poster hero: giant name, portrait in front of it. On scroll the symbols rise away first and the
 * portrait moves with the page, while two hollow copies of the name fall away behind. Its torn lower
 * edge is cut into the image itself, since the navy portal scene follows straight on.
 */
export function HeroStage({ ready }: { ready: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const portrait = useRef<HTMLImageElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [webgl] = useState(hasWebGL);
  const [warming, setWarming] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: stage, offset: ["start start", "end start"] });

  useEffect(() => {
    if (!webgl) {
      markSymbolsWarm();
      return;
    }
    const timer = window.setTimeout(() => setWarming(true), reduce || introSeen() ? 0 : SEAL_DRAWN_MS);
    return () => window.clearTimeout(timer);
  }, [webgl, reduce]);

  const echoOpacity = useTransform(p, [0, 0.02], [0, 1]);
  const echoNear = useTransform(p, (v) => v * ECHO_DROP[0] * (stage.current?.clientHeight ?? 0));
  const echoFar = useTransform(p, (v) => v * ECHO_DROP[1] * (stage.current?.clientHeight ?? 0));

  return (
    <section id="home" className="relative isolate bg-ink">
      <p className="sr-only">{hero.heading}</p>
      <div ref={stage} className="relative h-[max(100svh,46rem)] px-[clamp(1.25rem,2.78vw,4rem)] [overflow:clip] md:h-[max(100svh,89.03vw)]">
        <div aria-hidden="true" className="absolute inset-x-[clamp(1.25rem,2.78vw,4rem)] top-[7.5rem] z-10 md:top-[6.94%]">
          <EchoTitle
            text={identity.displayLines.join(" ")}
            ready={ready}
            ratio={isMobile ? 3.4 : 4.7}
            echoes={[{ y: echoNear, opacity: echoOpacity }, { y: echoFar, opacity: echoOpacity }]}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex h-[68%] justify-center md:h-[78.5%]">
          <motion.img
            ref={portrait}
            src={identity.portrait}
            alt="Illustrated portrait of Muhammad Luqman Khokhar in a denim jacket"
            width={777}
            height={907}
            {...{ fetchpriority: "high" }}
            className="h-full w-auto max-w-none select-none object-contain"
            draggable={false}
            // Drifts up and settles while it fades in; the fade gets its own gentler curve so it never pops.
            // Transform strings, not y/scale: they run on the compositor while the WebGL symbols start up.
            initial={reduce ? false : { opacity: 0, transform: "translateY(56px) scale(0.96)" }}
            animate={ready ? { opacity: 1, transform: "translateY(0px) scale(1)" } : undefined}
            transition={{ transform: { duration: 1.8, delay: 0.35, ease: [0.25, 1, 0.5, 1] }, opacity: { duration: 1.2, delay: 0.35, ease: "easeOut" } }}
            style={{ transformOrigin: "50% 100%" }}
          />
        </div>

        {/* Ink scrim keeps the copy legible over the portrait and the symbols. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[35] h-svh">
          <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink via-ink/85 to-transparent md:h-[48%] lg:h-[52%] lg:bg-[linear-gradient(to_right,hsl(var(--ink)/0.9),hsl(var(--ink)/0.75)_40%,transparent_66%)] xl:bg-[linear-gradient(to_right,hsl(var(--ink)/0.85),hsl(var(--ink)/0.65)_30%,transparent_54%)] lg:[mask-image:linear-gradient(to_top,#000_55%,transparent)]" />
        </div>

        <div className="pointer-events-none absolute inset-x-[clamp(1.25rem,2.78vw,4rem)] top-0 z-40 flex h-svh flex-col justify-end pb-6 md:pb-10">
          <motion.div
            className="pointer-events-auto max-w-[34rem] lg:max-w-[28rem] xl:max-w-[34rem]"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="eyebrow text-honey">{hero.eyebrow}</p>
            <h1 className="mt-3 text-balance font-display text-[clamp(2rem,3.4vw,3.25rem)] font-medium leading-[1.05] tracking-tight text-paper">{hero.headline}</h1>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-paper/90 md:mt-4 md:text-base">{hero.sub}</p>
            <div className="mt-5 flex flex-wrap gap-3 md:mt-6">
              <a href={hero.primaryCta.href} onClick={(e) => goToAnchor(e, hero.primaryCta.href)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-honey px-6 font-sans font-semibold text-ink transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-ink active:scale-[0.98]">
                {hero.primaryCta.label}
              </a>
              <a href={hero.secondaryCta.href} onClick={(e) => goToAnchor(e, hero.secondaryCta.href)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-paper/70 px-6 font-sans font-semibold text-paper transition-colors hover:border-honey hover:text-honey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-ink active:scale-[0.98]">
                {hero.secondaryCta.label}
              </a>
            </div>
            <p className="mt-4 text-sm text-paper/80">
              {hero.proof} <span aria-hidden="true">·</span> {identity.availability}
            </p>
          </motion.div>
        </div>

        {(warming || ready) && webgl && (
          <div aria-hidden="true" className="absolute inset-0 z-30">
            <SymbolsBoundary>
              <Suspense fallback={null}>
                <HeroSymbols stage={stage} portrait={portrait} scroll={p} still={!!reduce} ready={ready} />
              </Suspense>
            </SymbolsBoundary>
          </div>
        )}
      </div>
    </section>
  );
}

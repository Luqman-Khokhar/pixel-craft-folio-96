import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { hero, identity } from "@/data/portfolio";
import { markSymbolsWarm } from "@/lib/symbolsWarm";
import { EchoTitle } from "./FitTitle";
import { EASE_SOFT, useMediaQuery } from "./primitives";

const HeroSymbols = lazy(() => import("./HeroSymbols"));

const ECHO_DROP = [0.22, 0.42];
// Loading three.js blocks the page, so it waits until the preloader's seal has finished drawing.
const SEAL_DRAWN_MS = 2000;

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
    const timer = window.setTimeout(() => setWarming(true), reduce ? 0 : SEAL_DRAWN_MS);
    return () => window.clearTimeout(timer);
  }, [webgl, reduce]);

  const echoOpacity = useTransform(p, [0, 0.02], [0, 1]);
  const echoNear = useTransform(p, (v) => v * ECHO_DROP[0] * (stage.current?.clientHeight ?? 0));
  const echoFar = useTransform(p, (v) => v * ECHO_DROP[1] * (stage.current?.clientHeight ?? 0));

  return (
    <section id="home" className="relative isolate bg-ink">
      <h1 className="sr-only">{hero.heading}</h1>
      <div ref={stage} className="relative h-[max(100svh,46rem)] px-[clamp(1.25rem,2.78vw,4rem)] [overflow:clip] md:aspect-[1440/1360] md:h-auto md:min-h-svh">
        <motion.p
          className="absolute inset-x-[clamp(1.25rem,2.78vw,4rem)] top-[4.75rem] text-balance text-center text-[clamp(0.75rem,1.25vw,1.75rem)] uppercase leading-tight tracking-[0.14em] text-honey md:top-[10.37%]"
          initial={reduce ? false : { opacity: 0, transform: "translateY(24px)" }}
          animate={ready ? { opacity: 1, transform: "translateY(0px)" } : undefined}
          transition={{ duration: 1.4, delay: 0.35, ease: EASE_SOFT }}
        >
          {identity.role}
        </motion.p>

        <div aria-hidden="true" className="absolute inset-x-[clamp(1.25rem,2.78vw,4rem)] top-[7.5rem] z-10 md:top-[12.28%]">
          <EchoTitle
            text={identity.displayLines.join(" ")}
            ready={ready}
            ratio={isMobile ? 3.4 : 4.7}
            echoes={[{ y: echoNear, opacity: echoOpacity }, { y: echoFar, opacity: echoOpacity }]}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex h-[68%] justify-center md:h-[74%]">
          <motion.img
            ref={portrait}
            src={identity.portrait}
            alt="Illustrated portrait of Muhammad Luqman Khokhar in a denim jacket"
            width={777}
            height={907}
            {...{ fetchpriority: "high" }}
            className="h-full w-auto max-w-none select-none object-contain"
            draggable={false}
            initial={reduce ? false : { opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: 1.6, delay: 0.1, ease: EASE_SOFT }}
          />
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

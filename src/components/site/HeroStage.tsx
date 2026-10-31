import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowDown } from "lucide-react";
import { about, hero, identity } from "@/data/portfolio";
import { scrollToHash } from "@/lib/smoothScroll";
import { FitLine } from "./FitTitle";
import { FloatingTiles, Halo } from "./HeroPieces";
import { OrnateFrame } from "./OrnateFrame";
import { EASE, Roll, useMediaQuery } from "./primitives";

const typerSequence = hero.roles.flatMap((role) => [role, 1800]);

/** Scale the frame needs so its paper interior covers the whole viewport. */
function useZoomToCover(frameRef: React.RefObject<HTMLDivElement>) {
  const [cover, setCover] = useState(8);
  useEffect(() => {
    const measure = () => {
      const el = frameRef.current;
      if (!el || !el.offsetWidth) return;
      setCover(Math.max(window.innerWidth / el.offsetWidth, window.innerHeight / el.offsetHeight) * 1.3);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [frameRef]);
  return cover;
}

/**
 * Pinned opening: name and portrait, the title hollowing to an outline, then an
 * ornate frame that rises and is zoomed through into the paper About section.
 */
export function HeroStage({ ready }: { ready: boolean }) {
  const wrap = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const cover = useZoomToCover(frameRef);
  const { scrollYProgress: p } = useScroll({ target: wrap, offset: ["start start", "end end"] });

  const still = useMotionValue(0);
  const fullOn = useMotionValue(1);
  const fillOnScroll = useTransform(p, [0, 0.13], [1, 0]);
  const outlineOnScroll = useTransform(p, [0.02, 0.14, 0.42, 0.5], [0, 1, 1, 0]);
  const fill = reduce ? fullOn : fillOnScroll;
  const outline = reduce ? still : outlineOnScroll;
  const titleY = useTransform(p, [0, 0.46], ["0%", "-26%"]);
  const chrome = useTransform(p, [0, 0.07], [1, 0]);
  const chromeY = useTransform(p, [0, 0.07], [0, 40]);
  const portraitY = useTransform(p, [0, 0.42], ["0%", "-72%"]);
  const portraitScale = useTransform(p, [0, 0.42], [1, 1.14]);
  const portraitOpacity = useTransform(p, [0.28, 0.42], [1, 0]);
  const awayOnScroll = useTransform(p, [0, 0.36], [0, 1]);
  const away = reduce ? still : awayOnScroll;

  const frameY = useTransform(p, [0.3, 0.5], ["120svh", "0svh"]);
  const frameRotate = useTransform(p, [0.3, 0.5], [-5, 0]);
  const frameScale = useTransform(p, [0.58, 0.94], [1, cover], { ease: (t) => t * t * t });
  const frameText = useTransform(p, [0.58, 0.68], [1, 0]);
  const paperFade = useTransform(p, [0.9, 0.96], [0, 1]);
  const cue = useTransform(p, [0.6, 0.68], [1, 0]);
  const cueTint = useTransform(p, [0, 1], [0, 1]);

  const rawX = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 40, damping: 16 });
  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => rawX.set((e.clientX / window.innerWidth - 0.5) * 18);
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, rawX]);

  const lines = isMobile ? identity.displayLines : [identity.displayLines.join(" ")];

  return (
    <section id="home" ref={wrap} className={`relative bg-ink ${reduce ? "h-svh" : "h-[430svh]"}`}>
      <h1 className="sr-only">{hero.heading}</h1>
      <div className="sticky top-0 h-svh overflow-hidden">
        <div aria-hidden="true" className="absolute left-1/2 top-[58%] h-[110svh] w-[110svh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--honey)/0.2),transparent_62%)]" />

        <motion.div aria-hidden="true" className="absolute inset-x-0 top-[4.75rem] z-10 px-3 sm:px-5 md:top-[4.5rem]" style={reduce ? undefined : { y: titleY }}>
          <motion.p
            className="eyebrow mb-2 text-center text-honey md:mb-3"
            style={reduce ? undefined : { opacity: chrome }}
            initial={reduce ? false : { opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Hi, I'm {identity.firstName}
          </motion.p>
          {lines.map((line, i) => (
            <FitLine key={line} text={line} ready={ready} maxVh={isMobile ? 0.17 : 0.46} fill={fill} outline={outline} delay={0.1 + i * 0.12} />
          ))}
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 z-20 mx-auto flex h-[60svh] justify-center md:h-[69svh]"
          style={reduce ? undefined : { y: portraitY, scale: portraitScale, opacity: portraitOpacity, x: px }}
        >
          <motion.div
            className="relative h-full"
            initial={reduce ? false : { y: "24%", opacity: 0 }}
            animate={ready ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 1.3, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Halo className="absolute left-1/2 top-[-9%] -z-10 h-[62%] -translate-x-1/2 text-honey" />
            <img
              src={identity.portrait}
              alt="Portrait of Muhammad Luqman Khokhar in a denim jacket"
              width={433}
              height={577}
              {...{ fetchpriority: "high" }}
              className="fade-bottom h-full w-auto max-w-none object-contain"
              draggable={false}
            />
          </motion.div>
        </motion.div>

        <FloatingTiles ready={ready} away={away} />

        <motion.div
          className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-4 bg-gradient-to-t from-ink via-ink/90 to-transparent px-4 pb-5 pt-16 md:flex-row md:items-end md:justify-between md:bg-none md:px-6 md:pb-7 md:pt-0"
          style={reduce ? undefined : { opacity: chrome, y: chromeY }}
        >
          <motion.div
            className="max-w-sm md:max-w-[22rem]"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
          >
            <p className="eyebrow mb-2 min-h-[1.2em] text-honey">
              {reduce ? hero.roles[0] : <TypeAnimation sequence={typerSequence} speed={55} deletionSpeed={70} repeat={Infinity} cursor />}
            </p>
            <p className="text-sm leading-relaxed text-paper/85 md:text-base">{hero.tagline}</p>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-2"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1, duration: 0.9, ease: EASE }}
          >
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToHash("#contact"); }}
              className="rounded-full bg-honey px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Roll>Get In Touch</Roll>
            </a>
            <a
              href="#projects"
              onClick={(e) => { e.preventDefault(); scrollToHash("#projects"); }}
              className="rounded-full border border-paper/40 bg-ink/50 px-5 py-3 text-sm font-semibold backdrop-blur-sm transition-[transform,border-color] hover:-translate-y-0.5 hover:border-honey active:translate-y-0"
            >
              <Roll>View My Work</Roll>
            </a>
            <a href={identity.cv} target="_blank" rel="noopener noreferrer" className="rounded-full px-3 py-3 text-sm font-semibold underline decoration-honey underline-offset-4 hover:text-honey">
              Resume
            </a>
          </motion.div>
        </motion.div>

        {!reduce && (
        <>
        <motion.div className="pointer-events-none absolute inset-0 z-[35] grid place-items-center" style={{ y: frameY, rotate: frameRotate, scale: frameScale }}>
          <div ref={frameRef} className="relative aspect-[4/5] w-[min(72vw,50svh)]">
            <OrnateFrame className="absolute inset-0 h-full w-full" />
            <motion.h2 style={{ opacity: frameText }} className="absolute inset-[14%] grid place-items-center text-center font-serif text-[clamp(2.2rem,6.4svh,3.9rem)] font-medium leading-[1.02] tracking-tight text-ink">
              {about.headline}
            </motion.h2>
          </div>
        </motion.div>

        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[36] bg-paper" style={{ opacity: paperFade }} />

        <motion.div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-1/2 z-[37] hidden -translate-x-1/2 flex-col items-center gap-1 text-paper md:flex" style={{ opacity: cue }}>
          <span className="eyebrow flex items-center gap-1 !text-[0.65rem]">Keep scrolling <ArrowDown className="h-3 w-3 text-honey" /></span>
          <span className="h-px w-24 bg-paper/25"><motion.span className="block h-px origin-left bg-honey" style={{ scaleX: cueTint }} /></span>
        </motion.div>
        </>
        )}
      </div>
    </section>
  );
}

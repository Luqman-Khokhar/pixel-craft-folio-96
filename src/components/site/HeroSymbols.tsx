import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type MutableRefObject, type RefObject } from "react";
import { Canvas, useFrame, useThree, type EventManager, type RootState, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { identity } from "@/data/portfolio";
import { markSymbolsWarm } from "@/lib/symbolsWarm";
import { AndroidRobot, AppleCard, FirebaseFlame, ModelPixels, NextCoin, NodeBlock, ReactAtom, TypeScriptTile } from "./heroSymbolModels";

type Point = [number, number];

type Place = {
  x: number;
  y: number;
  size: number;
  /** Where it waits, hidden behind the portrait, before the entrance. */
  from: Point;
  /** Curve handle for homes that sit over the portrait: the path clears the silhouette here, then comes forward. */
  via?: Point;
};

type Slot = {
  name: string;
  Model: ComponentType;
  /** Position as a share of the stage, size as a share of its width. */
  wide: Place;
  /** Only symbols with a phone place appear on phones. */
  phone?: Place;
  rotation: [number, number, number];
  depth: number;
  /** Axis it turns around when pressed: y flips like a card, x tumbles, z cartwheels. */
  turn: "x" | "y" | "z";
  /** Two-sided pieces turn halfway, so each press leaves the other side showing. */
  turnAngle?: number;
};

const SLOTS: Slot[] = [
  { name: "React", Model: ReactAtom, wide: { x: 0.13, y: 0.52, size: 0.2, from: [0.54, 0.42] }, phone: { x: 0.16, y: 0.54, size: 0.36, from: [0.35, 0.72] }, rotation: [0.35, 0.45, -0.25], depth: 1.25, turn: "x" },
  { name: "Firebase", Model: FirebaseFlame, wide: { x: 0.3, y: 0.48, size: 0.1, from: [0.54, 0.4] }, rotation: [0.08, 0.22, -0.1], depth: 0.8, turn: "y" },
  { name: "TypeScript", Model: TypeScriptTile, wide: { x: 0.5, y: 0.215, size: 0.08, from: [0.55, 0.38] }, phone: { x: 0.85, y: 0.36, size: 0.2, from: [0.7, 0.42], via: [0.95, 0.24] }, rotation: [0.15, -0.3, -0.2], depth: 0.7, turn: "y", turnAngle: Math.PI },
  { name: "Next.js", Model: NextCoin, wide: { x: 0.215, y: 0.72, size: 0.075, from: [0.53, 0.46] }, rotation: [0.25, 0.5, 0.1], depth: 0.9, turn: "y", turnAngle: Math.PI },
  { name: "Android", Model: AndroidRobot, wide: { x: 0.7, y: 0.5, size: 0.1, from: [0.58, 0.42] }, phone: { x: 0.11, y: 0.8, size: 0.24, from: [0.3, 0.75], via: [0.14, 0.36] }, rotation: [0.1, -0.45, 0.12], depth: 0.85, turn: "z" },
  { name: "Node.js", Model: NodeBlock, wide: { x: 0.875, y: 0.49, size: 0.14, from: [0.58, 0.42] }, rotation: [0.3, -0.55, 0.12], depth: 1.15, turn: "y", turnAngle: Math.PI },
  { name: "Apple", Model: AppleCard, wide: { x: 0.81, y: 0.72, size: 0.145, from: [0.57, 0.44] }, phone: { x: 0.88, y: 0.76, size: 0.25, from: [0.7, 0.75], via: [0.97, 0.38] }, rotation: [0.12, -0.4, -0.2], depth: 1.05, turn: "y", turnAngle: Math.PI },
];

const ENTER_DELAY = 0.5;
const ENTER_STAGGER = 0.1;
const ENTER_SECONDS = 1.7;
const ENTER_SCALE = 0.6;
const ENTER_TURN = 0.9;
// Share of the entrance at which a symbol comes forward past the portrait, once clear of its silhouette.
const CROSS_AT = 0.94;
const CROSS_AT_VIA = 0.6;
const CROSS_SPAN = 0.08;
// Far enough back that no symbol reaches the portrait plane from its resting depth, at any screen width.
const PORTRAIT_Z = -800;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const bend = (from: number, via: number, to: number, t: number) => (1 - t) * (1 - t) * from + 2 * (1 - t) * t * via + t * t * to;
const damp = THREE.MathUtils.damp;
const FULL_TURN = Math.PI * 2;
const SCROLL_RISE = 0.45;
// Spring on the turn: slightly under-damped so a flip overshoots and settles.
const TURN_STIFFNESS = 42;
const TURN_DAMPING = 8.5;

interface SymbolProps {
  slot: Slot;
  index: number;
  still: boolean;
  ready: boolean;
  scroll: MotionValue<number>;
  pointer: MutableRefObject<{ x: number; y: number }>;
  stage: RefObject<HTMLElement>;
}

function FloatingSymbol({ slot, index, still, ready, scroll, pointer, stage }: SymbolProps) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const hoverScale = useRef(1);
  const arrived = useRef(still);
  const revealedAt = useRef<number | null>(null);
  const turn = useRef({ angle: 0, speed: 0, target: 0 });
  const turnAngle = slot.turnAngle ?? FULL_TURN;
  const [hovered, setHovered] = useState(false);
  const [labelBelow, setLabelBelow] = useState(0);
  const stageWidth = useThree((state) => state.size.width);
  const placed = stageWidth < 768 && slot.phone ? slot.phone : slot.wide;
  const { Model } = slot;

  useFrame((state, dt) => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const { width: W, height: H } = state.size;
    const size = placed.size * W;
    const t = state.clock.elapsedTime;
    // The scene is drawn under the preloader to warm up, so the entrance is timed from the reveal.
    if (ready && revealedAt.current === null) revealedAt.current = t;
    const sinceReveal = revealedAt.current === null ? 0 : t - revealedAt.current;
    const enter = still ? 1 : easeOut(THREE.MathUtils.clamp((sinceReveal - ENTER_DELAY - index * ENTER_STAGGER) / ENTER_SECONDS, 0, 1));
    const p = still ? 0 : scroll.get();
    const bob = still ? 0 : Math.sin(t * 0.7 + index * 1.7);
    const sway = still ? 0 : Math.sin(t * 0.45 + index * 2.3);
    const [startX, startY] = placed.from;
    const [viaX, viaY] = placed.via ?? [placed.x, startY];
    const crossAt = placed.via ? CROSS_AT_VIA : CROSS_AT;
    const forward = THREE.MathUtils.smoothstep(enter, crossAt - CROSS_SPAN, crossAt);
    arrived.current = enter >= crossAt;

    o.position.set(
      (bend(startX, viaX, placed.x, enter) - 0.5) * W - pointer.current.x * slot.depth * 22,
      // Rises faster than the page, so the symbols leave before the portrait does.
      (0.5 - bend(startY, viaY, placed.y, enter)) * H + H * SCROLL_RISE * p * slot.depth + bob * size * 0.05 + pointer.current.y * slot.depth * 14,
      THREE.MathUtils.lerp(PORTRAIT_Z - size, slot.depth * 200, forward)
    );

    const spin = turn.current;
    const step = Math.min(dt, 0.05);
    spin.speed += ((spin.target - spin.angle) * TURN_STIFFNESS - spin.speed * TURN_DAMPING) * step;
    spin.angle += spin.speed * step;
    if (spinner.current) spinner.current.rotation[slot.turn] = spin.angle;
    // Hops toward the viewer while turning, and lands as the turn finishes.
    const hop = Math.sin(Math.min(Math.abs(spin.target - spin.angle) / turnAngle, 1) * Math.PI);
    o.position.y += hop * size * 0.14;

    hoverScale.current = damp(hoverScale.current, hovered ? 1.08 : 1, 8, dt);
    i.scale.setScalar(size * THREE.MathUtils.lerp(ENTER_SCALE, 1, enter) * hoverScale.current * (1 + hop * 0.1));
    i.rotation.set(
      slot.rotation[0] + sway * 0.1 + pointer.current.y * -0.25,
      slot.rotation[1] + bob * 0.14 + pointer.current.x * 0.4 + (1 - enter) * ENTER_TURN * Math.sign(placed.x - 0.5),
      slot.rotation[2] + sway * 0.05
    );
    if (hovered) setLabelBelow(size * 0.66);
  });

  const setCursor = (value: string) => {
    if (stage.current) stage.current.style.cursor = value;
  };

  /** Each press adds a turn, in the direction of the side that was pressed. */
  const press = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const fromLeft = e.point.x < (outer.current?.position.x ?? 0);
    turn.current.target += fromLeft ? turnAngle : -turnAngle;
  };

  return (
    <group ref={outer}>
      <group ref={inner}>
        <group ref={spinner}>
          <ModelPixels.Provider value={placed.size * stageWidth}>
            <Model />
          </ModelPixels.Provider>
        </group>
        <mesh
          visible={false}
          onClick={still ? undefined : press}
          onPointerOver={(e) => {
            if (!arrived.current) return;
            e.stopPropagation();
            setHovered(true);
            if (!still) setCursor("pointer");
          }}
          onPointerOut={() => {
            setHovered(false);
            setCursor("");
          }}
        >
          <sphereGeometry args={[0.55, 12, 8]} />
        </mesh>
      </group>
      {hovered && (
        <Html center position={[0, -labelBelow, 0]} zIndexRange={[50, 0]}>
          <span className="eyebrow block whitespace-nowrap rounded-full bg-paper px-3 py-1.5 !text-[0.65rem] text-ink">{slot.name}</span>
        </Html>
      )}
    </group>
  );
}

/**
 * Invisible copy of the portrait that only writes depth. The real one is a DOM image under this canvas,
 * so this is what lets a symbol sit behind it: anything further back than this plane is cut to the silhouette.
 */
function PortraitMask({ texture, portrait }: { texture: THREE.Texture; portrait: RefObject<HTMLImageElement> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const size = useThree((state) => state.size);
  const canvas = useThree((state) => state.gl.domElement);

  useLayoutEffect(() => {
    if (!mesh.current || !portrait.current) return;
    const img = portrait.current.getBoundingClientRect();
    const box = canvas.getBoundingClientRect();
    mesh.current.position.set(img.left + img.width / 2 - box.left - box.width / 2, box.top + box.height / 2 - img.top - img.height / 2, PORTRAIT_Z);
    mesh.current.scale.set(img.width, img.height, 1);
  }, [size.width, size.height, canvas, portrait]);

  return (
    <mesh ref={mesh} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} alphaTest={0.5} alphaToCoverage colorWrite={false} />
    </mesh>
  );
}

function Rig({ still, ready, scroll, stage }: { still: boolean; ready: boolean; scroll: MotionValue<number>; stage: RefObject<HTMLElement> }) {
  const target = useRef({ x: 0, y: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const advance = useThree((state) => state.advance);

  // Draws one frame right now, compiling every shader, rather than waiting on an animation frame.
  useEffect(() => {
    advance(performance.now());
    markSymbolsWarm();
  }, [advance]);

  useEffect(() => {
    if (still) return;
    const move = (e: PointerEvent) => {
      target.current.x = e.clientX / window.innerWidth - 0.5;
      target.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [still]);

  useFrame((_, dt) => {
    pointer.current.x = damp(pointer.current.x, target.current.x, 3, dt);
    pointer.current.y = damp(pointer.current.y, target.current.y, 3, dt);
  });

  return (
    <>
      {SLOTS.map((slot, i) => (
        <PlacedSymbol key={slot.name} slot={slot} index={i} still={still} ready={ready} scroll={scroll} pointer={pointer} stage={stage} />
      ))}
    </>
  );
}

/** Phones show only the symbols that have a phone place. */
function PlacedSymbol(props: SymbolProps) {
  const phone = useThree((state) => state.size.width < 768);
  if (phone && !props.slot.phone) return null;
  return <FloatingSymbol {...props} />;
}

/**
 * Pointer position relative to the canvas as it sits right now. The canvas scrolls with the page,
 * and fiber's eventPrefix option would use the raw window position, missing every model once scrolled.
 */
const computePointer: EventManager<HTMLElement>["compute"] = (event, state) => {
  const box = state.gl.domElement.getBoundingClientRect();
  state.pointer.set(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1);
  state.raycaster.setFromCamera(state.pointer, state.camera);
};

const attachPointer = (state: RootState) => state.setEvents({ compute: computePointer });

interface HeroSymbolsProps {
  stage: RefObject<HTMLElement>;
  portrait: RefObject<HTMLImageElement>;
  scroll: MotionValue<number>;
  still: boolean;
  ready: boolean;
}

/** Tech symbols floating around the portrait. Decorative, lazy-loaded, and asleep while off screen. */
export default function HeroSymbols({ stage, portrait, scroll, still, ready }: HeroSymbolsProps) {
  const [visible, setVisible] = useState(true);
  const [mask, setMask] = useState<THREE.Texture | null>(null);

  // Nothing mounts before the mask is ready: without it the symbols would show through the portrait.
  useEffect(() => {
    if (still) return;
    const texture = new THREE.TextureLoader().load(identity.portrait, setMask);
    return () => texture.dispose();
  }, [still]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const seen = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    seen.observe(el);
    return () => seen.disconnect();
  }, [stage]);

  if (!still && !mask) return null;

  return (
    <Canvas
      orthographic
      flat
      className="!absolute inset-0"
      eventSource={stage as RefObject<HTMLElement>}
      onCreated={attachPointer}
      // One frame is enough to compile everything; looping only starts once the preloader lifts.
      frameloop={still || !ready ? "demand" : visible ? "always" : "never"}
      camera={{ zoom: 1, position: [0, 0, 1000], near: 1, far: 3000 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      {mask && <PortraitMask texture={mask} portrait={portrait} />}
      <Rig still={still} ready={ready} scroll={scroll} stage={stage} />
    </Canvas>
  );
}

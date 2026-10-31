import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "@/data/portfolio";

// three.js materials take literal colors: these mirror --paper and --honey in index.css.
const PAPER = "#f5f1e8";
const HONEY = "#f5ab29";

const VERT = /* glsl */ `
  uniform float uCurve; uniform float uVel;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float x = p.x * 2.0; float y = p.y * 2.0;
    p.z -= uCurve * x * x * 0.16;
    p.z += uVel * y * y * 0.28;
    p.y += uVel * sin(x * 3.1415) * 0.05;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

// Covers show as plain images in full colour; this only rounds the corners and fades far-off cards.
const FRAG = /* glsl */ `
  uniform sampler2D uMap; uniform float uAspect; uniform float uAlpha;
  varying vec2 vUv;
  float box(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main() {
    vec2 d = vUv - 0.5;
    float sd = box(d * vec2(uAspect, 1.0), vec2(uAspect * 0.5, 0.5), 0.035);
    float a = 1.0 - smoothstep(-0.003, 0.003, sd);
    gl_FragColor = vec4(texture2D(uMap, vUv).rgb, a * uAlpha);
  }
`;

type Shared = {
  progress: MutableRefObject<number>;
  onSelect: (index: number) => void;
};

function useLayout() {
  const { viewport, camera, size } = useThree();
  const { width: vw, height: vh } = viewport.getCurrentViewport(camera, [0, 0, 0]);
  return { vw, vh, portrait: size.width < 768 };
}

const fall = (d: number) => THREE.MathUtils.smoothstep(Math.abs(d), 0, 1);

function Cover({ index, progress, onSelect, velocity }: Shared & { index: number; velocity: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const tex = useTexture(projects[index].cover);
  const { vw, vh, portrait } = useLayout();
  const uniforms = useMemo(
    () => ({
      uMap: { value: tex },
      uVel: { value: 0 },
      uCurve: { value: 0.5 },
      uAspect: { value: 1.6 },
      uAlpha: { value: 1 },
    }),
    [tex]
  );

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const d = index - progress.current;
    const w = portrait ? Math.min(vw * 0.92, vh * 0.56) : Math.min(vw * 0.31, vh * 0.86);
    const R = portrait ? vw * 1.3 : vh * 1.05;
    const s = THREE.MathUtils.lerp(1, portrait ? 0.74 : 0.64, fall(d));
    if (portrait) {
      const a = d * 0.82;
      g.position.set(Math.sin(a) * R, vh * 0.15 - (1 - Math.cos(a)) * R, 0);
      g.rotation.z = -a * 0.5;
    } else {
      const a = d * 0.56;
      const cx = -vw * 0.27 - R;
      g.position.set(cx + Math.cos(a) * R, -Math.sin(a) * R, 0);
      g.rotation.z = -a * 0.9;
    }
    g.scale.set(w * s, (w / 1.6) * s, w * s);
    g.visible = Math.abs(d) < 2.4;
    uniforms.uVel.value = velocity.current;
    uniforms.uAlpha.value = 1 - THREE.MathUtils.smoothstep(Math.abs(d), 1.5, 2.2);
  });

  const hover = (on: boolean) => {
    if (on) document.body.dataset.cursorLabel = "View";
    else delete document.body.dataset.cursorLabel;
  };

  return (
    <group ref={group}>
      <mesh
        onClick={() => { hover(false); onSelect(index); }}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <planeGeometry args={[1, 1, 32, 20]} />
        <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function LogoTile({ index, progress, onSelect, velocity, pointer }: Shared & { index: number; velocity: MutableRefObject<number>; pointer: MutableRefObject<[number, number]> }) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const tex = useTexture(projects[index].logo);
  const img = tex.image as HTMLImageElement | undefined;
  const ratio = img ? img.width / img.height : 1;
  const { vw, vh, portrait } = useLayout();

  useFrame((_, dt) => {
    const g = group.current;
    const b = body.current;
    if (!g || !b) return;
    const d = index - progress.current;
    const size = portrait ? vw * 0.2 : Math.min(vw * 0.1, vh * 0.26);
    const R = portrait ? vw * 1.3 : vh * 1.05;
    const s = THREE.MathUtils.lerp(1, 0.72, fall(d));
    if (portrait) {
      const a = d * 0.82;
      g.position.set(Math.sin(a) * R * 1.25 + vw * 0.34, vh * 0.15 - Math.min(vw * 0.92, vh * 0.56) * 0.29 - (1 - Math.cos(a)) * R, 0.6);
    } else {
      const a = d * 0.56;
      const cx = vw * 0.255 + R;
      g.position.set(cx - Math.cos(a) * R, -Math.sin(a) * R, 0);
    }
    g.scale.setScalar(size * s);
    g.visible = Math.abs(d) < 2.2;
    const focus = 1 - THREE.MathUtils.smoothstep(Math.abs(d), 0.05, 0.6);
    const damp = THREE.MathUtils.damp;
    b.rotation.y = damp(b.rotation.y, pointer.current[0] * 0.5 * focus + (1 - focus) * d * 0.9 + velocity.current * 2.2, 7, dt);
    b.rotation.x = damp(b.rotation.x, -pointer.current[1] * 0.35 * focus + (1 - focus) * 0.5, 7, dt);
    b.rotation.z = damp(b.rotation.z, (1 - focus) * d * 0.6, 7, dt);
  });

  return (
    <group ref={group} onClick={() => onSelect(index)}>
      <group ref={body}>
        <RoundedBox args={[1, 1, 0.18]} radius={0.085} smoothness={4}>
          <meshPhysicalMaterial color={PAPER} emissive={PAPER} emissiveIntensity={0.32} roughness={0.3} metalness={0.1} clearcoat={1} clearcoatRoughness={0.2} iridescence={1} iridescenceIOR={1.7} />
        </RoundedBox>
        <mesh position={[0, 0, 0.092]} scale={ratio >= 1 ? [0.74, 0.74 / ratio, 1] : [0.74 * ratio, 0.74, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Rig({ progress, target, velocity, pointer, onSelect }: Shared & { target: MutableRefObject<number>; velocity: MutableRefObject<number>; pointer: MutableRefObject<[number, number]> }) {
  useFrame((_, dt) => {
    const prev = progress.current;
    progress.current = THREE.MathUtils.damp(prev, target.current, 7, dt);
    const raw = dt > 0 ? (progress.current - prev) / dt : 0;
    velocity.current = THREE.MathUtils.damp(velocity.current, THREE.MathUtils.clamp(raw * 0.32, -0.7, 0.7), 8, dt);
  });
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      <directionalLight position={[-5, -2, 3]} intensity={1.4} color={HONEY} />
      {projects.map((p, i) => (
        <group key={p.title}>
          <Cover index={i} progress={progress} velocity={velocity} onSelect={onSelect} />
          <LogoTile index={i} progress={progress} velocity={velocity} pointer={pointer} onSelect={onSelect} />
        </group>
      ))}
    </>
  );
}

interface OrbitSceneProps {
  target: MutableRefObject<number>;
  pointer: MutableRefObject<[number, number]>;
  onSelect: (index: number) => void;
  active: boolean;
}

export default function OrbitScene({ target, pointer, onSelect, active }: OrbitSceneProps) {
  const progress = useRef(target.current);
  const velocity = useRef(0);
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 10], fov: 28 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Rig progress={progress} target={target} velocity={velocity} pointer={pointer} onSelect={onSelect} />
    </Canvas>
  );
}

import { createContext, useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Outlines, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { APPLE_DARK, APPLE_LIGHT, CARD_FACE, NEXT_DARK, NEXT_LIGHT, NODE_DARK, NODE_HEX, NODE_LIGHT, shapesOf, TS_DARK, TS_LIGHT } from "./heroSymbolFaces";

// three.js materials take literal colors. These come from the golden portrait.
const OUTLINE = "#5a2d0c";
const OUTLINE_PX = 3;

const VERT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Two flat tones and a hard highlight, so the models read as illustration beside the portrait.
const FRAG = /* glsl */ `
  uniform vec3 uLit; uniform vec3 uShade; uniform float uGloss;
  varying vec3 vNormal;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 l = normalize(vec3(-0.45, 0.75, 0.6));
    vec3 color = mix(uShade, uLit, smoothstep(-0.04, 0.04, dot(n, l)));
    float spec = pow(max(dot(n, normalize(l + vec3(0.0, 0.0, 1.0))), 0.0), 90.0);
    color = mix(color, vec3(1.0), smoothstep(0.45, 0.5, spec) * uGloss);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

const tone = (lit: string, shade: string, gloss = 1) =>
  new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uLit: { value: new THREE.Color(lit) },
      uShade: { value: new THREE.Color(shade) },
      uGloss: { value: gloss },
    },
  });

const CREAM = tone("#fdf0ca", "#e7b566");
const GOLD = tone("#f7b538", "#c98f2e");
const OCHRE = tone("#d78d34", "#a8651c");
const WHITE = tone("#fdffff", "#efd29a");
const BROWN = tone("#6b3a14", "#4a230a", 0);

/** Width of one model unit on screen, so every outline comes out the same pixel width. */
export const ModelPixels = createContext(200);

// drei 9.122 has this flag backwards: `screenspace` is what gives thickness in model units.
const Edge = () => {
  const pixels = useContext(ModelPixels);
  return <Outlines screenspace thickness={OUTLINE_PX / pixels} color={OUTLINE} />;
};

/** SVG runs y-down and three.js y-up: mirror the mesh and swap each triangle's winding to keep it solid. */
function mirrorY(geometry: THREE.BufferGeometry) {
  ["position", "normal", "uv"].forEach((name) => {
    const attr = geometry.getAttribute(name);
    const { array, itemSize } = attr;
    const data = array as Float32Array;
    for (let tri = 0; tri < attr.count; tri += 3) {
      for (let c = 0; c < itemSize; c++) {
        const a = (tri + 1) * itemSize + c;
        const b = (tri + 2) * itemSize + c;
        [data[a], data[b]] = [data[b], data[a]];
      }
    }
    if (name !== "uv") for (let v = 0; v < attr.count; v++) data[v * itemSize + 1] *= -1;
  });
  return geometry;
}

/** Extrudes SVG shapes into one unit-sized solid. `span` is how many SVG units equal one model unit. */
function solid(shapes: THREE.Shape[], span: number, center: [number, number], depth: number, bevel = 0.012) {
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: depth * span,
    bevelEnabled: bevel > 0,
    bevelSize: bevel * span,
    bevelThickness: bevel * span,
    bevelSegments: 3,
    curveSegments: 16,
  });
  geometry.translate(-center[0], -center[1], (-depth * span) / 2);
  geometry.scale(1 / span, 1 / span, 1 / span);
  return mirrorY(geometry);
}

const FLAME = ["M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771z", "M20.684 19.364l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0z", "M14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z"];

const GEOMETRY = {
  hex: solid(shapesOf(NODE_HEX), 24, [12, 12], 0.38, 0.02),
  flame: FLAME.map((d) => solid(shapesOf(d), 24, [12, 12], 0.16, 0.012)),
};

/** Printed faces on both sides of a body. `first` shows at rest, `second` once pressed. */
const TwoFaces = ({ first, second, size, z }: { first: THREE.Material; second: THREE.Material; size: [number, number]; z: number }) => (
  <>
    <mesh position={[0, 0, z]} material={first}>
      <planeGeometry args={size} />
    </mesh>
    <mesh position={[0, 0, -z]} rotation={[0, Math.PI, 0]} material={second}>
      <planeGeometry args={size} />
    </mesh>
  </>
);

export function ReactAtom() {
  const rings = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (rings.current) rings.current.rotation.z += dt * 0.12;
  });
  return (
    <group>
      <group ref={rings}>
        {[0, Math.PI / 3, (2 * Math.PI) / 3].map((angle) => (
          <group key={angle} rotation={[0, 0, angle]}>
            <mesh scale={[1, 0.38, 1]} material={GOLD}>
              <torusGeometry args={[0.5, 0.032, 16, 96]} />
              <Edge />
            </mesh>
          </group>
        ))}
      </group>
      <mesh material={CREAM}>
        <sphereGeometry args={[0.105, 32, 24]} />
        <Edge />
      </mesh>
    </group>
  );
}

export function FirebaseFlame() {
  const tones = [CREAM, GOLD, OCHRE];
  return (
    <group>
      {GEOMETRY.flame.map((geometry, i) => (
        <mesh key={i} geometry={geometry} material={tones[i]} position={[0, 0, i * 0.012]}>
          <Edge />
        </mesh>
      ))}
    </group>
  );
}

export function TypeScriptTile() {
  return (
    <group>
      <RoundedBox args={[1, 1, 0.06]} radius={0.028} smoothness={4} material={GOLD}>
        <Edge />
      </RoundedBox>
      <TwoFaces first={TS_LIGHT} second={TS_DARK} size={[0.96, 0.96]} z={0.031} />
    </group>
  );
}

export function NextCoin() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={GOLD}>
        <cylinderGeometry args={[0.5, 0.5, 0.09, 64]} />
        <Edge />
      </mesh>
      <TwoFaces first={NEXT_LIGHT} second={NEXT_DARK} size={[0.95, 0.95]} z={0.046} />
    </group>
  );
}

const Limb = ({ x, y, length, radius }: { x: number; y: number; length: number; radius: number }) => (
  <mesh position={[x, y, 0]} material={WHITE}>
    <capsuleGeometry args={[radius, length, 8, 20]} />
    <Edge />
  </mesh>
);

export function AndroidRobot() {
  return (
    <group scale={0.78} position={[0, 0.02, 0]}>
      <group position={[0, 0.2, 0]}>
        <mesh material={WHITE}>
          <sphereGeometry args={[0.36, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Edge />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={WHITE}>
          <circleGeometry args={[0.36, 40]} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 0.14, 0.17, 0.31]} material={BROWN}>
              <sphereGeometry args={[0.038, 16, 12]} />
            </mesh>
            <mesh position={[side * 0.19, 0.4, 0]} rotation={[0, 0, -side * 0.5]} material={GOLD}>
              <capsuleGeometry args={[0.02, 0.15, 6, 10]} />
              <Edge />
            </mesh>
          </group>
        ))}
      </group>
      <RoundedBox args={[0.72, 0.56, 0.5]} radius={0.08} smoothness={4} position={[0, -0.14, 0]} material={WHITE}>
        <Edge />
      </RoundedBox>
      <Limb x={-0.48} y={-0.1} length={0.32} radius={0.075} />
      <Limb x={0.48} y={-0.1} length={0.32} radius={0.075} />
      <Limb x={-0.17} y={-0.5} length={0.2} radius={0.08} />
      <Limb x={0.17} y={-0.5} length={0.2} radius={0.08} />
    </group>
  );
}

export function NodeBlock() {
  return (
    <group>
      <mesh geometry={GEOMETRY.hex} material={GOLD}>
        <Edge />
      </mesh>
      <TwoFaces first={NODE_LIGHT} second={NODE_DARK} size={[0.97, 0.97]} z={0.211} />
    </group>
  );
}

const CARD_DEPTH = 0.05;

/** Two-sided playing card: navy lattice back, white face. */
export function AppleCard() {
  return (
    <group>
      <RoundedBox args={[0.74, 1, CARD_DEPTH]} radius={0.024} smoothness={4} material={GOLD}>
        <Edge />
      </RoundedBox>
      <TwoFaces first={APPLE_DARK} second={APPLE_LIGHT} size={CARD_FACE} z={CARD_DEPTH / 2 + 0.001} />
    </group>
  );
}

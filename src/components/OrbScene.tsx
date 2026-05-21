import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SceneProps {
  mouseX: number;
  mouseY: number;
}

function TorusKnotMesh({ mouseX, mouseY }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const coreRef  = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.6, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY * 0.3, 0.04);
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = t * 0.18;
      outerRef.current.rotation.y = t * 0.28;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.22;
      innerRef.current.rotation.y =  t * 0.35;
    }
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 2.5) * 0.12;
      coreRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe */}
      <mesh ref={outerRef}>
        <torusKnotGeometry args={[1.1, 0.33, 140, 16]} />
        <meshBasicMaterial color="#f97316" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Inner solid emissive */}
      <mesh ref={innerRef} scale={0.65}>
        <torusKnotGeometry args={[1.1, 0.33, 80, 8]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={0.9}
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Blue accent ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.012, 8, 80]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
      </mesh>

      {/* Glowing core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function Particles() {
  const count = 350;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = 2.8 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#3b82f6" size={0.022} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function OrbScene({ mouseX, mouseY }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.8], fov: 52 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 4, 4]}   intensity={2.5} color="#f97316" />
      <pointLight position={[-4, -3, -4]} intensity={1.2} color="#3b82f6" />
      <pointLight position={[0, 3, 2]}    intensity={0.8} color="#fbbf24" />
      <TorusKnotMesh mouseX={mouseX} mouseY={mouseY} />
      <Particles />
    </Canvas>
  );
}

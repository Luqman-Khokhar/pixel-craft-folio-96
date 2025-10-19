"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

function BeeModel() {
  const { scene, animations } = useGLTF("/Model/bee_rigged.glb");
  const beeRef = useRef<THREE.Group>(null);
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const leftWing = useRef<THREE.Object3D | null>(null);
  const rightWing = useRef<THREE.Object3D | null>(null);

  // For tilt calculation
  const prevX = useRef(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () =>
      setMaxScroll(document.body.scrollHeight - window.innerHeight);

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    if (animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[0]);
      action.play();
    } else {
      scene.traverse((child) => {
        if (child.name.toLowerCase().includes("wing") && !leftWing.current) {
          leftWing.current = child;
        } else if (
          child.name.toLowerCase().includes("wing") &&
          leftWing.current &&
          !rightWing.current
        ) {
          rightWing.current = child;
        }
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [animations, scene]);

  useFrame((state, delta) => {
    if (!beeRef.current || maxScroll <= 0) return;

    const t = state.clock.getElapsedTime();
    const progress = Math.min(scrollY / maxScroll, 1);

    // 🐝 Flight path
    const startX = 1.5;
    const endX = -2;
    const startY = -0.7;
    const endY = -1;

    const waveX = Math.sin(t * 2) * 1.5;
    const targetX = startX + (endX - startX) * progress + waveX;
    const targetY = startY + (endY - startY) * progress;

    beeRef.current.position.x = targetX;
    beeRef.current.position.y = targetY;
    beeRef.current.position.z = 0;

    // ✨ Tilt body when moving horizontally
    const velocityX = targetX - prevX.current;
    const maxTilt = 0.5; // how much to lean
    const tilt = THREE.MathUtils.clamp(velocityX * 3, -maxTilt, maxTilt);
    beeRef.current.rotation.z = tilt; // lean side to side
    beeRef.current.rotation.y = Math.sin(t * 2) * 0.2; // gentle yaw

    prevX.current = targetX;

    // 🪽 Wing flapping
    if (mixer.current) {
      mixer.current.update(delta);
    } else {
      const flap = Math.sin(t * 20) * 0.6;
      if (leftWing.current) leftWing.current.rotation.z = flap;
      if (rightWing.current) rightWing.current.rotation.z = -flap;
    }
  });

  return <primitive ref={beeRef} object={scene} scale={0.022} />;
}

export default function AnimatedCharacter() {
  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "visible",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} />
        <BeeModel />
      </Canvas>
    </div>
  );
}

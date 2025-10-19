import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

type SectionType = "home" | "about" | "skills" | "projects" | "experience" | "contact";

const ParrotModel = () => {
  const { scene } = useGLTF("/Model/parrot.glb");
  const parrotRef = useRef<THREE.Group>(null);
  const [activeSection, setActiveSection] = useState<SectionType>("home");
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0, z: 0 });
  const [isClicked, setIsClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Section positions mapping
  const sectionPositions: Record<SectionType, { x: number; y: number; z: number }> = {
    home: { x: 2, y: 0, z: 0 },
    about: { x: -2, y: 1, z: 0 },
    skills: { x: 2, y: -1, z: 0 },
    projects: { x: -2, y: 0, z: 0 },
    experience: { x: 2, y: 1, z: 0 },
    contact: { x: 0, y: -1, z: 0 },
  };

  // Intersection Observer for scroll detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id as SectionType;
          if (sectionId && sectionPositions[sectionId]) {
            setActiveSection(sectionId);
            setTargetPosition(sectionPositions[sectionId]);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ["home", "about", "skills", "projects", "experience", "contact"];
    
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Click animation trigger
  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
  };

  // Animation loop
  useFrame((state, delta) => {
    if (!parrotRef.current) return;

    // Smooth position interpolation (flying/hopping between sections)
    parrotRef.current.position.x += (targetPosition.x - parrotRef.current.position.x) * delta * 2;
    parrotRef.current.position.y += (targetPosition.y - parrotRef.current.position.y) * delta * 2;
    parrotRef.current.position.z += (targetPosition.z - parrotRef.current.position.z) * delta * 2;

    // Idle floating animation
    if (!isClicked) {
      parrotRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.003;
    }

    // Click bounce/flap animation
    if (isClicked) {
      const bounceAmount = Math.sin(state.clock.elapsedTime * 20) * 0.3;
      parrotRef.current.position.y += bounceAmount * delta;
      parrotRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 20) * 0.3;
    } else {
      parrotRef.current.rotation.z += (0 - parrotRef.current.rotation.z) * delta * 5;
    }

    // Gentle rotation towards movement direction
    const targetRotation = Math.atan2(
      targetPosition.x - parrotRef.current.position.x,
      targetPosition.z - parrotRef.current.position.z
    );
    parrotRef.current.rotation.y += (targetRotation - parrotRef.current.rotation.y) * delta * 2;

    // Hover effect
    if (hovered) {
      parrotRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 5) * 0.05);
    } else {
      const targetScale = 1;
      parrotRef.current.scale.x += (targetScale - parrotRef.current.scale.x) * delta * 5;
      parrotRef.current.scale.y += (targetScale - parrotRef.current.scale.y) * delta * 5;
      parrotRef.current.scale.z += (targetScale - parrotRef.current.scale.z) * delta * 5;
    }
  });

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
  }, [hovered]);

  return (
    <group
      ref={parrotRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} scale={0.5} />
    </group>
  );
};

export const AnimatedCharacter = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40"
      style={{ mixBlendMode: "normal" }}
    >
      <div 
        className="absolute right-0 top-1/4 w-64 h-64 md:w-96 md:h-96 pointer-events-auto"
        style={{ transform: isMobile ? "scale(0.6)" : "scale(1)" }}
      >
        <Canvas
          gl={{ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />
          <ParrotModel />
        </Canvas>
      </div>
    </div>
  );
};

// Preload the model
useGLTF.preload("/Model/parrot.glb");

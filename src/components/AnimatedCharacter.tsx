"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Html } from "@react-three/drei"
import { Suspense, useRef, useEffect, useState } from "react"
import * as THREE from "three"

function BeeModel({ followCursor = false }: { followCursor?: boolean }) {
  const { scene, animations } = useGLTF("/Model/bee_rigged.glb")
  const beeRef = useRef<THREE.Group>(null)
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const leftWing = useRef<THREE.Object3D | null>(null)
  const rightWing = useRef<THREE.Object3D | null>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const { camera } = useThree()

  // 🖱️ Track cursor pixel position
  useEffect(() => {
    if (!followCursor) return
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [followCursor])

  // 🐝 Setup wings / animation
  useEffect(() => {
    if (animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene)
      const action = mixer.current.clipAction(animations[0])
      action.play()
    } else {
      scene.traverse((child) => {
        if (child.name.toLowerCase().includes("wing") && !leftWing.current) {
          leftWing.current = child
        } else if (
          child.name.toLowerCase().includes("wing") &&
          leftWing.current &&
          !rightWing.current
        ) {
          rightWing.current = child
        }
      })
    }
  }, [animations, scene])

  useFrame((state, delta) => {
    if (!beeRef.current) return
    const t = state.clock.getElapsedTime()

    // 🕊️ Gentle hover motion
    const waveY = Math.sin(t * 3) * 0.15

    // 🧭 Convert mouse pixel → world position
    const mouseVec = new THREE.Vector3(
      (cursor.x / window.innerWidth) * 2 - 1,
      -(cursor.y / window.innerHeight) * 2 + 1,
      0
    )
    mouseVec.unproject(camera) // Converts to world coordinates
    const dir = mouseVec.sub(camera.position).normalize()
    const distance = 3 // how far from camera (depth)
    const worldPos = camera.position.clone().add(dir.multiplyScalar(distance))

    // 🐝 Move bee toward target
    beeRef.current.position.x = THREE.MathUtils.lerp(
      beeRef.current.position.x,
      worldPos.x,
      0.08
    )
    beeRef.current.position.y = THREE.MathUtils.lerp(
      beeRef.current.position.y,
      worldPos.y + waveY,
      0.08
    )

    // 🧠 Rotate bee toward movement
    const tiltZ = THREE.MathUtils.lerp(
      beeRef.current.rotation.z,
      (worldPos.x - beeRef.current.position.x) * -0.3,
      0.1
    )
    beeRef.current.rotation.z = tiltZ
    beeRef.current.rotation.y = Math.sin(t * 2) * 0.2

    // 🪽 Wing flap
    if (mixer.current) {
      mixer.current.update(delta)
    } else {
      const flap = Math.sin(t * 20) * 0.6
      if (leftWing.current) leftWing.current.rotation.z = flap
      if (rightWing.current) rightWing.current.rotation.z = -flap
    }
  })

  return <primitive ref={beeRef} object={scene} scale={0.015} />
}

function BeeLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center text-center">
        <div className="h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-yellow-300">Loading Bee...</p>
      </div>
    </Html>
  )
}

export default function AnimatedCharacter({
  followCursor = false,
}: {
  followCursor?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ width: "100vw", height: "100vh", overflow: "visible" }}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ background: "transparent" }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={<BeeLoader />}>
          <BeeModel followCursor={followCursor} />
        </Suspense>
      </Canvas>
    </div>
  )
}

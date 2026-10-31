"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Html } from "@react-three/drei"
import { Suspense, useRef, useEffect, useLayoutEffect, useMemo, useState } from "react"
import * as THREE from "three"

const MODEL_URL = "/Model/bee_rigged.glb"
// Rendered size of the bee in world units (longest side).
const TARGET_SIZE = 0.5
// Camera used by the canvas (needed to convert screen px -> world units).
const CAMERA_Z = 4
const CAMERA_FOV = 50
// ms without scrolling before the bee counts as "stopped" and hovers in place.
const IDLE_MS = 450
// ms it keeps hovering in place after stopping, before it starts landing.
const HOVER_MS = 1000
// Px height of the fixed navbar; the bee never perches under it.
const NAV_HEIGHT = 72
// Zig-zag: one full left-right-left swing per this many scrolled px.
const ZIGZAG_PERIOD_PX = 900
// How far the bee swings, as a fraction of half the screen width.
const ZIGZAG_AMPLITUDE = 0.55
const FOLLOW_SPEED = 2.6
const LAND_SPEED = 1.8

/**
 * Where the bee may land: any text block inside a section (headings, paragraphs,
 * list items) plus any element tagged `data-bee-perch`. Elements tagged
 * `data-bee-box` are landed on by their box (buttons); everything else by its text.
 * The hero only offers its tagged button, and any text containing the owner's
 * first name is never a perch.
 */
const PERCH_SELECTOR =
  "[data-bee-perch], section h2, section h3, section h4, section p, section li"
const NEVER_PERCH_TEXT = /muhammad/i
// Text blocks narrower than this (px) are too small for the bee to sit on.
const MIN_PERCH_WIDTH = 120

// What the guide says when it settles in a section.
const GUIDE_LINES: Record<string, string> = {
  home: "Hi! I'm your guide. Click me!",
  about: "Meet the developer behind the work.",
  skills: "Here's the toolbox.",
  projects: "Products shipped to real users.",
  experience: "The journey so far.",
  contact: "Say hello, don't be shy!",
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

/** Bounding rect of the visible text of an element (not its full block width). */
function textRect(el: Element): DOMRect {
  const range = document.createRange()
  range.selectNodeContents(el)
  const r = range.getBoundingClientRect()
  return r.width && r.height ? r : el.getBoundingClientRect()
}

const perchRect = (el: Element): DOMRect =>
  el.hasAttribute("data-bee-box") ? el.getBoundingClientRect() : textRect(el)

/** Room above the perch for the bee, so it never ends up under the navbar. */
const isUsable = (r: DOMRect, beePx: number) =>
  r.top >= NAV_HEIGHT + beePx * 0.45 && r.bottom <= window.innerHeight - 24

/** True when the element (or a close ancestor) is still faded out by a reveal animation. */
function isFadedOut(el: Element): boolean {
  let node: Element | null = el
  for (let i = 0; i < 6 && node; i++, node = node.parentElement) {
    if (parseFloat(getComputedStyle(node).opacity) < 0.6) return true
  }
  return false
}

function canPerch(el: HTMLElement): boolean {
  if (el.hasAttribute("data-bee-perch")) return true
  if (el.closest("#home, nav, button, form, a, [aria-hidden='true']")) return false
  return !NEVER_PERCH_TEXT.test(el.textContent ?? "")
}

/** The text block nearest to where the bee currently is (screen px). */
function pickPerch(
  beeX: number,
  beeY: number,
  beePx: number
): { el: HTMLElement; frac: number } | null {
  let best: { el: HTMLElement; frac: number } | null = null
  let bestDist = Infinity
  document.querySelectorAll<HTMLElement>(PERCH_SELECTOR).forEach((el) => {
    if (!canPerch(el)) return
    const r = perchRect(el)
    if (r.width < MIN_PERCH_WIDTH || !r.height || !isUsable(r, beePx)) return
    const onBox = el.hasAttribute("data-bee-box")
    // Sit as close to the bee's current x as the text allows.
    const margin = Math.min(beePx * 0.4, r.width / 2)
    const x = onBox ? r.left + r.width / 2 : Math.min(Math.max(beeX, r.left + margin), r.right - margin)
    const dist = Math.hypot(x - beeX, r.top - beeY)
    if (dist < bestDist && !isFadedOut(el)) {
      bestDist = dist
      best = { el, frac: (x - r.left) / r.width }
    }
  })
  return best
}

type FoldTarget = { bone: THREE.Object3D; quat: THREE.Quaternion }

// Folded-wing poses, computed once from the bind pose (before any animation runs).
const foldCache = new WeakMap<THREE.Object3D, FoldTarget[]>()

/**
 * For each wing root bone, build the local rotation that swings the wing back
 * along the abdomen (slightly raised and apart), like a resting bee.
 * Done in the model's own frame, so it does not depend on its orientation.
 */
function computeWingFold(scene: THREE.Object3D): FoldTarget[] {
  const cached = foldCache.get(scene)
  if (cached) return cached

  scene.updateMatrixWorld(true)
  const find = (re: RegExp) => {
    let found: THREE.Object3D | undefined
    scene.traverse((o) => {
      if (!found && re.test(o.name)) found = o
    })
    return found
  }
  const pos = (o: THREE.Object3D) => scene.worldToLocal(o.getWorldPosition(new THREE.Vector3()))

  const thorax = find(/^thorax_jnt/)
  const abdomenEnd = find(/^abdomen_jnt04/)
  const sides = (["r", "l"] as const).map((k) => ({
    k,
    root: find(new RegExp(`^${k}_wingroot`)),
    end: find(new RegExp(`^${k}_wing_endjnt`)),
  }))
  if (!thorax || !abdomenEnd || sides.some((x) => !x.root || !x.end)) {
    foldCache.set(scene, [])
    return []
  }

  const back = pos(abdomenEnd).sub(pos(thorax)).normalize()
  const rRoot = pos(sides[0].root!)
  const lRoot = pos(sides[1].root!)
  const lateral = lRoot.clone().sub(rRoot).normalize() // right -> left
  const up = new THREE.Vector3().crossVectors(lateral, back).normalize()
  // Make sure "up" points from the wing roots toward the wing tips (dorsal side).
  const tipMid = pos(sides[0].end!).add(pos(sides[1].end!)).multiplyScalar(0.5)
  const rootMid = rRoot.clone().add(lRoot).multiplyScalar(0.5)
  if (up.dot(tipMid.sub(rootMid)) < 0) up.negate()

  const sQinv = scene.getWorldQuaternion(new THREE.Quaternion()).invert()

  const targets: FoldTarget[] = sides.map(({ k, root, end }) => {
    const outward = lateral.clone().multiplyScalar(k === "r" ? -1 : 1)
    const current = pos(end!).sub(pos(root!)).normalize()
    const wanted = back
      .clone()
      .addScaledVector(up, 0.12)
      .addScaledVector(outward, 0.12)
      .normalize()
    const swing = new THREE.Quaternion().setFromUnitVectors(current, wanted)
    const rootInScene = sQinv.clone().multiply(root!.getWorldQuaternion(new THREE.Quaternion()))
    const parentInScene = sQinv.clone().multiply(root!.parent!.getWorldQuaternion(new THREE.Quaternion()))
    const quat = parentInScene.invert().multiply(swing.multiply(rootInScene))
    return { bone: root!, quat }
  })
  foldCache.set(scene, targets)
  return targets
}

// Size/centering of the model, measured once from the untouched bind pose.
// (useGLTF caches the scene, so re-mounting must not re-measure a scaled/posed model.)
const fitCache = new WeakMap<THREE.Object3D, { scale: number; offset: THREE.Vector3 }>()

function computeFit(scene: THREE.Object3D) {
  const cached = fitCache.get(scene)
  if (cached) return cached
  scene.scale.set(1, 1, 1)
  scene.position.set(0, 0, 0)
  scene.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(scene, true)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const scale = TARGET_SIZE / maxDim
  const fit = { scale, offset: center.multiplyScalar(-scale) }
  fitCache.set(scene, fit)
  return fit
}

// Click tricks, cycled in order.
type Trick = "buzz" | "loop" | "waggle"
const TRICKS: Trick[] = ["loop", "buzz", "waggle"]
const TRICK_SECONDS: Record<Trick, number> = { buzz: 1.4, loop: 2.0, waggle: 2.2 }

const SPARKLES = 32
const SPARKLE_LIFE = 1.0

function BeeModel() {
  const { scene, animations } = useGLTF(MODEL_URL)
  const group = useRef<THREE.Group>(null)
  const action = useRef<THREE.AnimationAction | null>(null)
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const reduced = useRef(prefersReducedMotion())
  const { camera } = useThree()

  // Guide speech bubble (React state, changed only when the section changes).
  const [line, setLine] = useState("")
  const [showLine, setShowLine] = useState(false)
  // Bubble goes beside the bee (toward the emptier half of the screen), or above on phones.
  const [bubbleSide, setBubbleSide] = useState<"top" | "left" | "right">("top")

  // Scroll / flight state kept in refs so scrolling never re-renders React.
  const state = useRef({
    lastScroll: 0,
    lastY: typeof window !== "undefined" ? window.scrollY : 0,
    dir: 1, // 1 = scrolling down, -1 = up
    leadY: -0.3, // smoothed vertical lead (NDC)
    rest: 0, // 0 = flying, 1 = wings fully folded
    bob: 0, // breathing offset currently added to the group (kept out of velocity)
    perch: null as HTMLElement | null,
    perchFrac: 0.5, // where along the perch the bee sits (0..1)
    landedEl: null as HTMLElement | null,
    hold: null as { x: number; y: number } | null,
    settled: false,
    trick: null as { type: Trick; start: number; x: number; y: number } | null,
    trickIndex: 0,
    sparkleAge: SPARKLE_LIFE,
    started: false,
  })

  const tmp = useMemo(
    () => ({ ray: new THREE.Vector3(), world: new THREE.Vector3(), proj: new THREE.Vector3() }),
    []
  )

  // Sparkle burst (pollen) emitted on click.
  const sparkles = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SPARKLES * 3), 3))
    const mat = new THREE.PointsMaterial({
      color: "#facc15",
      size: 0.06,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false
    points.visible = false
    const vel = new Float32Array(SPARKLES * 3)
    return { points, geo, mat, vel }
  }, [])

  // Fit + centre the model so size/position don't depend on the file's raw units.
  const fit = useMemo(() => computeFit(scene), [scene])

  // Folded wing poses (computed from the bind pose, before the mixer touches bones).
  const wingFold = useMemo(() => computeWingFold(scene), [scene])

  // Skinned meshes have a bind-pose bounding sphere far from where they are
  // animated, so frustum culling can make the bee vanish. Disable it.
  useLayoutEffect(() => {
    scene.traverse((child) => {
      child.frustumCulled = false
    })
  }, [scene])

  // Scroll tracking.
  useEffect(() => {
    const s = state.current
    const onScroll = () => {
      const y = window.scrollY
      if (y !== s.lastY) s.dir = y > s.lastY ? 1 : -1
      s.lastY = y
      s.lastScroll = performance.now()
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      s.landedEl?.removeAttribute("data-bee-landed")
    }
  }, [])

  // Baked hover/flap animation.
  useEffect(() => {
    if (!animations.length) return
    const m = new THREE.AnimationMixer(scene)
    const a = m.clipAction(animations[0])
    a.setLoop(THREE.LoopRepeat, Infinity)
    a.play()
    mixer.current = m
    action.current = a
    return () => {
      m.stopAllAction()
      m.uncacheRoot(scene)
      mixer.current = null
      action.current = null
    }
  }, [animations, scene])

  const worldHeight = () =>
    2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2))

  /** Screen px -> point on the z = 0 world plane. */
  const ndcToWorld = (nx: number, ny: number, out: THREE.Vector3) => {
    tmp.ray.set(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize()
    const dist = -camera.position.z / tmp.ray.z
    return out.copy(camera.position).addScaledVector(tmp.ray, dist)
  }
  const screenToWorld = (px: number, py: number, out: THREE.Vector3) =>
    ndcToWorld((px / window.innerWidth) * 2 - 1, -(py / window.innerHeight) * 2 + 1, out)

  const spawnSparkles = (x: number, y: number) => {
    const attr = sparkles.geo.getAttribute("position") as THREE.BufferAttribute
    for (let i = 0; i < SPARKLES; i++) {
      attr.setXYZ(i, x, y, 0.1)
      const a = Math.random() * Math.PI * 2
      const sp = 0.5 + Math.random() * 1.1
      sparkles.vel[i * 3] = Math.cos(a) * sp
      sparkles.vel[i * 3 + 1] = Math.sin(a) * sp + 0.4
      sparkles.vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4
    }
    attr.needsUpdate = true
    state.current.sparkleAge = 0
    sparkles.points.visible = true
  }

  // Click the bee (only while it is resting) to make it do a trick.
  useEffect(() => {
    const s = state.current
    const onClick = (e: MouseEvent) => {
      const g = group.current
      if (!g || !s.settled || s.trick) return
      tmp.proj.copy(g.position).project(camera)
      const sx = ((tmp.proj.x + 1) / 2) * window.innerWidth
      const sy = ((1 - tmp.proj.y) / 2) * window.innerHeight
      const beePx = (TARGET_SIZE / worldHeight()) * window.innerHeight
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > beePx * 0.65) return
      // The bee sits on top of buttons/links: don't let the click fall through.
      e.preventDefault()
      e.stopPropagation()
      const type = TRICKS[s.trickIndex++ % TRICKS.length]
      s.trick = { type, start: performance.now(), x: g.position.x, y: g.position.y }
      spawnSparkles(g.position.x, g.position.y)
    }
    window.addEventListener("click", onClick, true)
    return () => window.removeEventListener("click", onClick, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera])

  useFrame((frame, rawDelta) => {
    const g = group.current
    if (!g) return
    const s = state.current
    const delta = Math.min(rawDelta, 0.05)
    const t = frame.clock.elapsedTime
    const now = performance.now()
    const isMobile = window.innerWidth < 640
    const clamp = THREE.MathUtils.clamp
    const damp = THREE.MathUtils.damp

    const beePx = (TARGET_SIZE / worldHeight()) * window.innerHeight

    // First frame: start off-screen top-right and fly in.
    if (!s.started) {
      s.started = true
      ndcToWorld(1.4, 0.9, tmp.world)
      g.position.copy(tmp.world)
    }

    g.position.y -= s.bob // remove last frame's breathing offset before measuring motion
    s.bob = 0

    const sinceScroll = now - s.lastScroll
    const idle = sinceScroll > IDLE_MS
    const landing = sinceScroll > IDLE_MS + HOVER_MS
    let perching = false
    let holding = false
    let targetX: number
    let targetY: number

    if (landing) {
      // Land on the nearest perch (re-pick if it left the screen).
      if (s.perch && !isUsable(perchRect(s.perch), beePx)) s.perch = null
      if (!s.perch) {
        // Look for text near where the bee is right now.
        tmp.proj.copy(g.position).project(camera)
        const bx = ((tmp.proj.x + 1) / 2) * window.innerWidth
        const by = ((1 - tmp.proj.y) / 2) * window.innerHeight
        const found = pickPerch(bx, by, beePx)
        s.perch = found?.el ?? null
        if (found) s.perchFrac = found.frac
      }
    } else {
      s.perch = null // take off as soon as scrolling resumes
    }
    if (idle && !landing) {
      holding = true
      if (!s.hold) s.hold = { x: g.position.x, y: g.position.y }
    } else {
      s.hold = null
    }

    const phase = (s.lastY / ZIGZAG_PERIOD_PX) * Math.PI * 2
    const amp = reduced.current ? 0.1 : ZIGZAG_AMPLITUDE * (isMobile ? 0.7 : 1)

    if (s.perch) {
      perching = true
      const r = perchRect(s.perch)
      const px = clamp(r.left + r.width * s.perchFrac, 40, window.innerWidth - 40)
      const py = r.top - beePx * 0.1
      screenToWorld(px, py, tmp.world)
      targetX = tmp.world.x
      targetY = tmp.world.y
    } else if (holding && s.hold) {
      targetX = s.hold.x
      targetY = s.hold.y + (reduced.current ? 0 : Math.sin(t * 3) * 0.03)
    } else {
      // Zig-zag tied to scroll distance, leading ahead of the scroll direction.
      const leadTarget = s.dir === 1 ? -0.3 : 0.3
      s.leadY = damp(s.leadY, leadTarget, 2, delta)
      const nx = Math.sin(phase) * amp
      const ny = s.leadY + Math.sin(phase * 2) * 0.12 + Math.sin(t * 2.2) * 0.02
      ndcToWorld(nx, ny, tmp.world)
      targetX = tmp.world.x
      targetY = tmp.world.y
    }

    // --- Click tricks: override motion for a short moment --------------------
    let trickRoll: number | null = null
    let flapSpeed = perching ? 0.5 : holding ? 0.8 : reduced.current ? 0.5 : 1.0
    let followSpeed = perching ? LAND_SPEED : holding ? 6 : FOLLOW_SPEED
    const trick = s.trick
    if (trick) {
      const dur = TRICK_SECONDS[trick.type]
      const e = (now - trick.start) / 1000
      if (e >= dur) {
        s.trick = null
        g.rotation.z = 0 // a full loop is the same angle as none
      } else {
        const k = e / dur
        followSpeed = 14
        if (trick.type === "buzz") {
          flapSpeed = 3
          targetX = trick.x + Math.sin(e * 70) * 0.012
          targetY = trick.y + Math.sin(k * Math.PI) * 0.14
        } else if (trick.type === "loop") {
          flapSpeed = 1.6
          const eased = k * k * (3 - 2 * k)
          const theta = eased * Math.PI * 2
          const R = 0.38
          targetX = trick.x + R * Math.sin(theta)
          targetY = trick.y + R * (1 - Math.cos(theta))
          trickRoll = -theta
        } else {
          flapSpeed = 1.6
          targetX = trick.x + Math.sin(e * 14) * 0.05
          targetY = trick.y + Math.abs(Math.sin(e * 7)) * 0.05
          trickRoll = Math.sin(e * 14) * 0.4
        }
      }
    }

    const prevX = g.position.x
    const prevY = g.position.y
    g.position.x = damp(prevX, targetX, followSpeed, delta)
    g.position.y = damp(prevY, targetY, followSpeed, delta)

    const vx = delta > 0 ? (g.position.x - prevX) / delta : 0
    const vy = delta > 0 ? (g.position.y - prevY) / delta : 0
    const settled = perching && !s.trick && Math.abs(vx) + Math.abs(vy) < 0.08
    s.settled = settled

    if (trickRoll !== null) {
      g.rotation.z = damp(g.rotation.z, trickRoll, 20, delta)
      g.rotation.y = damp(g.rotation.y, 0, 6, delta)
      g.rotation.x = damp(g.rotation.x, 0, 6, delta)
    } else if (settled) {
      // Sitting: calm pose, tiny breathing.
      g.rotation.z = damp(g.rotation.z, 0.08, 6, delta)
      g.rotation.y = damp(g.rotation.y, 0, 6, delta)
      g.rotation.x = damp(g.rotation.x, 0.15, 6, delta)
      s.bob = reduced.current ? 0 : Math.sin(t * 1.5) * 0.006
      g.position.y += s.bob
    } else {
      // Banking / yaw / pitch from actual velocity.
      g.rotation.z = damp(g.rotation.z, clamp(-vx * 0.25, -0.5, 0.5), 8, delta)
      g.rotation.y = damp(g.rotation.y, clamp(vx * 0.3, -0.6, 0.6), 6, delta)
      g.rotation.x = damp(g.rotation.x, clamp(-vy * 0.15, -0.3, 0.3), 8, delta)
    }

    // --- Landing feedback on the page + guide speech bubble ------------------
    const landedOn = settled ? s.perch : null
    if (landedOn !== s.landedEl) {
      s.landedEl?.removeAttribute("data-bee-landed")
      landedOn?.setAttribute("data-bee-landed", "true")
      s.landedEl = landedOn
    }
    const sectionId = landedOn?.closest("section")?.id ?? ""
    const wantLine = landedOn && !s.trick ? GUIDE_LINES[sectionId] ?? "" : ""
    if (wantLine && wantLine !== line) setLine(wantLine)
    if (!!wantLine !== showLine) setShowLine(!!wantLine)
    if (landedOn) {
      tmp.proj.copy(g.position).project(camera)
      const beeX = ((tmp.proj.x + 1) / 2) * window.innerWidth
      const side =
        window.innerWidth < 640 ? "top" : beeX < window.innerWidth / 2 ? "right" : "left"
      if (side !== bubbleSide) setBubbleSide(side)
    }

    // --- Wings: flap while flying/landing; fold against the body when seated -
    s.rest = damp(s.rest, settled ? 1 : 0, settled ? 3 : 8, delta)
    if (action.current) {
      action.current.timeScale = flapSpeed
      // Weight < 1 blends the animation back toward the bind pose.
      action.current.setEffectiveWeight(1 - s.rest)
    }
    if (s.rest < 0.999) mixer.current?.update(delta)
    if (s.rest > 0.001) {
      for (const { bone, quat } of wingFold) bone.quaternion.slerp(quat, s.rest)
    }

    // --- Pollen sparkles -------------------------------------------------------
    if (s.sparkleAge < SPARKLE_LIFE) {
      s.sparkleAge += delta
      const attr = sparkles.geo.getAttribute("position") as THREE.BufferAttribute
      for (let i = 0; i < SPARKLES; i++) {
        sparkles.vel[i * 3 + 1] -= 1.4 * delta
        attr.setXYZ(
          i,
          attr.getX(i) + sparkles.vel[i * 3] * delta,
          attr.getY(i) + sparkles.vel[i * 3 + 1] * delta,
          attr.getZ(i) + sparkles.vel[i * 3 + 2] * delta
        )
      }
      attr.needsUpdate = true
      sparkles.mat.opacity = clamp(1 - s.sparkleAge / SPARKLE_LIFE, 0, 1)
      if (s.sparkleAge >= SPARKLE_LIFE) sparkles.points.visible = false
    }
  })

  return (
    <>
      <group ref={group}>
        <primitive object={scene} scale={fit.scale} position={fit.offset} />
        <Html pointerEvents="none" zIndexRange={[60, 50]}>
          <div
            role="status"
            aria-live="polite"
            style={{
              transform:
                bubbleSide === "right"
                  ? "translate(54px, -50%)"
                  : bubbleSide === "left"
                    ? "translate(calc(-100% - 54px), -50%)"
                    : "translate(-85%, calc(-100% - 52px))",
            }}
            className={`w-max max-w-[14rem] rounded-xl border border-border bg-card/95 px-3 py-2 text-xs sm:text-sm text-foreground shadow-lg backdrop-blur transition-all duration-300 ${
              showLine ? "opacity-100" : "opacity-0 translate-y-1"
            }`}
          >
            {line}
          </div>
        </Html>
      </group>
      <primitive object={sparkles.points} />
    </>
  )
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

export default function AnimatedCharacter() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ width: "100vw", height: "100vh", overflow: "visible" }}
    >
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        // r3f sets pointer-events:auto on its root; the bee must never block page clicks.
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={<BeeLoader />}>
          <BeeModel />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_URL)

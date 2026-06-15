import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Center, Environment, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Loader2, RotateCcw, ZoomIn } from 'lucide-react'

// Procedural food item display (until GLTF models are uploaded)
const FoodDisplay = ({ color = '#B89052', shape = 'sphere' }: { color?: string; shape?: string }) => {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.4
  })

  const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.35, metalness: 0.08, envMapIntensity: 1.5 })

  return (
    <Center>
      <mesh ref={ref} material={mat} castShadow>
        {shape === 'sphere' ? <sphereGeometry args={[1.2, 32, 32]} /> : <cylinderGeometry args={[1, 0.8, 0.6, 48]} />}
      </mesh>
    </Center>
  )
}

interface Props { modelUrl?: string; color?: string; shape?: string; className?: string }

export const ProductViewer3D = ({ modelUrl: _modelUrl, color = '#B89052', shape = 'sphere', className }: Props) => {
  const [autoRotate, setAutoRotate] = useState(true)
  const controlsRef = useRef<any>(null)

  const reset = () => { controlsRef.current?.reset() }

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-canvas-2 ${className}`}>
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 42 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} color="#FFF8F0" />
        <directionalLight position={[5, 8, 5]} intensity={1.3} color="#D4AF6E" castShadow />
        <pointLight position={[-3, 3, -3]} intensity={0.4} color="#B89052" />
        <Environment preset="sunset" background={false} blur={0.9} />
        <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={8} blur={2} />

        <Suspense fallback={
          <Html center>
            <div className="flex items-center gap-2 text-ink-3 text-sm font-sans">
              <Loader2 size={16} className="animate-spin text-gold" />
              Loading
            </div>
          </Html>
        }>
          <FoodDisplay color={color} shape={shape} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          autoRotate={autoRotate}
          autoRotateSpeed={1.8}
          enablePan={false}
          minDistance={2.5}
          maxDistance={9}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.6}
        />
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button onClick={() => setAutoRotate(v => !v)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all shadow-warm-sm ${autoRotate ? 'bg-gold text-espresso' : 'bg-cream/80 text-ink-2 backdrop-blur-sm'}`}
          title={autoRotate ? 'Pause rotation' : 'Auto rotate'}>
          <RotateCcw size={13} />
        </button>
        <button onClick={reset}
          className="w-8 h-8 rounded-full bg-cream/80 backdrop-blur-sm text-ink-2 flex items-center justify-center shadow-warm-sm hover:bg-cream transition-all"
          title="Reset view">
          <ZoomIn size={13} />
        </button>
      </div>

      <div className="absolute bottom-3 left-3">
        <span className="font-display text-[10px] text-ink-3/60 bg-cream/60 backdrop-blur-sm px-2 py-1 rounded-full">Drag to rotate</span>
      </div>
    </div>
  )
}

export default ProductViewer3D

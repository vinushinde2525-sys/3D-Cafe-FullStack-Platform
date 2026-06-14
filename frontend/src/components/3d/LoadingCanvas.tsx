import { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const SpinningCup = () => {
  const ref = useRef<THREE.Group>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    t.current += delta
    ref.current.rotation.y = t.current * 1.5
    ref.current.position.y = Math.sin(t.current * 2) * 0.08
  })

  return (
    <group ref={ref}>
      {/* Simplified cup for loading */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.36, 1.0, 32, 1, true]} />
        <meshStandardMaterial color="#FFF8F0" roughness={0.2} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.51, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.02, 32]} />
        <meshStandardMaterial color="#FFF8F0" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
        <meshStandardMaterial color="#3A2415" roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Gold ring */}
      <mesh position={[0, 0.51, 0]}>
        <torusGeometry args={[0.5, 0.01, 8, 48]} />
        <meshStandardMaterial color="#B89052" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

export const LoadingCanvas = () => (
  <div className="w-24 h-24 mx-auto">
    <Canvas camera={{ position: [0, 0.5, 3.5], fov: 40 }} dpr={1} gl={{ antialias: false, alpha: true }}>
      <ambientLight intensity={0.8} color="#FFF8F0" />
      <directionalLight position={[3, 5, 3]} intensity={1.2} color="#D4AF6E" />
      <Suspense fallback={null}>
        <SpinningCup />
      </Suspense>
    </Canvas>
  </div>
)

export default LoadingCanvas

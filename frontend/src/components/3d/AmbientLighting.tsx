import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

export const AmbientLighting = () => {
  const dirRef = useRef<THREE.DirectionalLight>(null)

  useFrame(({ clock }) => {
    if (dirRef.current) {
      dirRef.current.intensity = 1.2 + Math.sin(clock.elapsedTime * 0.5) * 0.15
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} color="#FFF8F0" />
      <directionalLight
        ref={dirRef}
        position={[5, 8, 5]}
        intensity={1.4}
        color="#D4AF6E"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.001}
      />
      <pointLight position={[-4, 3, -4]} intensity={0.5} color="#B89052" />
      <pointLight position={[4, -2, 4]}  intensity={0.3} color="#FFF8F0" />
      <hemisphereLight args={['#FFF8F0', '#3A2415', 0.4]} />
    </>
  )
}

export default AmbientLighting

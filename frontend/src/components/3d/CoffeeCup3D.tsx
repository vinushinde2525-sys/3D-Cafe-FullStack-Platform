import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Cylinder, Torus } from '@react-three/drei'
import * as THREE from 'three'

interface Props { mouseX?: number; mouseY?: number }

export const CoffeeCup3D = ({ mouseX = 0, mouseY = 0 }: Props) => {
  const groupRef  = useRef<THREE.Group>(null)
  const coffeeRef = useRef<THREE.Mesh>(null)
  const foamRef   = useRef<THREE.Mesh>(null)

  const ceramicMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FFF8F0'),
    roughness: 0.2,
    metalness: 0.05,
    envMapIntensity: 1.2,
  }), [])

  const saucerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#EFE7DA'),
    roughness: 0.25,
    metalness: 0.03,
  }), [])

  const coffeeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#3A2415'),
    roughness: 0.05,
    metalness: 0.1,
    envMapIntensity: 2,
  }), [])

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#B89052'),
    roughness: 0.15,
    metalness: 0.9,
    envMapIntensity: 2.5,
  }), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime

    // Gentle floating
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.12
    // Mouse parallax tilt
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY * 0.18, 0.06)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.22 + t * 0.12, 0.06)

    // Coffee surface shimmer
    if (coffeeRef.current) coffeeRef.current.rotation.y = t * 0.4
    // Foam breathe
    if (foamRef.current) {
      foamRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.008)
      foamRef.current.position.y = 0.72 + Math.sin(t * 0.9) * 0.005
    }
  })

  return (
    <group ref={groupRef} castShadow receiveShadow>
      {/* Saucer */}
      <mesh material={saucerMat} position={[0, -0.82, 0]} receiveShadow>
        <cylinderGeometry args={[1.05, 0.95, 0.08, 48]} />
      </mesh>
      <mesh material={saucerMat} position={[0, -0.76, 0]}>
        <cylinderGeometry args={[0.55, 0.5, 0.06, 48]} />
      </mesh>

      {/* Cup body */}
      <mesh material={ceramicMat} position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.52, 1.5, 64, 1, true]} />
      </mesh>
      {/* Cup bottom */}
      <mesh material={ceramicMat} position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.02, 48]} />
      </mesh>
      {/* Cup rim */}
      <mesh material={ceramicMat} position={[0, 0.75, 0]}>
        <torusGeometry args={[0.72, 0.04, 16, 64]} />
      </mesh>

      {/* Handle */}
      <mesh material={ceramicMat} position={[0.88, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.32, 0.07, 14, 40, Math.PI * 1.2]} />
      </mesh>

      {/* Coffee liquid */}
      <mesh ref={coffeeRef} material={coffeeMat} position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.04, 48]} />
      </mesh>

      {/* Foam art (latte art circle) */}
      <mesh ref={foamRef} material={new THREE.MeshStandardMaterial({ color: '#D4AF6E', roughness: 0.9, transparent: true, opacity: 0.9 })} position={[0, 0.73, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.02, 48]} />
      </mesh>

      {/* Gold rim accent line */}
      <mesh material={goldMat} position={[0, 0.76, 0]}>
        <torusGeometry args={[0.72, 0.012, 8, 64]} />
      </mesh>

      {/* Gold base line */}
      <mesh material={goldMat} position={[0, -0.73, 0]}>
        <torusGeometry args={[0.52, 0.01, 8, 48]} />
      </mesh>
    </group>
  )
}

export default CoffeeCup3D

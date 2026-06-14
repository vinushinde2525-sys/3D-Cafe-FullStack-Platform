import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const BEAN_COUNT = 12

interface BeanData { pos: THREE.Vector3; rot: THREE.Euler; speed: number; radius: number; phase: number; rotSpeed: THREE.Vector3 }

export const FloatingBeans = () => {
  const groupRef = useRef<THREE.Group>(null)

  const beans = useMemo<BeanData[]>(() =>
    Array.from({ length: BEAN_COUNT }, (_, i) => ({
      pos: new THREE.Vector3(
        Math.cos((i / BEAN_COUNT) * Math.PI * 2) * (2.2 + Math.random() * 1.2),
        (Math.random() - 0.5) * 2.5,
        Math.sin((i / BEAN_COUNT) * Math.PI * 2) * (2.2 + Math.random() * 1.2)
      ),
      rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      speed: 0.18 + Math.random() * 0.22,
      radius: 2.2 + Math.random() * 1.2,
      phase: (i / BEAN_COUNT) * Math.PI * 2,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 0.6
      ),
    }))
  , [])

  const beanRefs = useRef<(THREE.Mesh | null)[]>([])

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#5C3D26'),
    roughness: 0.35,
    metalness: 0.08,
    envMapIntensity: 0.8,
  }), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    beans.forEach((bean, i) => {
      const mesh = beanRefs.current[i]
      if (!mesh) return
      const angle = t * bean.speed + bean.phase
      mesh.position.set(
        Math.cos(angle) * bean.radius,
        bean.pos.y + Math.sin(t * 0.7 + bean.phase) * 0.4,
        Math.sin(angle) * bean.radius
      )
      mesh.rotation.x += bean.rotSpeed.x * 0.01
      mesh.rotation.y += bean.rotSpeed.y * 0.01
      mesh.rotation.z += bean.rotSpeed.z * 0.01
    })
  })

  return (
    <group ref={groupRef}>
      {beans.map((bean, i) => (
        <RoundedBox
          key={i}
          ref={(el) => { beanRefs.current[i] = el }}
          args={[0.22, 0.14, 0.1]}
          radius={0.05}
          smoothness={4}
          position={[bean.pos.x, bean.pos.y, bean.pos.z]}
          rotation={[bean.rot.x, bean.rot.y, bean.rot.z]}
          material={mat}
          castShadow
        >
          {/* Bean crease */}
          <mesh position={[0, 0, 0.051]}>
            <planeGeometry args={[0.04, 0.12]} />
            <meshStandardMaterial color="#3A2415" roughness={0.9} />
          </mesh>
        </RoundedBox>
      ))}
    </group>
  )
}

export default FloatingBeans

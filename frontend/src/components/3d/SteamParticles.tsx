import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { count?: number; position?: [number, number, number]; spread?: number }

export const SteamParticles = ({ count = 40, position = [0, 0, 0], spread = 0.18 }: Props) => {
  const meshRef = useRef<THREE.Points>(null)

  const [positions, velocities, lifetimes, initialLifetimes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const life = new Float32Array(count)
    const initLife = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3]     = (Math.random() - 0.5) * spread
      pos[i3 + 1] = Math.random() * 1.2
      pos[i3 + 2] = (Math.random() - 0.5) * spread

      vel[i3]     = (Math.random() - 0.5) * 0.004
      vel[i3 + 1] = 0.006 + Math.random() * 0.008
      vel[i3 + 2] = (Math.random() - 0.5) * 0.004

      const l = Math.random() * 2.5
      life[i]     = l
      initLife[i] = l
    }
    return [pos, vel, life, initLife]
  }, [count, spread])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    return g
  }, [positions])

  const mat = useMemo(() => new THREE.PointsMaterial({
    size: 0.06,
    color: new THREE.Color('#EFE7DA'),
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  }), [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const posArr = meshRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      lifetimes[i] -= delta

      if (lifetimes[i] <= 0) {
        posArr[i3]     = (Math.random() - 0.5) * spread
        posArr[i3 + 1] = 0
        posArr[i3 + 2] = (Math.random() - 0.5) * spread
        lifetimes[i]   = initialLifetimes[i]
      } else {
        posArr[i3]     += vel[i3]     + Math.sin(lifetimes[i] * 3) * 0.002
        posArr[i3 + 1] += vel[i3 + 1]
        posArr[i3 + 2] += vel[i3 + 2]
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
    mat.opacity = 0.3 + Math.sin(Date.now() * 0.001) * 0.15
  })

  return (
    <group position={position}>
      <points ref={meshRef} geometry={geo} material={mat} />
    </group>
  )
}

export default SteamParticles

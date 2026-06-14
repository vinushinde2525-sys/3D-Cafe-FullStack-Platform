import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { mouseX?: number; mouseY?: number; enableDrift?: boolean }

export const SceneControls = ({ mouseX = 0, mouseY = 0, enableDrift = true }: Props) => {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 0, 6))

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    if (enableDrift) {
      // Gentle camera drift
      targetPos.current.set(
        mouseX * 0.6 + Math.sin(t * 0.12) * 0.15,
        mouseY * 0.4 + Math.cos(t * 0.1) * 0.1,
        6
      )
    } else {
      targetPos.current.set(mouseX * 0.4, mouseY * 0.25, 6)
    }

    camera.position.lerp(targetPos.current, 0.03)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default SceneControls

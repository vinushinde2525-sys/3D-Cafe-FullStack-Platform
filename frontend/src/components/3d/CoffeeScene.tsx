import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import { CoffeeCup3D } from './CoffeeCup3D'
import { FloatingBeans } from './FloatingBeans'
import { SteamParticles } from './SteamParticles'
import { AmbientLighting } from './AmbientLighting'
import { EnvironmentMap } from './EnvironmentMap'
import { SceneControls } from './SceneControls'

interface Props { mouseX?: number; mouseY?: number; className?: string; minimal?: boolean }

const SceneFallback = () => (
  <mesh>
    <sphereGeometry args={[0.5, 8, 8]} />
    <meshBasicMaterial color="#B89052" wireframe />
  </mesh>
)

export const CoffeeScene = ({ mouseX = 0, mouseY = 0, className, minimal = false }: Props) => (
  <Canvas
    className={className}
    camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
    shadows
    dpr={[1, 2]}
    gl={{
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      toneMapping: 3, // ACESFilmic
      toneMappingExposure: 1.1,
    }}
    style={{ background: 'transparent' }}
  >
    <AdaptiveDpr pixelated />
    <AdaptiveEvents />

    <Suspense fallback={<SceneFallback />}>
      <AmbientLighting />
      <EnvironmentMap preset="sunset" shadows={!minimal} />
      <CoffeeCup3D mouseX={mouseX} mouseY={mouseY} />
      {!minimal && <FloatingBeans />}
      <SteamParticles position={[0, 0.9, 0]} count={minimal ? 20 : 40} />
      <SceneControls mouseX={mouseX} mouseY={mouseY} />
      <Preload all />
    </Suspense>
  </Canvas>
)

export default CoffeeScene

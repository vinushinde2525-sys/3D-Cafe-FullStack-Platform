import { Environment, ContactShadows } from '@react-three/drei'

interface Props { preset?: 'sunset' | 'dawn' | 'warehouse'; shadows?: boolean }

export const EnvironmentMap = ({ preset = 'sunset', shadows = true }: Props) => (
  <>
    <Environment preset={preset} background={false} blur={0.8} />
    {shadows && (
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.45}
        scale={12}
        blur={2.5}
        far={4}
        color="#3A2415"
      />
    )}
    {/* Soft fog */}
    <fog attach="fog" args={['#F8F4ED', 18, 40]} />
  </>
)

export default EnvironmentMap

'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, ContactShadows } from '@react-three/drei';

export default function BottleViewer({ color }: { color: string }) {
  return <Canvas camera={{ position: [2.6, 1.8, 3.7], fov: 36 }} dpr={[1, 1.5]} style={{ width: '100%', height: '100%', touchAction: 'none' }}>
    <ambientLight intensity={1.7} /><directionalLight position={[3, 5, 4]} intensity={2.8} /><directionalLight position={[-4, 2, -2]} intensity={1.4} />
    <group position={[0, -0.1, 0]}>
      <RoundedBox args={[1.05, 1.42, 0.55]} radius={0.08} smoothness={4} position={[0, .8, 0]}>
        <meshPhysicalMaterial color={color} metalness={0.12} roughness={0.18} transparent opacity={0.87} clearcoat={1} clearcoatRoughness={0.08} />
      </RoundedBox>
      <mesh position={[0,1.56,0]}><cylinderGeometry args={[.19,.19,.13,32]} /><meshStandardMaterial color="#a68c5f" metalness={.8} roughness={.25} /></mesh>
      <RoundedBox args={[.5,.33,.37]} radius={.025} position={[0,1.76,0]}><meshStandardMaterial color="#b39b6a" metalness={.8} roughness={.28}/></RoundedBox>
      <mesh position={[0,.8,.281]}><planeGeometry args={[.65,.42]} /><meshStandardMaterial color="#f6edda" roughness={.75}/></mesh>
    </group>
    <ContactShadows position={[0, -.05, 0]} opacity={.3} scale={5} blur={2.8} far={3}/>
    <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={.4} maxPolarAngle={Math.PI / 2 + .3} autoRotate autoRotateSpeed={1.4}/>
  </Canvas>;
}

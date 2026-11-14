'use client';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Bottle({color,label}:{color:string;label:string}) {
  const texture=useTexture(label);
  texture.colorSpace=THREE.SRGBColorSpace;
  return <group position={[0, -.1, 0]}>
    <RoundedBox args={[1.05,1.42,.55]} radius={.08} smoothness={4} position={[0,.8,0]}>
      <meshPhysicalMaterial color={color} metalness={.06} roughness={.15} transparent opacity={.86} clearcoat={1} clearcoatRoughness={.08}/>
    </RoundedBox>
    <mesh position={[0,1.56,0]}><cylinderGeometry args={[.19,.19,.13,32]}/><meshStandardMaterial color="#bd9a5e" metalness={.8} roughness={.25}/></mesh>
    <mesh position={[0,1.78,0]}><cylinderGeometry args={[.25,.25,.38,32]}/><meshStandardMaterial color="#151515" metalness={.16} roughness={.35}/></mesh>
    <mesh position={[0,.8,.28]}><planeGeometry args={[.67,.92]}/><meshBasicMaterial map={texture}/></mesh>
  </group>;
}
export default function BottleViewer({color,label}:{color:string;label:string}) {
  return <Canvas camera={{position:[2.6,1.8,3.7],fov:36}} dpr={[1,1.5]} style={{width:'100%',height:'100%',touchAction:'none'}}>
    <ambientLight intensity={1.7}/><directionalLight position={[3,5,4]} intensity={2.8}/><directionalLight position={[-4,2,-2]} intensity={1.4}/>
    <Suspense fallback={null}><Bottle color={color} label={label}/></Suspense>
    <ContactShadows position={[0,-.05,0]} opacity={.3} scale={5} blur={2.8} far={3}/>
    <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={.4} maxPolarAngle={Math.PI/2+.3} autoRotate autoRotateSpeed={1.4}/>
  </Canvas>;
}

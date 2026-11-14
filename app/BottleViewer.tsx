'use client';
import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox, ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = generator.fromScene(room, .04);
    const old = scene.environment;
    scene.environment = target.texture;
    return () => { scene.environment = old; target.dispose(); room.dispose(); generator.dispose(); };
  }, [gl,scene]);
  return null;
}
function Bottle({color,label}:{color:string;label:string}) {
  const texture=useTexture(label);
  texture.colorSpace=THREE.SRGBColorSpace;
  const isDark = color.toLowerCase() === '#870e19';
  return <group position={[0, -.15, 0]}>
    {/* The model is an approximation: a glass shell, separate fluid, collar and cap. */}
    <RoundedBox args={[1.1,1.48,.6]} radius={.075} smoothness={6} position={[0,.81,0]}>
      <meshPhysicalMaterial color="#ffffff" metalness={0} roughness={.07} transmission={.92} thickness={.35} ior={1.48} clearcoat={1} envMapIntensity={1.6}/>
    </RoundedBox>
    <RoundedBox args={[.91,1.2,.42]} radius={.12} smoothness={6} position={[0,.78,0]}>
      <meshPhysicalMaterial color={color} metalness={0} roughness={.16} transparent opacity={isDark?.9:.55} clearcoat={1} envMapIntensity={1.1}/>
    </RoundedBox>
    {/* Thick, polished edges and glass base read as a real bottle, not a solid cube. */}
    {[-.49,.49].map(x=><mesh key={x} position={[x,.8,.24]}><cylinderGeometry args={[.025,.025,1.17,16]}/><meshPhysicalMaterial color="#f3f1e9" metalness={.1} roughness={.12} transparent opacity={.5}/></mesh>)}
    <mesh position={[0,1.59,0]}><cylinderGeometry args={[.20,.20,.13,48]}/><meshStandardMaterial color={isDark?'#b07a61':'#c2a575'} metalness={.9} roughness={.18}/></mesh>
    <mesh position={[0,1.88,0]}><cylinderGeometry args={[.25,.25,.52,64]}/><meshStandardMaterial color="#101010" metalness={.28} roughness={.3}/></mesh>
    <mesh position={[0,2.14,0]}><cylinderGeometry args={[.249,.249,.025,64]}/><meshStandardMaterial color="#171717" metalness={.28} roughness={.28}/></mesh>
    <mesh position={[0,.81,.307]}><planeGeometry args={[.70,.99]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>
  </group>;
}
export default function BottleViewer({color,label}:{color:string;label:string}) {
  return <Canvas camera={{position:[2.45,1.6,4.4],fov:34}} dpr={[1,1.5]} gl={{antialias:true}} style={{width:'100%',height:'100%',touchAction:'none'}}>
    <color attach="background" args={['#eeeae3']}/><ambientLight intensity={.8}/><directionalLight position={[3,5,4]} intensity={2.3}/><directionalLight position={[-4,2,-2]} intensity={1.3}/>
    <StudioEnvironment/><Suspense fallback={null}><Bottle color={color} label={label}/></Suspense>
    <ContactShadows position={[0,-.08,0]} opacity={.35} scale={5} blur={2.8} far={3}/>
    <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={.5} maxPolarAngle={Math.PI/2+.18} autoRotate autoRotateSpeed={.8}/>
  </Canvas>;
}

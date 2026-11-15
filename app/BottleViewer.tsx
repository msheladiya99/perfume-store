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
    const target = generator.fromScene(room, 0.04);
    const old = scene.environment;
    scene.environment = target.texture;
    return () => {
      scene.environment = old;
      target.dispose();
      room.dispose();
      generator.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Bottle({ color, label, collar }: { color: string; label: string; collar?: string }) {
  const texture = useTexture(label);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;

  const collarColors: Record<string, string> = {
    chrome: '#f2f4f6',
    gold: '#d4af37',
    copper: '#b86c4f',
    rosegold: '#c98670'
  };
  const collarHex = collarColors[collar || 'gold'] || '#d4af37';
  const isGodfather = color.toLowerCase() === '#8a0b16' || color.toLowerCase() === '#870e19';

  return (
    <group position={[0, -0.92, 0]}>
      {/* 1. Heavy Solid Crystal Base Pedestal (Solid Glass Bottom) */}
      <RoundedBox args={[1.08, 0.22, 0.58]} radius={0.06} smoothness={6} position={[0, 0.11, 0]} renderOrder={1}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.0}
          roughness={0.015}
          transmission={0.96}
          thickness={0.35}
          ior={1.52}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          transparent={true}
          depthWrite={true}
        />
      </RoundedBox>

      {/* 2. Inner Fragrance Liquid Core */}
      <RoundedBox args={[0.92, 1.10, 0.44]} radius={0.08} smoothness={6} position={[0, 0.77, 0]} renderOrder={1}>
        <meshPhysicalMaterial
          color={color}
          metalness={0.02}
          roughness={0.04}
          transmission={isGodfather ? 0.35 : 0.65}
          transparent={true}
          opacity={isGodfather ? 0.96 : 0.90}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
          ior={1.42}
          depthWrite={true}
        />
      </RoundedBox>

      {/* 3. Internal Atomizer Spray Pump & Translucent Dip Tube */}
      <mesh position={[0, 1.34, 0]} renderOrder={1}>
        <cylinderGeometry args={[0.06, 0.06, 0.14, 24]} />
        <meshStandardMaterial color="#ededed" metalness={0.95} roughness={0.12} />
      </mesh>
      <mesh position={[0.012, 0.72, 0]} renderOrder={1}>
        <cylinderGeometry args={[0.009, 0.009, 1.05, 16]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.88}
          transparent={true}
          opacity={0.68}
          roughness={0.10}
          thickness={0.04}
        />
      </mesh>

      {/* 4. Outer Faceted Crystal Glass Flacon Shell */}
      <RoundedBox args={[1.12, 1.34, 0.62]} radius={0.09} smoothness={8} position={[0, 0.77, 0]} renderOrder={2}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.0}
          roughness={0.012}
          transmission={0.94}
          thickness={0.20}
          ior={1.52}
          specularIntensity={1.4}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          transparent={true}
          depthWrite={false}
        />
      </RoundedBox>

      {/* 5. Stepped Metallic Collar Rings */}
      <mesh position={[0, 1.46, 0]}>
        <cylinderGeometry args={[0.24, 0.255, 0.06, 48]} />
        <meshStandardMaterial color={collarHex} metalness={0.95} roughness={0.10} />
      </mesh>
      <mesh position={[0, 1.52, 0]}>
        <cylinderGeometry args={[0.20, 0.20, 0.06, 48]} />
        <meshStandardMaterial color={collarHex} metalness={0.95} roughness={0.10} />
      </mesh>

      {/* 6. Weighted Obsidian Black Luxury Cap with Crown Bevel */}
      <mesh position={[0, 1.82, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.54, 64]} />
        <meshStandardMaterial color="#141414" metalness={0.20} roughness={0.32} />
      </mesh>
      <mesh position={[0, 2.10, 0]}>
        <cylinderGeometry args={[0.228, 0.24, 0.025, 64]} />
        <meshStandardMaterial color="#141414" metalness={0.20} roughness={0.32} />
      </mesh>

      {/* 7. Embossed Luxury Label with Metallic Foil Trim Border */}
      <mesh position={[0, 0.76, 0.312]} renderOrder={3}>
        <boxGeometry args={[0.72, 1.00, 0.006]} />
        <meshStandardMaterial color={collarHex} metalness={0.92} roughness={0.16} />
      </mesh>
      <mesh position={[0, 0.76, 0.317]} renderOrder={4}>
        <planeGeometry args={[0.69, 0.97]} />
        <meshStandardMaterial map={texture} roughness={0.72} metalness={0.05} toneMapped={true} />
      </mesh>
      <mesh position={[0, 0.76, 0.309]} rotation={[0, Math.PI, 0]} renderOrder={3}>
        <planeGeometry args={[0.69, 0.97]} />
        <meshStandardMaterial color="#f6f2ea" roughness={0.88} />
      </mesh>
    </group>
  );
}

export default function BottleViewer({
  color,
  label,
  collar
}: {
  color: string;
  label: string;
  collar?: string;
}) {
  return (
    <Canvas
      camera={{ position: [1.8, 0.4, 3.4], fov: 32 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
    >
      <color attach="background" args={['#efeae3']} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={2.6} />
      <directionalLight position={[-4, 2, -2]} intensity={1.4} />
      <StudioEnvironment />
      <Suspense fallback={null}>
        <Bottle color={color} label={label} collar={collar} />
      </Suspense>
      <ContactShadows position={[0, -0.92, 0]} opacity={0.45} scale={4.5} blur={2.5} far={2.5} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.6}
        maxPolarAngle={Math.PI / 2 + 0.15}
        autoRotate
        autoRotateSpeed={0.9}
        target={[0, 0.1, 0]}
      />
    </Canvas>
  );
}

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Models are deliberately disabled until commercially licensed, compatible assets are supplied.
export type CharacterRole = 'fragrance-expert' | 'floral-expert' | 'oud-expert' | 'gift-expert' | 'testing-expert' | 'cashier' | 'male-browser' | 'female-browser' | 'testing-customer' | 'billing-customer' | 'customer-5' | 'customer-6' | 'customer-7' | 'customer-8';
export type CharacterConfig = { role: CharacterRole; url: string; position: [number, number, number]; rotation: number; scale: number; idleClip: string; enabled: boolean };
const make = (role: CharacterRole, position: [number,number,number], rotation=0): CharacterConfig => ({role,url:`/assets/characters/${role}.glb`,position,rotation,scale:1,idleClip:'Idle',enabled:false});
export const CHARACTER_CONFIG: CharacterConfig[] = [
  make('fragrance-expert',[-5,0,-2],0),make('floral-expert',[7,0,4],-Math.PI/2),make('oud-expert',[-7,0,-5],Math.PI/2),make('gift-expert',[7,0,-3],-Math.PI/2),make('testing-expert',[-3.4,0,3],0),
  make('cashier',[6.2,0,-9.8],0),make('male-browser',[-7.5,0,1],Math.PI/2),make('female-browser',[7.5,0,1],-Math.PI/2),make('testing-customer',[-5,0,0],Math.PI),make('billing-customer',[6.3,0,-6.7],Math.PI),
  make('customer-5',[-5.5,0,5],Math.PI/2),make('customer-6',[5,0,6],-Math.PI/2),make('customer-7',[-6,0,-7],Math.PI/2),make('customer-8',[7,0,-5.5],-Math.PI/2),
];
export type LoadedCharacter = { role: CharacterRole; model: THREE.Group; mixer: THREE.AnimationMixer; clips: THREE.AnimationClip[]; radius: number; play: (name:string,fade?:number)=>boolean; attach: (object:THREE.Object3D, boneName:string)=>boolean };
export async function loadCharacter(config: CharacterConfig, scene: THREE.Scene): Promise<LoadedCharacter> {
  const gltf=await new GLTFLoader().loadAsync(config.url);
  const model=gltf.scene; let rigged=false;
  model.traverse(obj=>{if(obj instanceof THREE.SkinnedMesh)rigged=true;});
  if(!rigged) throw new Error(`${config.role} is not a skinned, rigged character`);
  if(!gltf.animations.length) throw new Error(`${config.role} has no animation clips`);
  model.position.set(...config.position);model.rotation.y=config.rotation;model.scale.setScalar(config.scale);
  model.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.castShadow=true;obj.receiveShadow=true;}});
  scene.add(model);
  const mixer=new THREE.AnimationMixer(model);let active:THREE.AnimationAction|undefined;
  const character:LoadedCharacter={role:config.role,model,mixer,clips:gltf.animations,radius:.45,
    play(name,fade=.3){const clip=gltf.animations.find(item=>item.name===name);if(!clip)return false;const next=mixer.clipAction(clip);if(active===next)return true;next.reset().fadeIn(fade).play();active?.fadeOut(fade);active=next;return true;},
    attach(object,boneName){const bone=model.getObjectByName(boneName);if(!bone)return false;bone.add(object);object.position.set(0,0,0);object.rotation.set(0,0,0);return true;}
  };
  if(!character.play(config.idleClip)) console.warn(`Missing ${config.idleClip} clip for ${config.role}; model will remain in its authored pose.`);
  return character;
}

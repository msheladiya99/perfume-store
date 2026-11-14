import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/** Licensed model files are optional until supplied by the store owner.
 *  Positions are in showroom metres; no remote model is silently fetched. */
export type CharacterRole = 'male-browser' | 'female-browser' | 'fragrance-expert' | 'testing-customer' | 'billing-customer' | 'cashier';
export type CharacterConfig = { role: CharacterRole; url: string; position: [number, number, number]; rotation: number; scale: number; idleClip: string; enabled: boolean };
export const CHARACTER_CONFIG: CharacterConfig[] = [
  {role:'male-browser',url:'/assets/characters/male-browser.glb',position:[-7.5,0,1],rotation:Math.PI/2,scale:1,idleClip:'Browse',enabled:false},
  {role:'female-browser',url:'/assets/characters/female-browser.glb',position:[7.5,0,1],rotation:-Math.PI/2,scale:1,idleClip:'Browse',enabled:false},
  {role:'fragrance-expert',url:'/assets/characters/fragrance-expert.glb',position:[-4.7,0,-2],rotation:0,scale:1,idleClip:'Idle',enabled:false},
  {role:'testing-customer',url:'/assets/characters/testing-customer.glb',position:[-4.7,0,0],rotation:Math.PI,scale:1,idleClip:'Idle',enabled:false},
  {role:'billing-customer',url:'/assets/characters/billing-customer.glb',position:[6.3,0,-6.7],rotation:Math.PI,scale:1,idleClip:'Idle',enabled:false},
  {role:'cashier',url:'/assets/characters/cashier.glb',position:[6.2,0,-9.8],rotation:0,scale:1,idleClip:'Idle',enabled:false},
];
export type LoadedCharacter = { role: CharacterRole; model: THREE.Group; mixer: THREE.AnimationMixer; clips: THREE.AnimationClip[]; radius: number; play: (name:string,fade?:number)=>boolean; attach: (object:THREE.Object3D, boneName:string)=>boolean };

export async function loadCharacter(config: CharacterConfig, scene: THREE.Scene): Promise<LoadedCharacter> {
  const gltf = await new GLTFLoader().loadAsync(config.url);
  const model=gltf.scene; model.position.set(...config.position); model.rotation.y=config.rotation; model.scale.setScalar(config.scale);
  model.traverse(obj=>{ if(obj instanceof THREE.Mesh){obj.castShadow=true; obj.receiveShadow=true;} });
  scene.add(model);
  const mixer=new THREE.AnimationMixer(model); let active: THREE.AnimationAction | undefined;
  const character: LoadedCharacter={ role:config.role, model, mixer, clips:gltf.animations, radius:.45,
    play(name,fade=.3){ const clip=gltf.animations.find(item=>item.name===name); if(!clip)return false; const next=mixer.clipAction(clip); if(active===next)return true; next.reset().fadeIn(fade).play(); active?.fadeOut(fade); active=next; return true; },
    attach(object,boneName){const bone=model.getObjectByName(boneName); if(!bone)return false; bone.add(object); object.position.set(0,0,0); object.rotation.set(0,0,0); return true;}
  };
  character.play(config.idleClip) || character.play('Idle'); return character;
}

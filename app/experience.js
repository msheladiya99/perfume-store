import * as THREE from 'three';
import React from 'react';
import { createRoot } from 'react-dom/client';
import BottleViewer from './BottleViewer';
import {
  CHARACTER_CONFIG,
  loadCharacter,
  createDemonstrationState,
  shoppingJourney,
  SHOPPING_STAGES,
  createLuxuryTestingStripProp,
  createBoutiqueShoppingBagProp,
  verifyCharacterAssets
} from './npcs';

const app = document.querySelector('#app');
app.innerHTML = `
<div id="scene"></div>
<div class="grain"></div>
<header>
  <div class="brand">
    <img class="brand-logo" src="/assets/zevaro-mark.png" alt="Zevaro logo">
    <span>ZEVARO PERFUMES<small>LUXURY FRAGRANCES</small></span>
  </div>
  <div class="header-right">
    <span class="live"><i></i> BOUTIQUE IS OPEN</span>
    <button id="staffBtn" class="staff-button"><span>👤</span> BOUTIQUE TEAM <b id="staffCount">14</b></button>
    <button id="cartBtn" class="cart-button"><span>♧</span> TROLLEY <b id="cartCount">0</b></button>
  </div>
</header>
<div id="welcome" class="welcome">
  <div class="welcome-card">
    <div class="eyebrow"><span></span> AN INVITATION TO DISCOVER <span></span></div>
    <h1>Welcome to<br><em>Zevaro Perfumes.</em></h1>
    <p>Your fragrance journey begins here. Step inside our luxury boutique with live consultants and patrons.</p>
    <button id="enter" class="primary">ENTER ZEVARO PERFUMES <span>↗</span></button>
    <div class="welcome-foot">AN IMMERSIVE LUXURY EXPERIENCE</div>
  </div>
  <div class="welcome-bottom">
    <span>01 / THE BOUTIQUE</span>
    <span>CRAFTED TO BE REMEMBERED</span>
    <span>ZEVARO PERFUMES</span>
  </div>
</div>
<div id="hud" class="hidden">
  <div class="location">
    <img class="location-logo" src="/assets/zevaro-mark.png" alt="">
    <div><small>YOU ARE EXPLORING</small><strong>The Boutique</strong></div>
    <span class="location-line"></span>
    <span class="floor">GROUND FLOOR</span>
  </div>
  <div id="demoTicker" class="demo-ticker">
    <span>LIVE CONSULTATION · MEN'S FRAGRANCES</span>
    <strong id="demoStepTitle">Step 1: Perfume Selection</strong>
    <small id="demoStepDesc">Salesman naturally reaches and grasps the perfume bottle from the counter plinth.</small>
  </div>
  <div id="shopperTicker" class="shopper-ticker">
    <span>LIVE SHOPPING JOURNEY · HAUTE CHECKOUT</span>
    <strong id="shopperStageTitle">1. Selecting Flacon at Rack</strong>
    <small id="shopperStageDesc">Arjun Roy selecting luxury perfume flacon from signature rack</small>
  </div>
  <div id="crosshair" class="crosshair"><i></i></div>
  <div id="hint" class="hint hidden"></div>
  <div class="controls">
    <div class="control-icon">⌘</div>
    <div>
      <strong>TAKE A LOOK AROUND</strong>
      <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move <b>·</b> Mouse to look <b>·</b> Click or <kbd>E</kbd> to interact</span>
    </div>
    <button id="helpClose">×</button>
  </div>
  <div class="bottom-right">
    <span>THE ART OF FINDING YOUR SCENT</span>
    <button id="soundBtn" title="How to explore / Boutique Directory">?</button>
  </div>
</div>
<div id="panel" class="panel hidden">
  <button class="close" id="closePanel">×</button>
  <div id="panelContent"></div>
</div>
<div id="toast" class="toast"></div>
<div id="mobileControls" class="mobile-controls hidden">
  <div id="joystick" class="joystick" role="application" aria-label="Movement joystick">
    <div class="joystick-ring"></div>
    <div id="joystickKnob" class="joystick-knob"></div>
  </div>
  <span>MOVE</span>
</div>
<div id="mobileLookHint" class="mobile-look-hint hidden">DRAG TO LOOK <b>·</b> TAP TO EXPLORE</div>
`;

const $ = (s) => document.querySelector(s);
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8dfd0);
scene.fog = new THREE.Fog(0xe8dfd0, 30, 65);

const camera = new THREE.PerspectiveCamera(64, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.65, 19.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, isTouchDevice ? 1.25 : 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
$('#scene').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xfff3dd, 0x766956, 2.1));
const sun = new THREE.DirectionalLight(0xffedcf, 2.2);
sun.position.set(2, 9, 5);
sun.castShadow = true;
sun.shadow.mapSize.set(isTouchDevice ? 1024 : 2048, isTouchDevice ? 1024 : 2048);
sun.shadow.camera.left = -14;
sun.shadow.camera.right = 14;
sun.shadow.camera.top = 14;
sun.shadow.camera.bottom = -14;
scene.add(sun);

const mat = (c, rough = 0.8, metal = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: metal });
const cream = mat(0xe8ddcc),
  wall = mat(0xe9e1d4),
  ivory = mat(0xf5efe4),
  dark = mat(0x413529),
  wood = mat(0x86694f),
  gold = mat(0xb59a68, 0.3, 0.7),
  black = mat(0x242321),
  marble = mat(0xd8cfc1, 0.45),
  shelfmat = mat(0xeee5d5);

function box(w, h, d, m, x, y, z, shadow = true) {
  let o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y, z);
  o.castShadow = shadow;
  o.receiveShadow = true;
  scene.add(o);
  return o;
}
function cyl(r1, r2, h, m, x, y, z) {
  let o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, 20), m);
  o.position.set(x, y, z);
  o.castShadow = true;
  o.receiveShadow = true;
  scene.add(o);
  return o;
}
function textPlane(text, w, h, x, y, z, opts = {}) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 256;
  let ctx = c.getContext('2d');
  if (opts.bg) {
    ctx.fillStyle = opts.bg;
    ctx.fillRect(0, 0, 1024, 256);
  }
  ctx.fillStyle = opts.color || '#514335';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${opts.size || 86}px ${opts.font || 'Georgia'}`;
  ctx.fillText(text, 512, 128);
  let t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  let mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: !opts.bg, side: THREE.DoubleSide }));
  mesh.position.set(x, y, z);
  if (opts.rot) mesh.rotation.y = opts.rot;
  scene.add(mesh);
  return mesh;
}

// Architecture: an enclosed, richly layered boutique.
box(20, 0.15, 23, marble, 0, -0.1, 0);
box(20, 6, 0.25, wall, 0, 3, -11.5);
box(0.25, 6, 23, wall, -10, 3, 0);
box(0.25, 6, 23, wall, 10, 3, 0);
box(20, 0.2, 23, ivory, 0, 6, 0);
box(20, 0.2, 0.32, cream, 0, 0.15, -11.25);
box(0.32, 0.2, 23, cream, -9.8, 0.15, 0);
box(0.32, 0.2, 23, cream, 9.8, 0.15, 0);

// Floor tiles, fine joints and inlaid border.
for (let x = -9; x <= 9; x += 2) box(0.018, 0.008, 22, mat(0xbcb1a1), x, 0.004, 0, false);
for (let z = -10; z <= 10; z += 2) box(19, 0.008, 0.018, mat(0xbcb1a1), 0, 0.005, z, false);
for (let x of [-9.4, 9.4]) box(0.035, 0.012, 21, gold, x, 0.01, 0, false);
for (let z of [-10.8, 10.8]) box(18.8, 0.012, 0.035, gold, 0, 0.01, z, false);

// Back wall, panels and signature feature.
for (let x of [-8, -5.5, -3, 3, 5.5, 8]) {
  box(0.055, 5.3, 0.08, cream, x, 3, -11.3);
  box(2.15, 0.04, 0.08, cream, x, 5.5, -11.28);
}
box(5.6, 4.9, 0.15, mat(0xd4c3a8), 0, 3, -11.25);
box(5.25, 4.55, 0.08, mat(0xede3d4), 0, 3, -11.14);
textPlane('ZEVARO PERFUMES', 4.3, 0.7, 0, 4.38, -11.07, { size: 92 });
textPlane('L U X U R Y   F R A G R A N C E S', 3.3, 0.32, 0, 3.91, -11.06, { size: 56 });
textPlane('THE ART OF SCENT', 2.3, 0.3, 0, 1.12, -11.06, { size: 55 });

// Street-facing architecture and rolling shutter.
box(7, 6, 0.3, wall, -6.5, 3, 11.5);
box(7, 6, 0.3, wall, 6.5, 3, 11.5);
box(6, 1.05, 0.35, dark, 0, 5.48, 11.5);
box(20, 0.1, 7, mat(0x827e76), 0, -0.04, 15);
box(36, 0.12, 15, mat(0x35383a), 0, -0.1, 25);
box(20, 0.18, 0.2, mat(0xc8c1b4), 0, 0.07, 18.45);
for (let x = -16; x < 18; x += 6) box(3, 0.013, 0.13, mat(0xd4cbb7), x, 0.03, 25, false);
for (let x of [-8, 8]) {
  box(0.06, 4.5, 0.06, gold, x, 2.3, 11.75);
  box(4.5, 3.4, 0.08, mat(0x5b655f, 0.25, 0.25), x, 2.3, 11.7);
  for (let y of [0.6, 4]) box(4.6, 0.07, 0.1, gold, x, y, 11.8);
}
box(8, 1.5, 0.45, dark, 0, 5.65, 11.65);
textPlane('ZEVARO PERFUMES', 7.3, 0.65, 0, 5.85, 11.91, { size: 90, color: '#d6bd83' });
textPlane('LUXURY FRAGRANCES', 4, 0.28, 0, 5.31, 11.92, { size: 62, color: '#d6bd83' });
for (let x of [-3.08, 3.08]) box(0.16, 4.9, 0.25, gold, x, 2.45, 11.65);
box(6.3, 0.18, 0.4, gold, 0, 4.93, 11.65);

let shutter = new THREE.Group();
scene.add(shutter);
const slatMaterial = mat(0x393b39, 0.42, 0.65);
for (let i = 0; i < 26; i++) {
  let slat = new THREE.Mesh(new THREE.BoxGeometry(6, 0.185, 0.13), slatMaterial);
  slat.position.set(0, 0.1 + i * 0.185, 11.72);
  slat.castShadow = true;
  slat.receiveShadow = true;
  shutter.add(slat);
}
const shutterName = textPlane('ZEVARO PERFUMES', 4.8, 0.65, 0, 2.7, 11.8, { size: 92, color: '#d8bc7b' });
shutter.add(shutterName);

for (let x of [-13, 13]) {
  box(6, 7, 1, mat(x < 0 ? 0xb0a69a : 0xa99e90), x, 3.5, 10.8);
  for (let y of [2, 4, 6]) box(4, 0.8, 0.1, mat(0x69716c), x, y, 11.35);
}
for (let x of [-9, 9]) {
  cyl(0.08, 0.1, 4, black, x, 2, 17);
  cyl(0.3, 0.3, 0.12, gold, x, 4, 17);
  let l = new THREE.PointLight(0xffd8a0, 3, 8);
  l.position.set(x, 3.8, 17);
  scene.add(l);
}

// Wall mouldings and illuminated sconces.
for (let side of [-1, 1]) {
  for (let z of [-9, -5, -1, 3, 7]) {
    box(0.1, 5, 0.06, cream, side * 9.83, 3, z);
    box(0.1, 0.05, 3.6, cream, side * 9.83, 5.3, z + 1.8);
    box(0.18, 0.65, 0.25, gold, side * 9.75, 4.2, z + 1.7);
    let light = new THREE.PointLight(0xffd6a0, 4, 5);
    light.position.set(side * 9.3, 4.1, z + 1.7);
    scene.add(light);
  }
}
// Ceiling coves and pendants.
for (let x of [-6, 0, 6])
  for (let z of [-7, 0, 7]) {
    cyl(0.52, 0.52, 0.08, mat(0xfaf3e5), x, 5.85, z);
    cyl(0.23, 0.23, 0.12, gold, x, 5.76, z);
    let l = new THREE.PointLight(0xffe3bb, 5, 10);
    l.position.set(x, 5.4, z);
    scene.add(l);
  }

// Central rug and display island.
box(5.8, 0.025, 3.8, mat(0xb7a790), 3.8, 0.025, -1.4);
box(5.6, 0.025, 3.6, mat(0xd7cabc), 3.8, 0.04, -1.4);
box(3.3, 0.7, 1.6, wood, 3.8, 0.38, -1.4);
box(3.5, 0.12, 1.8, marble, 3.8, 0.78, -1.4);
box(3.35, 0.035, 1.65, gold, 3.8, 0.86, -1.4);
box(3.3, 0.08, 1.6, ivory, 3.8, 0.91, -1.4);
textPlane('THE SIGNATURE COLLECTION', 2.8, 0.28, 3.8, 0.53, -0.585, { size: 58 });


const products = [
  { name: 'CEO Man', slug: 'ceo-man', price: 299, color: 0xe3e3df, desc: 'Eau de Parfum · 50 ml' },
  { name: 'Choco Musk', slug: 'choco-musk', price: 299, color: 0xd8a25a, desc: 'Eau de Parfum · 50 ml' },
  { name: 'Godfather', slug: 'godfather', price: 299, color: 0x870e19, desc: 'Eau de Parfum · 50 ml' },
  { name: 'Rose of No Man’s Land', slug: 'rose-of-no-mans-land', price: 299, color: 0xe0a59c, desc: 'Eau de Parfum · 50 ml' },
  { name: 'White London', slug: 'white-london', price: 299, color: 0xe9e4d2, desc: 'Eau de Parfum · 50 ml' },
  { name: 'White Oud', slug: 'white-oud', price: 299, color: 0xdec29b, desc: 'Eau de Parfum · 50 ml' }
];

const textureLoader = new THREE.TextureLoader();
for (const product of products) {
  product.label = textureLoader.load(`/assets/products/${product.slug}-label.png`);
  product.label.colorSpace = THREE.SRGBColorSpace;
}

let interact = [];
const bottleGlass = new THREE.MeshPhysicalMaterial({ color: 0xf5f4ee, metalness: 0.12, roughness: 0.12, transparent: true, opacity: 0.34, clearcoat: 1, depthWrite: false });
const bottleBase = new THREE.MeshStandardMaterial({ color: 0xe8e8df, metalness: 0.35, roughness: 0.18, transparent: true, opacity: 0.65 });
const bottleFluidMaterials = new Map(products.map((p) => [p.slug, new THREE.MeshPhysicalMaterial({ color: p.color, metalness: 0.06, roughness: 0.18, transparent: true, opacity: p.slug === 'godfather' ? 0.93 : 0.7, clearcoat: 1 })]));
const bottleLabelMaterials = new Map(products.map((p) => [p.slug, new THREE.MeshBasicMaterial({ map: p.label, toneMapped: false })]));
const sharedBody = new THREE.BoxGeometry(0.34, 0.48, 0.18),
  sharedFluid = new THREE.BoxGeometry(0.27, 0.4, 0.12),
  sharedBase = new THREE.BoxGeometry(0.34, 0.035, 0.18),
  sharedLabel = new THREE.PlaneGeometry(0.22, 0.31),
  sharedCap = new THREE.CylinderGeometry(0.077, 0.077, 0.15, 20),
  sharedNeck = new THREE.CylinderGeometry(0.065, 0.065, 0.045, 20),
  sharedRidge = new THREE.CylinderGeometry(0.008, 0.008, 0.38, 8);

function bottle(x, y, z, p, scale = 1, rotation = 0) {
  const group = new THREE.Group();
  function add(geometry, material, a, b, c) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(a, b, c);
    mesh.userData = { type: 'product', product: p };
    mesh.castShadow = true;
    group.add(mesh);
    interact.push(mesh);
    return mesh;
  }
  add(sharedFluid, bottleFluidMaterials.get(p.slug), 0, 0.26, 0);
  add(sharedBody, bottleGlass, 0, 0.26, 0);
  add(sharedBase, bottleBase, 0, 0.028, 0);
  add(sharedNeck, gold, 0, 0.525, 0);
  add(sharedCap, black, 0, 0.62, 0);
  add(sharedRidge, bottleBase, -0.15, 0.26, 0.073);
  add(sharedRidge, bottleBase, 0.15, 0.26, 0.073);
  add(sharedLabel, bottleLabelMaterials.get(p.slug), 0, 0.26, 0.092);
  group.position.set(x, y, z);
  group.rotation.y = rotation;
  group.scale.setScalar(scale);
  scene.add(group);
  return group;
}

function wallRack(x, z, rot = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  scene.add(g);
  function part(w, h, d, m, a, b, c) {
    let o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    o.position.set(a, b, c);
    o.castShadow = true;
    o.receiveShadow = true;
    g.add(o);
  }
  part(3.4, 3.65, 0.18, mat(0xcbbba5), 0, 2.05, 0);
  part(3.55, 0.14, 0.65, wood, 0, 0.32, 0.2);
  for (let y of [0.75, 1.65, 2.55, 3.45]) {
    part(3.5, 0.09, 0.58, shelfmat, 0, y, 0.2);
    part(3.5, 0.025, 0.025, gold, 0, y + 0.05, 0.5);
    for (let i = 0; i < 6; i++) {
      let p = products[(i + Math.round(y * 3) + Math.round(Math.abs(x))) % products.length];
      let loc = new THREE.Vector3(-1.35 + i * 0.54, y + 0.05, 0.25).applyMatrix4((g.updateMatrixWorld(), g.matrixWorld));
      bottle(loc.x, loc.y, loc.z, p, 0.8, rot);
    }
  }
  part(0.1, 3.8, 0.65, wood, -1.7, 2.1, 0.2);
  part(0.1, 3.8, 0.65, wood, 1.7, 2.1, 0.2);
}

wallRack(-7.1, -10.9);
wallRack(7.1, -10.9);
wallRack(-9.65, -5, Math.PI / 2);
wallRack(-9.65, 2, Math.PI / 2);
wallRack(9.65, -5, -Math.PI / 2);
wallRack(9.65, 2, -Math.PI / 2);

// Luxury Consultation & Testing Tables in front of ALL racks
function createConsultationTable(x, z, rot, title, stationProducts) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  scene.add(g);

  // Wood Cabinet Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.85, 0.8), wood);
  base.position.set(0, 0.425, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  g.add(base);

  // Italian Marble Countertop
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.9), marble);
  top.position.set(0, 0.89, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  g.add(top);

  // 24K Brushed Gold Rim
  const rim = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.02, 0.84), gold);
  rim.position.set(0, 0.94, 0);
  g.add(rim);

  // Engraved Brass Station Plaque
  const plaque = textPlane(title, 1.6, 0.16, 0, 0.55, 0.41, { size: 44, color: '#e8d2ac' });
  g.add(plaque);

  // Gold Fragrance Testing Tray
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.02, 0.42), gold);
  tray.position.set(0, 0.95, 0);
  g.add(tray);

  // Perfume Flacons on Tray
  if (stationProducts && stationProducts.length > 0) {
    stationProducts.forEach((p, idx) => {
      const offsetX = -0.22 + idx * 0.44;
      const flacon = bottle(0, 0, 0, p, 0.72);
      flacon.position.set(offsetX, 0.96, 0);
      g.add(flacon);
    });
  }

  // Glass Scent Cloche Tester (Fragrance Dome)
  const clocheBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.10, 0.02, 24), gold);
  clocheBase.position.set(-0.62, 0.95, 0.12);
  g.add(clocheBase);

  const clocheGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 0.15, 24),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.92, roughness: 0.08, ior: 1.5, transparent: true, opacity: 0.35, depthWrite: false })
  );
  clocheGlass.position.set(-0.62, 1.04, 0.12);
  g.add(clocheGlass);

  const clocheHandle = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), gold);
  clocheHandle.position.set(-0.62, 1.13, 0.12);
  g.add(clocheHandle);

  // Luxury Blotter Stand with fan of testing strips
  const blotterStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.05, 16), gold);
  blotterStand.position.set(0.62, 0.97, 0.12);
  g.add(blotterStand);

  for (let s = -2; s <= 2; s++) {
    const strip = createLuxuryTestingStripProp();
    strip.position.set(0.62, 1.03, 0.12);
    strip.rotation.z = s * 0.18;
    strip.rotation.y = s * 0.08;
    g.add(strip);
  }

  // Porcelain Coffee Bean Dish
  const coffeeBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.045, 0.035, 16), ivory);
  coffeeBowl.position.set(0.62, 0.96, -0.16);
  g.add(coffeeBowl);
  const coffeeBeans = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12), dark);
  coffeeBeans.position.set(0.62, 0.98, -0.16);
  g.add(coffeeBeans);

  // Dedicated Soft Warm Testing Light
  const spot = new THREE.PointLight(0xffe8cc, 3.2, 5.0);
  spot.position.set(x, 2.7, z);
  scene.add(spot);

  return g;
}

// 1. Back-Left Table in front of Masculine Perfumes Rack
createConsultationTable(-7.1, -8.8, 0, 'SIGNATURE MASCULINE PARFUMS', [products[0], products[2]]);

// 2. Left-Front Table in front of Floral Perfumes Rack
createConsultationTable(-7.5, 2.0, Math.PI / 2, 'FLORAL & ROSE ACCORDS CONSULTATION', [products[3], products[4]]);

// 3. Left-Back Table in front of Oud & Oriental Perfumes Rack
createConsultationTable(-7.5, -5.0, Math.PI / 2, 'ORIENTAL & OUD DISTILLATION', [products[5], products[1]]);

// 4. Right-Front Table in front of Testing & Blotter Bar Rack
createConsultationTable(7.5, 2.0, -Math.PI / 2, 'ARTISANAL TESTING & BLOTTER BAR', [products[4], products[0]]);

// 5. Right-Back Table in front of Haute Parfumerie Gift Rack
createConsultationTable(7.5, -5.0, -Math.PI / 2, 'HAUTE PARFUMERIE GIFT CURATION', [products[3], products[5]]);

for (let i = 0; i < 6; i++) bottle(2.55 + i * 0.5, 0.96, -1.4, products[i], 1.15);

// Plinths with hero bottles.
for (let x of [-3.7, 3.7]) {
  cyl(0.7, 0.7, 0.9, cream, x, 0.45, -7.4);
  cyl(0.72, 0.72, 0.05, gold, x, 0.92, -7.4);
  bottle(x, 0.95, -7.4, products[x < 0 ? 1 : 5], 1.65);
}

// Cashier desk
box(3.3, 1.15, 1.1, wood, 6.4, 0.6, -8.5);
box(3.45, 0.13, 1.25, marble, 6.4, 1.23, -8.5);
box(2.95, 0.035, 0.035, gold, 6.4, 0.2, -7.92);
textPlane('ZEVARO PERFUMES', 2.3, 0.3, 6.4, 0.72, -7.92, { size: 75 });
box(0.6, 0.38, 0.12, black, 7.1, 1.5, -8.4);
box(0.5, 0.03, 0.3, gold, 7.1, 1.32, -8.4);

// Luxury gift shopping bag at cashier counter
const cashierBag = createBoutiqueShoppingBagProp();
cashierBag.position.set(6.0, 1.45, -8.3);
scene.add(cashierBag);

// Luxury flacon placed on cashier marble counter during Arjun's checkout
const counterFlacon = bottle(6.4, 1.25, -8.0, products[0], 0.75);
counterFlacon.visible = false;

// Fragrance testing props on the main consultation table (Back-Left Masculine Table)
const demoBottle = bottle(-7.1, 0.98, -8.8, products[2], 0.9); // Godfather
const demoStrip = createLuxuryTestingStripProp();
demoStrip.position.set(-6.8, 0.98, -8.8);
demoStrip.rotation.x = -Math.PI / 2;
scene.add(demoStrip);

let cashierTrigger = box(3.5, 1.5, 1.5, new THREE.MeshBasicMaterial({ visible: false }), 6.4, 0.8, -8.5);
cashierTrigger.userData = { type: 'cashier' };
interact.push(cashierTrigger);

// Service Point
const serviceSign = box(0.9, 0.38, 0.045, dark, 5.5, 1.53, -7.65);
serviceSign.userData = { type: 'employee' };
interact.push(serviceSign);
const serviceText = textPlane('FRAGRANCE ADVICE', 0.78, 0.15, 5.5, 1.55, -7.62, { size: 65, color: '#e9d4ae' });
textPlane('PERSONAL FRAGRANCE CONSULTATION', 3.3, 0.3, 6.4, 3.5, 11.12, { rot: Math.PI, size: 50 });

// Decorative plants
function plant(x, z) {
  cyl(0.37, 0.29, 0.6, cream, x, 0.3, z);
  for (let i = 0; i < 9; i++) {
    let leaf = new THREE.Mesh(new THREE.SphereGeometry(0.19, 10, 8), mat(i % 2 ? 0x657563 : 0x7d8972));
    leaf.scale.set(0.65, 2.3, 0.65);
    leaf.position.set(x + Math.sin(i * 2) * 0.3, 1.0 + (i % 3) * 0.17, z + Math.cos(i * 2) * 0.3);
    leaf.rotation.z = Math.sin(i * 2) * 0.45;
    scene.add(leaf);
  }
}
plant(-8.7, 9);
plant(8.7, 9);
plant(-8.7, -9);
plant(8.7, -9);

// 10-Step Demonstration State Machine
const demoState = createDemonstrationState();

// Perfume Spray Mist Particle System
const mistParticleCount = 60;
const mistGeometry = new THREE.BufferGeometry();
const mistPositions = new Float32Array(mistParticleCount * 3);
const mistVelocities = [];
for (let i = 0; i < mistParticleCount; i++) {
  mistPositions[i * 3] = -7.1 + (Math.random() - 0.5) * 0.05;
  mistPositions[i * 3 + 1] = 1.30 + (Math.random() - 0.5) * 0.05;
  mistPositions[i * 3 + 2] = -9.1;
  mistVelocities.push(new THREE.Vector3((Math.random() - 0.5) * 0.08, (Math.random() - 0.2) * 0.04, 0.25 + Math.random() * 0.15));
}
mistGeometry.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));
const mistMaterial = new THREE.PointsMaterial({
  color: 0xf5eedb,
  size: 0.04,
  transparent: true,
  opacity: 0.0,
  depthWrite: false
});
const mistPoints = new THREE.Points(mistGeometry, mistMaterial);
scene.add(mistPoints);

let isSprayingMist = false;
let mistTimer = 0;
function triggerMistBurst() {
  isSprayingMist = true;
  mistTimer = 0;
  mistMaterial.opacity = 0.85;
  const pos = mistGeometry.attributes.position.array;
  for (let i = 0; i < mistParticleCount; i++) {
    pos[i * 3] = -7.1 + (Math.random() - 0.5) * 0.05;
    pos[i * 3 + 1] = 1.30 + (Math.random() - 0.5) * 0.05;
    pos[i * 3 + 2] = -9.1;
  }
  mistGeometry.attributes.position.needsUpdate = true;
}

// Character loader and active roster
const loadedCharacters = [];

for (const config of CHARACTER_CONFIG.filter((item) => item.enabled)) {
  loadCharacter(config, scene)
    .then((character) => {
      loadedCharacters.push(character);
      if (character.config.role === 'fragrance-expert') {
        scene.remove(serviceSign);
        scene.remove(serviceText);
        interact = interact.filter((mesh) => mesh !== serviceSign);
      }
      character.model.traverse((mesh) => {
        if (mesh.isMesh) {
          mesh.userData = { type: 'character', character, config: character.config };
          interact.push(mesh);
        }
      });
    })
    .catch((error) => {
      console.warn(`[Zevaro Asset Diagnostic] ${config.role} GLB character pending procurement:`, error.message);
    });
}

let active = false,
  entering = false,
  entranceStart = 0,
  yaw = 0,
  pitch = 0,
  keys = {},
  cart = [],
  near = null;
const ray = new THREE.Raycaster();
let last = performance.now();

function notice(s) {
  $('#toast').textContent = s;
  $('#toast').classList.add('show');
  clearTimeout(notice.timer);
  notice.timer = setTimeout(() => $('#toast').classList.remove('show'), 2600);
}

function lock() {
  if (isTouchDevice) return;
  if (active && !$('#panel').classList.contains('hidden')) return;
  try {
    const lockPromise = renderer.domElement.requestPointerLock?.();
    if (lockPromise && typeof lockPromise.catch === 'function') {
      lockPromise.catch(() => {});
    }
  } catch (e) {
    // Ignore pointer lock permission or iframe security errors
  }
}

if (localStorage.getItem('zevaroVisited')) {
  $('#enter').insertAdjacentHTML('afterend', '<button id="skipEntrance" class="skip-entrance">SKIP ENTRANCE ↗</button>');
  $('#skipEntrance').onclick = () => {
    shutter.position.y = 5;
    camera.position.z = 8.8;
    active = true;
    $('#welcome').classList.add('hidden');
    $('#hud').classList.remove('hidden');
    if (isTouchDevice) {
      $('#mobileControls').classList.remove('hidden');
      $('#mobileLookHint').classList.remove('hidden');
      $('.controls').classList.add('hidden');
    }
    lock();
  };
}

$('#enter').onclick = () => {
  entering = true;
  entranceStart = performance.now();
  $('#welcome').classList.add('hidden');
  $('#hud').classList.remove('hidden');
  if (isTouchDevice) {
    $('#mobileControls').classList.remove('hidden');
    $('#mobileLookHint').classList.remove('hidden');
    $('.controls').classList.add('hidden');
  }
  notice('Opening the boutique…');
};

document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement === renderer.domElement) {
    yaw -= e.movementX * 0.0022;
    pitch -= e.movementY * 0.0022;
    pitch = Math.max(-1.2, Math.min(1.2, pitch));
    camera.rotation.order = 'YXZ';
    camera.rotation.set(pitch, yaw, 0);
  }
});

document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === 'e' && near) act(near);
  if (e.key === 'Escape' && !$('#panel').classList.contains('hidden')) closePanel();
});
document.addEventListener('keyup', (e) => (keys[e.key.toLowerCase()] = false));

let productViewerRoot = null;
function disposeViewer() {
  if (productViewerRoot) {
    productViewerRoot.unmount();
    productViewerRoot = null;
  }
}

function showPanel(html) {
  disposeViewer();
  document.exitPointerLock?.();
  $('#panelContent').innerHTML = html;
  $('#panel').classList.remove('hidden');
}

function closePanel() {
  disposeViewer();
  $('#panel').classList.add('hidden');
  if (active) lock();
}
$('#closePanel').onclick = closePanel;

function productPanel(p) {
  showPanel(`
    <div class="panel-kicker">THE ZEVARO COLLECTION</div>
    <div class="product-art viewer">
      <div id="bottleViewer"></div>
      <span class="viewer-caption">DRAG TO ROTATE · 3D PREVIEW</span>
    </div>
    <div class="panel-kicker">EAU DE PARFUM · 50 ML</div>
    <h2>${p.name}</h2>
    <div class="family">EAU DE PARFUM · 50 ML</div>
    <p>${p.desc}</p>
    <img class="product-photo" src="/assets/products/${p.slug}.webp" alt="${p.name} by Zevaro Perfumes">
    <p class="photo-caption">YOUR ZEVARO BOTTLE</p>
    <div class="price-row">
      <strong>₹${p.price}.00</strong>
      <span>50 ML · EAU DE PARFUM</span>
    </div>
    <button class="primary full" id="addCart">ADD TO TROLLEY <span>+</span></button>
    <div class="panel-note">A LITTLE LUXURY, JUST FOR YOU</div>
  `);
  productViewerRoot = createRoot($('#bottleViewer'));
  productViewerRoot.render(React.createElement(BottleViewer, { color: '#' + p.color.toString(16).padStart(6, '0'), label: '/assets/products/' + p.slug + '-label.png' }));
  $('#addCart').onclick = () => {
    cart.push(p);
    updateCart();
    notice(`${p.name} added to your trolley`);
    closePanel();
  };
}

function updateCart() {
  $('#cartCount').textContent = cart.length;
}

function cartPanel() {
  let items = cart
    .map(
      (p, i) => `
    <div class="cart-item">
      <div class="mini-bottle" style="background:#${p.color.toString(16).padStart(6, '0')}"></div>
      <div>
        <strong>${p.name}</strong>
        <small>EAU DE PARFUM · 50 ML</small>
        <button class="remove" data-index="${i}">Remove</button>
      </div>
      <b>₹${p.price}</b>
    </div>
  `
    )
    .join('');
  let total = cart.reduce((a, p) => a + p.price, 0);
  showPanel(`
    <div class="panel-kicker">YOUR SELECTION</div>
    <h2>Shopping trolley</h2>
    <p class="cart-intro">A little something special, chosen by you.</p>
    <div class="divider"></div>
    ${items || '<div class="empty-cart">Your trolley is waiting to be filled.<br><small>Explore the boutique to discover your scent.</small></div>'}
    <div class="divider"></div>
    <div class="total"><span>Subtotal</span><strong>₹${total}.00</strong></div>
    <button class="primary full" id="checkout">${cart.length ? 'CONTINUE TO CASHIER' : 'CONTINUE EXPLORING'} <span>↗</span></button>
    <div class="panel-note">THE ZEVARO COLLECTION · CHECKOUT UNAVAILABLE</div>
  `);
  document.querySelectorAll('.remove').forEach((b) => {
    b.onclick = () => {
      cart.splice(+b.dataset.index, 1);
      updateCart();
      cartPanel();
    };
  });
  $('#checkout').onclick = () => {
    if (!cart.length) {
      closePanel();
      return;
    }
    checkoutPanel();
  };
}

function checkoutPanel() {
  showPanel(`
    <div class="panel-kicker">ZEVARO PERFUMES BILLING</div>
    <h2>Billing Desk & Concierge</h2>
    <p>Meera is preparing your purchase. Bottles are wrapped in silk tissue and packaged in our luxury gold-foil embossed Zevaro shopping bag.</p>
    <div class="uniform-box">
      <strong>CASHIER STATION SPECIFICATION</strong>
      Station 01 · Ground Floor Main Desk<br>
      Attire: Tailored black trousers, ivory silk shirt, Zevaro gold badge<br>
      Equipment: Optical barcode scanner & touch POS terminal
    </div>
    <div class="divider"></div>
    <button class="primary full" id="backCart">VIEW TROLLEY <span>↗</span></button>
  `);
  $('#backCart').onclick = cartPanel;
}

function characterPanel(config) {
  const isStaff = config.isStaff;
  showPanel(`
    <div class="panel-kicker">${isStaff ? 'ZEVARO BOUTIQUE SPECIALIST' : 'ZEVARO SHOWROOM PATRON'}</div>
    <span class="character-badge">${isStaff ? '★ OFFICIAL LUXURY AMBASSADOR' : 'DISCERNING PATRON'}</span>
    <h2>${config.name}</h2>
    <div class="family">${config.title}</div>
    <p>${config.dialogueIntro}</p>

    <div class="uniform-box">
      <strong>${isStaff ? 'UNIFORM & BRANDING SPECIFICATIONS' : 'ATTIRE & STYLING'}</strong>
      ${
        isStaff && config.uniform
          ? `• Trousers: ${config.uniform.trousers}<br>• Shirt: ${config.uniform.shirt}<br>• Insignia: ${config.uniform.badge}<br>• Footwear: ${config.uniform.footwear}`
          : `• Style: ${config.clothingDescription}`
      }
    </div>

    <div class="uniform-box">
      <strong>CURRENT RETAIL ACTIVITY & DEMONSTRATION</strong>
      • <strong>Activity:</strong> ${config.activity}<br>
      • <strong>Testing Interaction:</strong> ${config.testingAction || 'Engaging with boutique fragrances'}
    </div>

    ${
      isStaff
        ? `
      <div class="advisor-options">
        <button id="viewDemoBottles">Discover Signature Fragrances <span>↗</span></button>
      </div>
    `
        : ''
    }
    <div class="panel-note">ZEVARO PERFUMES · IMMERSIVE HUMAN EXPERIENCE</div>
  `);

  if ($('#viewDemoBottles')) {
    $('#viewDemoBottles').onclick = () => {
      employeePanel();
    };
  }
}

function employeePanel() {
  showPanel(`
    <div class="panel-kicker">YOUR PERSONAL FRAGRANCE GUIDE</div>
    <div class="associate-icon">✳</div>
    <h2>Welcome to Zevaro.</h2>
    <p>Explore our collection of 50 ml Eau de Parfum. Choose a fragrance to see its bottle and olfactory profile.</p>
    <div class="advisor-options">
      ${products
        .map(
          (p, i) => `
        <button data-p="${i}">${p.name} <span>₹${p.price} ↗</span></button>
      `
        )
        .join('')}
    </div>
    <div class="panel-note">PERSONAL SERVICE, ALWAYS</div>
  `);
  document.querySelectorAll('[data-p]').forEach((b) => {
    b.onclick = () => productPanel(products[+b.dataset.p]);
  });
}

function rosterPanel() {
  const staff = CHARACTER_CONFIG.filter((c) => c.isStaff);
  const patrons = CHARACTER_CONFIG.filter((c) => !c.isStaff);
  const diagnostics = verifyCharacterAssets();

  showPanel(`
    <div class="panel-kicker">ZEVARO PERFUMES SHOWROOM DIRECTORY</div>
    <h2>Boutique Team & Patrons</h2>
    <p>All characters are configured to professional photorealistic standards: anatomically accurate proportions, realistic skin, eyes, hair, tailored staff uniforms, and distinct everyday luxury customer styling.</p>
    
    <div class="uniform-box" style="border-left:3px solid #d4af37;">
      <strong>PRODUCTION ASSET COMPLIANCE STATUS</strong>
      <span class="status-pill"><i></i> Skinned GLB Humanoid Rigs Required</span><br>
      • Negative Requirements: Zero toy-like, cartoon, or Roblox models permitted.<br>
      • Materials: Physically based skin, eye cornea, hair anisotropic roughness, and gold metalness.<br>
      • Micro-Animations: Layered thoracic breathing, randomized blinking, and camera glance enabled.
    </div>

    <div class="panel-kicker" style="margin-top:20px;">SALES CONSULTANTS & CASHIER (${staff.length})</div>
    ${staff
      .map(
        (c) => `
      <div class="roster-card">
        <span class="roster-tag staff">STAFF</span>
        <h3>${c.name}</h3>
        <span class="role-title">${c.title}</span>
        <p><strong>Activity:</strong> ${c.activity}</p>
        <p><strong>Uniform:</strong> Tailored black trousers, ivory shirt, gold Zevaro insignia badge</p>
      </div>
    `
      )
      .join('')}

    <div class="panel-kicker" style="margin-top:25px;">SHOWROOM PATRONS & SHOPPERS (${patrons.length})</div>
    ${patrons
      .map(
        (c) => `
      <div class="roster-card">
        <span class="roster-tag patron">CUSTOMER</span>
        <h3>${c.name}</h3>
        <span class="role-title">${c.title}</span>
        <p><strong>Activity:</strong> ${c.activity}</p>
        <p><strong>Attire:</strong> ${c.clothingDescription}</p>
      </div>
    `
      )
      .join('')}

    <div class="panel-note">ZEVARO LUXURY RETAIL · 14 UNIQUE INDIVIDUALS</div>
  `);
}

$('#staffBtn').onclick = rosterPanel;
$('#cartBtn').onclick = cartPanel;
$('#helpClose').onclick = () => $('.controls').classList.add('hidden');
$('#soundBtn').onclick = () => {
  if (isTouchDevice) notice('Use the joystick to move. Drag to look; tap a nearby person or bottle.');
  else rosterPanel();
};

function act(data) {
  if (data.type === 'product') productPanel(data.product);
  else if (data.type === 'character') characterPanel(data.config);
  else if (data.type === 'employee') employeePanel();
  else checkoutPanel();
}

renderer.domElement.addEventListener('click', () => {
  if (isTouchDevice || !active) return;
  if (document.pointerLockElement !== renderer.domElement) {
    lock();
    return;
  }
  if (near) act(near);
});

// Analog joystick
let joyX = 0,
  joyY = 0,
  joystickPointer = null;
window.addEventListener('blur', () => {
  keys = {};
  joyX = joyY = 0;
  joystickPointer = null;
  $('#joystickKnob').style.transform = 'translate(0px,0px)';
});
const joystick = $('#joystick'),
  knob = $('#joystickKnob');

function updateJoystick(e) {
  const r = joystick.getBoundingClientRect(),
    max = r.width * 0.32;
  let x = e.clientX - (r.left + r.width / 2),
    y = e.clientY - (r.top + r.height / 2);
  const d = Math.hypot(x, y);
  if (d > max) {
    x = (x / d) * max;
    y = (y / d) * max;
  }
  joyX = x / max;
  joyY = -y / max;
  knob.style.transform = `translate(${x}px,${y}px)`;
}

joystick.addEventListener('pointerdown', (e) => {
  if (!active || !$('#panel').classList.contains('hidden')) return;
  e.preventDefault();
  joystickPointer = e.pointerId;
  joystick.setPointerCapture(e.pointerId);
  updateJoystick(e);
});
joystick.addEventListener('pointermove', (e) => {
  if (e.pointerId === joystickPointer) {
    e.preventDefault();
    updateJoystick(e);
  }
});
function resetJoystick(e) {
  if (e.pointerId !== joystickPointer) return;
  joystickPointer = null;
  joyX = 0;
  joyY = 0;
  knob.style.transform = 'translate(0px,0px)';
}
joystick.addEventListener('pointerup', resetJoystick);
joystick.addEventListener('pointercancel', resetJoystick);
joystick.addEventListener('lostpointercapture', resetJoystick);

let touchX = null,
  touchY = null,
  touchStartX = 0,
  touchStartY = 0,
  touchMoved = false;
renderer.domElement.addEventListener(
  'touchstart',
  (e) => {
    if (!active || !$('#panel').classList.contains('hidden') || e.touches.length !== 1) return;
    touchX = touchStartX = e.touches[0].clientX;
    touchY = touchStartY = e.touches[0].clientY;
    touchMoved = false;
  },
  { passive: true }
);
renderer.domElement.addEventListener(
  'touchmove',
  (e) => {
    if (touchX === null || e.touches.length !== 1) return;
    let x = e.touches[0].clientX,
      y = e.touches[0].clientY;
    if (Math.hypot(x - touchStartX, y - touchStartY) > 8) touchMoved = true;
    yaw -= (x - touchX) * 0.005;
    pitch -= (y - touchY) * 0.005;
    pitch = Math.max(-1.2, Math.min(1.2, pitch));
    camera.rotation.order = 'YXZ';
    camera.rotation.set(pitch, yaw, 0);
    touchX = x;
    touchY = y;
  },
  { passive: true }
);
renderer.domElement.addEventListener(
  'touchend',
  (e) => {
    if (touchX === null) return;
    if (!touchMoved && active && $('#panel').classList.contains('hidden')) {
      const point = e.changedTouches[0];
      ray.setFromCamera(new THREE.Vector2((point.clientX / innerWidth) * 2 - 1, -(point.clientY / innerHeight) * 2 + 1), camera);
      let hits = ray.intersectObjects(interact, false).filter((h) => h.distance < 3.5);
      if (hits[0]) act(hits[0].object.userData);
    }
    touchX = touchY = null;
  },
  { passive: true }
);
renderer.domElement.addEventListener('touchcancel', () => {
  touchX = touchY = null;
});

function collision(x, z) {
  if (loadedCharacters.some((npc) => Math.hypot(x - npc.model.position.x, z - npc.model.position.z) < npc.radius + 0.35)) return true;
  if (Math.abs(x) > 9.35 || Math.abs(z) > 10.9) return true;
  if (x > 1.7 && x < 5.9 && z > -2.8 && z < 0) return true;
  if (x > 4.35 && x < 8.5 && z > -9.3 && z < -7.55) return true;
  for (let px of [-3.7, 3.7]) if (Math.hypot(x - px, z + 7.4) < 1) return true;
  // Consultation tables in front of racks
  if (Math.abs(x - (-7.5)) < 0.55 && (Math.abs(z - 2.0) < 1.05 || Math.abs(z - (-5.0)) < 1.05)) return true;
  if (Math.abs(x - 7.5) < 0.55 && (Math.abs(z - 2.0) < 1.05 || Math.abs(z - (-5.0)) < 1.05)) return true;
  if (Math.abs(x - (-7.1)) < 1.05 && Math.abs(z - (-8.8)) < 0.55) return true;
  return false;
}

function animate(t) {
  requestAnimationFrame(animate);

  if (entering) {
    let elapsed = (t - entranceStart) / 1000;
    let open = Math.min(elapsed / 2.8, 1);
    open = open * open * (3 - 2 * open);
    shutter.position.y = open * 5;
    let travel = Math.max(0, Math.min((elapsed - 1.7) / 3.8, 1));
    travel = travel * travel * (3 - 2 * travel);
    camera.position.z = 19.5 + (8.8 - 19.5) * travel;
    if (elapsed >= 5.5) {
      entering = false;
      active = true;
      localStorage.setItem('zevaroVisited', '1');
      notice(isTouchDevice ? 'Use the joystick to walk; drag to look.' : 'Click the scene to look around. Use WASD to walk.');
    }
  }

  let dt = Math.min((t - last) / 1000, 0.05);
  last = t;

  // Advance 10-Step Demonstration Sequence
  demoState.timer += dt;
  if (demoState.timer >= demoState.stepDurations[demoState.currentStep]) {
    demoState.timer = 0;
    demoState.currentStep = (demoState.currentStep % 10 + 1);

    if (demoState.currentStep === 4) {
      triggerMistBurst();
    }

    const stepTitles = [
      '',
      'Step 1: Perfume Selection',
      'Step 2: Cap Removal',
      'Step 3: Strip Preparation',
      'Step 4: Fragrance Spraying',
      'Step 5: Presenting Strip',
      'Step 6: Olfactory Lift',
      'Step 7: Scent Evaluation',
      'Step 8: Patron Reaction',
      'Step 9: Fragrance Breakdown',
      'Step 10: Comparative Flacon'
    ];
    if ($('#demoStepTitle')) {
      $('#demoStepTitle').textContent = stepTitles[demoState.currentStep];
      $('#demoStepDesc').textContent = demoState.stepDescriptions[demoState.currentStep];
    }
  }

  // Update Perfume Mist Particles
  if (isSprayingMist) {
    mistTimer += dt;
    const pos = mistGeometry.attributes.position.array;
    for (let i = 0; i < mistParticleCount; i++) {
      pos[i * 3] += mistVelocities[i].x * dt * 2.5;
      pos[i * 3 + 1] += mistVelocities[i].y * dt * 1.5 - dt * 0.05;
      pos[i * 3 + 2] += mistVelocities[i].z * dt * 2.5;
    }
    mistGeometry.attributes.position.needsUpdate = true;
    mistMaterial.opacity = Math.max(0, 0.85 * (1 - mistTimer / 1.8));
    if (mistTimer >= 1.8) {
      isSprayingMist = false;
      mistMaterial.opacity = 0;
    }
  }

  // Update Live Shopping Journey HUD Ticker & Checkout Props
  if (shoppingJourney) {
    const stage = shoppingJourney.stage;
    const currentInfo = SHOPPING_STAGES[stage];
    if ($('#shopperStageTitle') && currentInfo) {
      $('#shopperStageTitle').textContent = currentInfo.title;
      $('#shopperStageDesc').textContent = currentInfo.desc;
    }

    if (counterFlacon) {
      counterFlacon.visible = (stage === 2 || stage === 3);
    }
    if (cashierBag) {
      cashierBag.visible = (stage !== 6 && stage !== 7);
    }
  }

  // Character updates (Mixer, Respiration Breathing, Blinking, Head Glance, LOD)
  for (const character of loadedCharacters) {
    character.update(dt, camera.position);
  }

  if (active && $('#panel').classList.contains('hidden')) {
    let forward = (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0) + joyY,
      side = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0) + joyX;
    let len = Math.max(1, Math.hypot(forward, side));
    let dx = ((-Math.sin(yaw) * forward + Math.cos(yaw) * side) / len) * (keys.shift ? 4.7 : 3.1) * dt,
      dz = ((-Math.cos(yaw) * forward - Math.sin(yaw) * side) / len) * (keys.shift ? 4.7 : 3.1) * dt;

    if (!collision(camera.position.x + dx, camera.position.z)) camera.position.x += dx;
    if (!collision(camera.position.x, camera.position.z + dz)) camera.position.z += dz;

    ray.setFromCamera(new THREE.Vector2(0, 0), camera);
    let hits = ray.intersectObjects(interact, false).filter((h) => h.distance < 3.5);
    near = hits[0]?.object.userData || null;
    let hint = $('#hint');
    if (near) {
      hint.classList.remove('hidden');
      if (near.type === 'product') {
        hint.innerHTML = `<span>DISCOVER FRAGRANCE</span><strong>${near.product.name} · ₹${near.product.price}</strong><small>${isTouchDevice ? 'TAP BOTTLE TO EXPLORE' : 'CLICK OR PRESS E'}</small>`;
      } else if (near.type === 'character') {
        const isStaff = near.config.isStaff;
        hint.innerHTML = isStaff
          ? `<span>${near.config.title.toUpperCase()}</span><strong>${near.config.name}</strong><small>${isTouchDevice ? 'TAP TO CONSULT' : 'CLICK OR PRESS E TO CONSULT'}</small>`
          : `<span>SHOWROOM PATRON</span><strong>${near.config.name}</strong><small>${isTouchDevice ? 'TAP TO OBSERVE' : 'CLICK OR PRESS E TO OBSERVE'}</small>`;
      } else if (near.type === 'employee') {
        hint.innerHTML = `<span>PERSONAL SERVICE</span><strong>Fragrance Consultation</strong><small>${isTouchDevice ? 'TAP TO TALK' : 'CLICK OR PRESS E TO TALK'}</small>`;
      } else {
        hint.innerHTML = `<span>READY WHEN YOU ARE</span><strong>Virtual cashier</strong><small>${isTouchDevice ? 'TAP TO OPEN' : 'CLICK OR PRESS E TO CHECK OUT'}</small>`;
      }
    } else {
      hint.classList.add('hidden');
    }
  }

  renderer.render(scene, camera);
}

animate(performance.now());

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, isTouchDevice ? 1.25 : 2));
});

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.141.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.141.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, heart, scalpel;
const loader = new GLTFLoader();

init();
animate();

function init() {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 10);
  scene.add(light);

  // Load heart model
  loader.load('./realistic_human_heart (1).glb', (gltf) => {
    heart = gltf.scene;
    heart.position.set(0, 0, 0);
    heart.scale.set(0.5, 0.5, 0.5);
    scene.add(heart);
  });

  // Load scalpel model
  loader.load('./scalpel (1).glb', (gltf) => {
    scalpel = gltf.scene;
    scalpel.position.set(0, 0, 1);
    scalpel.scale.set(0.1, 0.1, 0.1);
    scene.add(scalpel);
  });

  // Raycaster for interaction
  document.addEventListener('mousemove', onMouseMove, false);
}

// Mouse movement event for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (scalpel) {
    scalpel.position.x = mouse.x * 5;
    scalpel.position.y = mouse.y * 2.5;
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Check for intersection
  if (heart && scalpel) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(heart, true);
    if (intersects.length > 0) {
      tearHeart();
    }
  }

  renderer.render(scene, camera);
}

function tearHeart() {
  heart.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0xff0000); // Change color to red to simulate tearing
      child.material.transparent = true;
      child.material.opacity = 0.7; // Adjust opacity
    }
  });
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

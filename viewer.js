import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

let model;

document.getElementById('fileInput').addEventListener('change', function(event) {
  if (model) scene.remove(model);

  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'obj') {
    const loader = new OBJLoader();
    loader.load(url, (obj) => {
      model = obj;
      model.position.set(0, 0, 0);
      scene.add(model);
    });
  } else if (ext === 'glb' || ext === 'gltf') {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      model = gltf.scene;
      model.position.set(0, 0, 0);
      scene.add(model);
    });
  } else {
    alert('Unsupported file format');
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

loader.load(url, (obj) => {
  console.log("Model loaded:", obj); // 👈 Add this
  model = obj;
  model.position.set(0, 0, 0);
  scene.add(model);
});

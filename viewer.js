import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

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

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Helpers
scene.add(new THREE.GridHelper(10, 10));
scene.add(new THREE.AxesHelper(5));

let model = null;

function fitCameraToObject(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  controls.target.copy(center);
  camera.position.copy(center);
  camera.position.x += size * 1.5;
  camera.position.y += size * 1.5;
  camera.position.z += size * 1.5;
  controls.update();
}

document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  if (model) {
    scene.remove(model);
    model = null;
  }

  const url = URL.createObjectURL(file);
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'obj') {
    const loader = new OBJLoader();
    loader.load(url, (obj) => {
      model = obj;
      model.traverse(c => {
        if (c.isMesh) c.geometry.computeVertexNormals();
      });
      scene.add(model);
      fitCameraToObject(model);
      console.log("Loaded OBJ model:", model);
    });
  } else if (ext === 'glb' || ext === 'gltf') {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      model = gltf.scene;
      scene.add(model);
      fitCameraToObject(model);
      console.log("Loaded GLTF model:", model);
    });
  } else {
    alert("Unsupported file type");
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
scene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(5, 10, 7));
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// Helpers
scene.add(new THREE.GridHelper(10, 10));
scene.add(new THREE.AxesHelper(5));

let model = null;

function fitCameraToObject(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  controls.target.copy(center);
  camera.position.copy(center).add(new THREE.Vector3(size, size, size));
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
    const loader = new THREE.OBJLoader();
    loader.load(url, (obj) => {
      model = obj;
      model.traverse(c => {
        if (c.isMesh) {
          c.geometry.computeVertexNormals();
          if (!c.material || !('color' in c.material)) {
            c.material = new THREE.MeshPhongMaterial({ color: 0x555555 });
          }
        }
      });
      scene.add(model);
      fitCameraToObject(model);
    });
  } else if (ext === 'glb' || ext === 'gltf') {
    const loader = new THREE.GLTFLoader();
    loader.load(url, (gltf) => {
      model = gltf.scene;
      model.traverse(c => {
        if (c.isMesh && (!c.material || !('color' in c.material))) {
          c.material = new THREE.MeshPhongMaterial({ color: 0x555555 });
        }
      });
      scene.add(model);
      fitCameraToObject(model);
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

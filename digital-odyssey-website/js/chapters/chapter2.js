// --- 3D Model Loader ---
function load3DModel(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  camera.position.z = 5;
  let model;

  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  const loader = new THREE.GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    'assets/models/mac-draco.glb',
    function (gltf) {
      model = gltf.scene;
      model.scale.set(2, 2, 2);
      model.rotation.y = Math.PI * 0.8; // Initial rotation
      scene.add(model);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Return a function to update the model's rotation
  return (rotationY) => {
    if (model) {
      model.rotation.y = rotationY;
    }
  };
}

// --- Chapter 2 Setup ---
export function setupChapter2() {
  const modelContainer = document.querySelector('.chapter-2-asset-container');
  const updateModelRotation = load3DModel(modelContainer);

  const scrolly = Scrollytelling.create({
    trigger: '#chapter-2-revolution',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
  });

  // Manually pin the element
  scrolly.getTimeline().add(
    gsap.to('#chapter-2-revolution .pin-container', {
      scrollTrigger: {
        trigger: '#chapter-2-revolution',
        start: 'top top',
        end: 'bottom bottom',
        pin: true,
      },
    }),
  );

  // Animate the chapter intro text
  scrolly.addAnimation({
    target: '#chapter-2-revolution .chapter-intro',
    tween: [
      { start: 0, end: 20, to: { opacity: 1 } },
      { start: 80, end: 100, to: { opacity: 0 } },
    ],
  });

  // Animate the 3D model container
  scrolly.addAnimation({
    target: '.chapter-2-asset-container',
    tween: {
      start: 10,
      end: 90,
      to: { opacity: 1 },
    },
  });

  // Rotate the 3D model on scroll
  scrolly.addAnimation({
    target: null, // No specific target, we're just using the tween to get a value
    tween: {
      start: 0,
      end: 100,
      onUpdate: (self) => {
        // Use the progress of the tween to control rotation
        const rotation = Math.PI * 0.8 - self.progress * Math.PI * 1.5;
        updateModelRotation(rotation);
      },
      ease: 'power1.inOut',
    },
  });

  return scrolly;
}

import { Scrollytelling } from '../dist/index.mjs';

let scrolly1;
let scrolly2;

function initializeScrollytelling() {
  // Destroy any existing instances before creating new ones
  if (scrolly1) scrolly1.destroy();
  if (scrolly2) scrolly2.destroy();

  console.log("Initializing Scrollytelling instances...");

  // --- Instance 1 ---
  scrolly1 = Scrollytelling.create({
    trigger: '#scrolly-container',
    pin: '.sticky-content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
  });

  scrolly1.addAnimation({
    target: '#simple-animation',
    tween: {
      start: 5,
      end: 20,
      to: { opacity: 1, scale: 1.2 },
    },
  });

  // Advanced Test 1: Complex/Overlapping Animations
  scrolly1.addAnimation({
      target: '#complex-animation',
      tween: {
          start: 10,
          end: 30,
          fromTo: [{ x: '-100vw' }, { x: '100vw', rotation: 360 }]
      }
  });
  scrolly1.addAnimation({
      target: '#complex-animation',
      tween: {
          start: 25, // Overlaps with the previous animation
          end: 40,
          to: { backgroundColor: '#333' }
      }
  });


  scrolly1.addParallax({
    target: '#parallax-element',
    tween: {
      start: 25,
      end: 45,
      movementY: '-50vh',
    },
  });

  scrolly1.addStagger({
    targets: '.stagger-item',
    tween: {
      start: 50,
      end: 70,
      from: { y: 100, opacity: 0 },
    },
    overlap: 0.1,
  });

  // Advanced Test 2: Waypoint with a Tween
  const waypointIndicator = document.getElementById('waypoint-indicator');
  scrolly1.addWaypoint({
    at: 75,
    label: 'my-waypoint',
    onCall: () => {
      console.log('Waypoint reached!');
      waypointIndicator.style.backgroundColor = 'lime';
    },
    onReverseCall: () => {
        console.log('Waypoint reverse reached!');
        waypointIndicator.style.backgroundColor = 'red';
    },
    tween: {
        target: '#waypoint-tween-element',
        to: { scale: 1, rotation: 180 }
    }
  });

  // --- Instance 2 (Independent) ---
  scrolly2 = Scrollytelling.create({
      trigger: '#scrolly-container-2',
      start: 'top center',
      end: 'bottom bottom',
      scrub: 0.5
  });

  scrolly2.addAnimation({
      target: '#second-instance-animation',
      tween: {
          start: 0,
          end: 100,
          fromTo: [{ opacity: 0, y: 100 }, { opacity: 1, y: 0 }]
      }
  });

  console.log("Scrollytelling instance 1 created:", scrolly1);
  console.log("Scrollytelling instance 2 created:", scrolly2);
}

function destroyScrollytelling() {
  if (scrolly1) {
    scrolly1.destroy();
    scrolly1 = null;
  }
  if (scrolly2) {
      scrolly2.destroy();
      scrolly2 = null;
  }
  console.log("All instances destroyed.");
  // Reset visual indicators
  document.getElementById('waypoint-indicator').style.backgroundColor = 'red';
  document.getElementById('waypoint-tween-element').style.transform = 'scale(0)';
}

// Event Listeners
document.getElementById('init-btn').addEventListener('click', initializeScrollytelling);
document.getElementById('destroy-btn').addEventListener('click', destroyScrollytelling);
document.getElementById('scroll-to-label-btn').addEventListener('click', () => {
  if (scrolly1) {
    scrolly1.scrollToLabel('my-waypoint', { behavior: 'smooth', offset: 50 });
  } else {
    console.warn("Initialize Scrollytelling first!");
  }
});

// Initialize on page load
initializeScrollytelling();

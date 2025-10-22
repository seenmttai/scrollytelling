// --- GSAP and Scrollytelling Setup ---
gsap.registerPlugin(ScrollTrigger);

// --- Chapter 1: The Giants ---
function setupChapter1() {
  const scrolly = Scrollytelling.create({
    trigger: '#chapter-1',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  });

  scrolly.addAnimation({
    target: '#chapter-1 .chapter-intro',
    tween: [
      { start: 5, end: 25, to: { opacity: 1 } },
      { start: 75, end: 95, to: { opacity: 0 } },
    ],
  });

  scrolly.addAnimation({
    target: '.chapter-1-asset',
    tween: [
      { start: 10, end: 40, to: { opacity: 1, scale: 1.1 } },
      { start: 60, end: 90, to: { opacity: 0, scale: 1 } },
    ],
  });

  return scrolly;
}

// --- Chapter 2: The Personal Revolution ---
function setupChapter2() {
  const scrolly = Scrollytelling.create({
    trigger: '#chapter-2',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
  });

  scrolly.addAnimation({
    target: '#chapter-2 .chapter-intro',
    tween: [
      { start: 5, end: 25, to: { opacity: 1 } },
      { start: 75, end: 95, to: { opacity: 0 } },
    ],
  });

  scrolly.addAnimation({
    target: '.chapter-2-asset',
    tween: {
      start: 15,
      end: 85,
      to: { opacity: 1, scale: 1, rotation: -5, ease: 'power2.out' },
    },
  });

  return scrolly;
}

// --- Chapter 3: The Pocket Powerhouse ---
function setupChapter3() {
    const scrolly = Scrollytelling.create({
        trigger: '#chapter-3',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
    });

    scrolly.addAnimation({
        target: '#chapter-3 .chapter-intro',
        tween: [
            { start: 5, end: 25, to: { opacity: 1 } },
            { start: 80, end: 95, to: { opacity: 0 } },
        ],
    });

    scrolly.addAnimation({
        target: '.chapter-3-asset',
        tween: [
            { start: 10, end: 50, to: { y: 0, ease: 'power2.out' } },
            { start: 70, end: 90, to: { y: '-100vh', ease: 'power2.in' } },
        ],
    });

    return scrolly;
}

// --- Chapter 4: The Connected Age ---
function setupChapter4() {
    const scrolly = Scrollytelling.create({
        trigger: '#chapter-4',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
    });

    scrolly.addAnimation({
        target: '#chapter-4 .chapter-intro',
        tween: [
            { start: 5, end: 25, to: { opacity: 1 } },
            { start: 75, end: 95, to: { opacity: 0 } },
        ],
    });

    scrolly.addAnimation({
        target: '.chapter-4-asset',
        tween: {
            start: 10,
            end: 90,
            to: { opacity: 1, scale: 1, rotation: 45, ease: 'power1.inOut' },
        },
    });

    scrolly.addWaypoint({
        at: 50,
        onCall: () => console.log('Chapter 4 Midpoint Reached'),
    });

    return scrolly;
}

// --- Chapter 5: The Data Explosion (Horizontal) ---
function setupChapter5() {
    const scrolly = Scrollytelling.create({
        trigger: '#chapter-5',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
    });

    // Animate the horizontal track
    scrolly.addAnimation({
        target: '.horizontal-track',
        tween: {
            start: 0,
            end: 100,
            to: {
                x: () => -(document.querySelector('.horizontal-track').scrollWidth - window.innerWidth),
                ease: 'none',
            },
        },
    });

    // Animate elements within the horizontal track
    scrolly.addAnimation({
        target: '.chapter-5-asset',
        tween: {
            start: 20,
            end: 80,
            to: {
                opacity: 1,
                scale: 1.1,
            }
        }
    });

    return scrolly;
}

// --- Chapter 6: The Immersive Web ---
function setupChapter6() {
    // 1. Create the stagger grid items
    const grid = document.querySelector('.stagger-grid');
    const gridSize = 10;
    const totalItems = gridSize * gridSize;
    for (let i = 0; i < totalItems; i++) {
        const item = document.createElement('div');
        item.classList.add('stagger-item');
        grid.appendChild(item);
    }

    // 2. Set up the Scrollytelling instance
    const scrolly = Scrollytelling.create({
        trigger: '#chapter-6',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
    });

    scrolly.addAnimation({
        target: '#chapter-6 .chapter-intro',
        tween: [
            { start: 0, end: 15, to: { opacity: 1 } },
            { start: 85, end: 100, to: { opacity: 0 } },
        ],
    });

    // 3. Add the massive stagger animation
    scrolly.addStagger({
        targets: '.stagger-item',
        tween: {
            start: 10,
            end: 90,
            to: {
                opacity: 1,
                scale: 0.5,
                backgroundColor: '#e6e6e6',
            },
        },
        overlap: 0.5,
    });

    // 4. Set up and drive the canvas animation
    const canvas = document.getElementById('chapter-6-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    let particle = { x: 0, y: height / 2, radius: 10 };

    scrolly.on('update', (progress) => {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Update particle position based on scroll progress
        particle.x = progress * width;

        // Draw particle
        ctx.fillStyle = 'rgba(74, 144, 226, 0.8)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    return scrolly;
}


// --- Main Application Logic ---
function main() {
  // A simple fade-in for the header
  gsap.from('.header-content', {
    opacity: 0,
    duration: 1.5,
    delay: 0.5,
    ease: 'power2.out',
  });

  // Initialize each chapter's animations
  const chapters = [
    setupChapter1(),
    setupChapter2(),
    setupChapter3(),
    setupChapter4(),
    setupChapter5(),
    setupChapter6(),
  ].filter(Boolean); // Filter out any undefined results

  // --- Cleanup Logic ---
  window.addEventListener('beforeunload', () => {
    chapters.forEach(chapter => chapter && chapter.destroy());
  });
}

// --- DOMContentLoaded ---
window.addEventListener('DOMContentLoaded', main);

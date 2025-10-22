import { setupChapter1 } from './chapters/chapter1.js';
import { setupChapter2 } from './chapters/chapter2.js';
import { setupChapter3 } from './chapters/chapter3.js';
import { setupChapter4 } from './chapters/chapter4.js';

// --- GSAP and Scrollytelling Setup ---
gsap.registerPlugin(ScrollTrigger);

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
  const chapter1 = setupChapter1();
  const chapter2 = setupChapter2();
  const chapter3 = setupChapter3();
  const chapter4 = setupChapter4();

  // --- Cleanup Logic ---
  // This is crucial for SPAs or if you need to re-initialize
  window.addEventListener('beforeunload', () => {
    chapter1.destroy();
    chapter2.destroy();
    chapter3.destroy();
    chapter4.destroy();
  });
}

// --- DOMContentLoaded ---
// Ensures the DOM is fully loaded before running the main script
window.addEventListener('DOMContentLoaded', main);

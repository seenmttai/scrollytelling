export function setupChapter3() {
  const scrolly = Scrollytelling.create({
    trigger: '#chapter-3-pocket',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  });

  // Manually pin the element
  scrolly.getTimeline().add(
    gsap.to('#chapter-3-pocket .pin-container', {
      scrollTrigger: {
        trigger: '#chapter-3-pocket',
        start: 'top top',
        end: 'bottom bottom',
        pin: true,
      },
    }),
  );

  // Animate the chapter intro text
  scrolly.addAnimation({
    target: '#chapter-3-pocket .chapter-intro',
    tween: [
      { start: 0, end: 20, to: { opacity: 1 } },
      { start: 80, end: 100, to: { opacity: 0 } },
    ],
  });

  // Animate the iPhone SVG sliding in and out
  scrolly.addAnimation({
    target: '.chapter-3-asset',
    tween: [
      {
        start: 10,
        end: 50,
        to: {
          y: 0, // Slides to its original position
          ease: 'power2.out',
        },
      },
      {
        start: 70,
        end: 90,
        to: {
          y: '-100vh', // Slides up and out of view
          ease: 'power2.in',
        },
      },
    ],
  });

  return scrolly;
}

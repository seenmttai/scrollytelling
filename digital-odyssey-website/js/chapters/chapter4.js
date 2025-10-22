export function setupChapter4() {
  const scrolly = Scrollytelling.create({
    trigger: '#chapter-4-connected',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
  });

  // Manually pin the element
  scrolly.getTimeline().add(
    gsap.to('#chapter-4-connected .pin-container', {
      scrollTrigger: {
        trigger: '#chapter-4-connected',
        start: 'top top',
        end: 'bottom bottom',
        pin: true,
      },
    }),
  );

  // Animate the chapter intro text
  scrolly.addAnimation({
    target: '#chapter-4-connected .chapter-intro',
    tween: [
      { start: 0, end: 20, to: { opacity: 1 } },
      { start: 80, end: 100, to: { opacity: 0 } },
    ],
  });

  // Animate the circuit board SVG
  scrolly.addAnimation({
    target: '.chapter-4-asset',
    tween: {
      start: 10,
      end: 90,
      to: {
        opacity: 1,
        scale: 1,
        rotation: 45, // Rotate the circuit board
        ease: 'power1.inOut',
      },
    },
  });

  // Add a waypoint to log a message to the console
  scrolly.addWaypoint({
    at: 50,
    label: 'midpoint',
    onCall: () => {
      console.log('Chapter 4 midpoint reached!');
    },
  });

  return scrolly;
}

export function setupChapter1() {
  const scrolly = Scrollytelling.create({
    trigger: '#chapter-1-giants',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  });

  // Manually pin the element since it's not part of the library
  scrolly.getTimeline().add(
    gsap.to('#chapter-1-giants .pin-container', {
      scrollTrigger: {
        trigger: '#chapter-1-giants',
        start: 'top top',
        end: 'bottom bottom',
        pin: true,
      },
    }),
  );

  // Animate the chapter intro text
  scrolly.addAnimation({
    target: '#chapter-1-giants .chapter-intro',
    tween: [
      { start: 0, end: 20, to: { opacity: 1 } },
      { start: 80, end: 100, to: { opacity: 0 } },
    ],
  });

  // Animate the ENIAC SVG
  scrolly.addAnimation({
    target: '.chapter-1-asset',
    tween: [
      {
        start: 10,
        end: 70,
        to: {
          opacity: 1,
          scale: 1.2,
          ease: 'power2.inOut',
        },
      },
      {
        start: 80,
        end: 100,
        to: {
          opacity: 0,
          scale: 1,
          ease: 'power2.in',
        },
      },
    ],
  });

  return scrolly;
}

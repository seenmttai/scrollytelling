# @bsmnt/scrollytelling-vanilla Showcase: The Digital Odyssey

This showcase is a sophisticated demonstration of the `@bsmnt/scrollytelling-vanilla` library, taking you on an interactive journey through the history of computing.

## How to Run

This project requires a simple build step to ensure it's using the latest version of the library from the monorepo.

**1. Build the Library:**

First, build the core `scrollytelling-vanilla` library. From the root of the repository, run:

```bash
cd scrollytelling-vanilla
yarn install
yarn build
```

**2. Copy the Build Artifact:**

Next, copy the generated browser-compatible file into this showcase's directory:

```bash
cd ..
# (You should be back at the repository root)
cp scrollytelling-vanilla/dist/index.global.js showcase/js/scrollytelling.js
```

**3. Run a Local Server:**

Finally, start a local web server from within the `showcase` directory:

```bash
cd showcase
python3 -m http.server 8000
```

You can now open your browser and navigate to `http://localhost:8000` to see the showcase in action.

## Chapter Implementations

This showcase demonstrates a wide range of the library's features:

*   **Chapters 1-4:** Demonstrate core `addAnimation` and `addWaypoint` functionality with various tweens.
*   **Chapter 5:** Showcases a horizontal scrolling section, a common and powerful scrollytelling technique.
*   **Chapter 6:** Implements a massive stagger animation with `addStagger` and uses an `on('update')` listener to drive a `<canvas>` animation, demonstrating advanced integration possibilities.

### A Note on the 3D Animation (Chapter 2)

The original creative brief for this showcase included a complex 3D animation of a personal computer assembling itself for Chapter 2. This implementation uses a 2D SVG as a placeholder.

A full 3D implementation would require integrating a library like **Three.js** and would involve the following steps within the `setupChapter2` function:
1.  Setting up a Three.js scene, camera, and renderer.
2.  Loading a 3D model (e.g., in `.glb` format).
3.  Using an `on('update')` listener from the scrollytelling instance to scrub through a Three.js `AnimationMixer` or to manually update the position and rotation of the model's components based on scroll progress.

This remains a future enhancement for this showcase.

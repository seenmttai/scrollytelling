# BSMNT Scrollytelling

### Dev:

- Run docs with `yarn dev`
- On `/website` set `env` urls accordingly and run site with `yarn dev`
- Dev on `${SITE_URL}/docs`




# BSMNT Scrollytelling Documentation

## Introduction

**BSMNT Scrollytelling** is a React library for creating powerful, scroll-based animations. It's built on top of the industry-standard GSAP and its ScrollTrigger plugin but provides a declarative, component-based API that abstracts away the complexities of managing timelines and effects in a React environment.

### Why BSMNT Scrollytelling?

Building scroll-triggered animations directly with GSAP in React often involves manual setup with `useEffect`, careful cleanup logic, and a time-based way of thinking about animations. This library was created to solve these challenges by offering:

*   **A Declarative, Component-Based API:** Describe your animations with props instead of writing imperative setup code.
*   **Sensible Defaults:** Common settings like `scrub: true` are enabled by default, getting you animating faster.
*   **Automatic Cleanup:** The library handles the mounting, unmounting, and cleanup of GSAP animations, preventing memory leaks.
*   **Progress-Based Timelines:** Define animations based on scroll progress (e.g., "start at 20%, end at 80%") instead of time-based durations, making complex sequences intuitive.
*   **React Server Components (RSC) Compatibility:** While the components themselves use `'use client'`, they can be seamlessly integrated into RSC-based applications like Next.js App Router.

### Who Is This For?

This library is designed for React developers who want to create sophisticated scrollytelling experiences without the boilerplate of managing GSAP instances, timelines, and `useEffect` hooks directly. It's suitable for both those new to GSAP and experienced animators looking for a more React-friendly workflow.

---

## Core Concepts

Understanding two key concepts is essential to mastering BSMNT Scrollytelling.

### 1. The `<Root>` Timeline

Everything starts with the `<Scrollytelling.Root>` component. Think of it as creating a "stage" or a "timeline" that is linked to a portion of the user's scroll. You define the start and end of this stage using GSAP's `ScrollTrigger` syntax.

*   **`start="top top"`** means the timeline begins when the top of the `<Root>` container hits the top of the viewport.
*   **`end="bottom bottom"`** means the timeline ends when the bottom of the `<Root>` container hits the bottom of the viewport.

The total scroll distance between these `start` and `end` points becomes the duration of your animation timeline.

### 2. Percentage-Based Child Animations

All animations inside a `<Root>` component (like `<Animation>`, `<Parallax>`, etc.) operate on a simple **0% to 100%** progress scale relative to that `<Root>`'s timeline.

*   `start: 0` means the animation begins exactly when the `<Root>` timeline starts.
*   `end: 100` means the animation finishes exactly when the `<Root>` timeline ends.
*   `start: 25, end: 75` means the animation will take place during the middle 50% of the `<Root>`'s total scroll duration.

This abstraction is the core power of the library. It lets you think about complex sequences in terms of relative progress, making it incredibly intuitive to orchestrate animations.

---

## Getting Started

### Installation

The library requires `gsap` as a peer dependency.

```bash
# With pnpm
pnpm add @bsmnt/scrollytelling gsap

# With yarn
yarn add @bsmnt/scrollytelling gsap

# With npm
npm i @bsmnt/scrollytelling gsap
```

### Basic Usage

Here is a simple example of fading and scaling a heading as you scroll through a `200vh` section.

```jsx
import * as Scrollytelling from "@bsmnt/scrollytelling";

export default function MyComponent() {
  return (
    <>
      <div style={{ height: "100vh", display: "grid", placeContent: "center" }}>
        <h1>Scroll Down</h1>
      </div>

      <Scrollytelling.Root>
        <div style={{ height: "200vh" }}>
          <Scrollytelling.Pin childHeight="100vh" pinSpacerHeight="200vh">
            <div style={{ display: "grid", placeContent: "center", height: "100%" }}>
              <Scrollytelling.Animation
                tween={{
                  start: 0,
                  end: 100,
                  from: { opacity: 0, scale: 0.5 },
                  to: { opacity: 1, scale: 1.5 },
                }}
              >
                <h1 style={{ fontSize: "5rem" }}>Hello, Scrollytelling!</h1>
              </Scrollytelling.Animation>
            </div>
          </Scrollytelling.Pin>
        </div>
      </Scrollytelling.Root>

      <div style={{ height: "100vh" }} />
    </>
  );
}
```

---

## API Reference

### `<Root>`

The main provider component that creates the GSAP timeline and `ScrollTrigger` instance. All other Scrollytelling components must be children of a `<Root>`.

| Prop | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `children` | `React.ReactNode` | The content and animation components to be controlled by this timeline. | - |
| `start` | `string \| number` | The `ScrollTrigger` start position. See [GSAP docs](https://greensock.com/docs/v3/Plugins/ScrollTrigger/start). | `"top top"` |
| `end` | `string \| number` | The `ScrollTrigger` end position. See [GSAP docs](https://greensock.com/docs/v3/Plugins/ScrollTrigger/end). | `"bottom bottom"` |
| `scrub` | `boolean \| number` | Links the animation progress directly to the scrollbar. `true` for direct linking, or a number (e.g., `1`) for a smooth "catch-up" effect. | `true` |
| `trigger` | `Element \| string` | An optional, explicit trigger element. If not provided, the `<Root>` component's own element is used as the trigger. | The component itself |
| `debug` | `object` | Enables debugging features. See [debug props](#debug-props) below. | `false` |
| `disabled` | `boolean` | If `true`, disables all child animations and tears down the GSAP timeline. | `false` |
| `callbacks` | `object` | An object of `ScrollTrigger` callbacks like `onEnter`, `onLeave`, `onUpdate`, etc. | - |
| `defaults` | `object` | An object of default GSAP `TweenVars` to apply to all child animations. | - |
| `toggleActions`| `string` | Defines behavior at the four toggle points (`onEnter`, `onLeave`, etc.). See [GSAP docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/#config-object). | - |

#### `debug` Props

The `debug` prop is an object that can contain the following properties:

| Prop | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | **Required.** A unique name for this timeline, displayed in the Visualizer. |
| `markers` | `boolean` | If `true`, shows GSAP's default start/end markers. |
| `visualizer` | `boolean` | If `true`, includes this timeline in the Scrollytelling Visualizer panel. Defaults to `true` if `debug` is used. |

#### Usage

```jsx
<Scrollytelling.Root
  start="top top"
  end="bottom top"
  scrub={0.5}
  debug={{ label: "My Section" }}
>
  {/* Animation components go here */}
</Scrollytelling.Root>
```

### `<Animation>`

The core component for creating animations on the timeline. It takes a `tween` prop that defines what to animate and when.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `tween` | `object \| object[]` | A single tween object or an array of tween objects to define the animation. See [tween object](#tween-object) below. |
| `children` | `React.ReactNode` | Optional. If provided, the animation will target the child element. |
| `disabled` | `boolean` | If `true`, this specific animation will be disabled. |

#### The `tween` Object

A tween object defines a single animation segment.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `start` | `number` | The start point of the animation as a percentage (0-100) of the parent `<Root>` timeline. |
| `end` | `number` | The end point of the animation as a percentage (0-100). |
| `from` | `object` | A GSAP `TweenVars` object defining the starting state of the animation. |
| `to` | `object` | A GSAP `TweenVars` object defining the ending state of the animation. |
| `fromTo`| `[object, object]` | An array containing two GSAP `TweenVars` objects: `[fromState, toState]`. |
| `target` | `string \| Element` | Optional. A selector string or element to target. If not provided, it targets the component's `children`. |

#### Usage

```jsx
// Single animation targeting its child
<Scrollytelling.Animation
  tween={{ start: 0, end: 50, from: { y: 100, opacity: 0 } }}
>
  <h1>Animate Me</h1>
</Scrollytelling.Animation>

// Multi-stage animation targeting a different element
<Scrollytelling.Animation
  tween={[
    { start: 50, end: 80, target: "#box", to: { rotate: 360 } },
    { start: 80, end: 100, target: "#box", to: { scale: 0.5 } },
  ]}
/>
```

### `<Pin>`

A helper component to create a "sticky" element that stays pinned while the user scrolls through its designated section. This is a fundamental building block for scrollytelling.

| Prop | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `pinSpacerHeight` | `string \| number` | **Required.** The total height of the scrollable section. This defines how long the content will be pinned. E.g., `"300vh"`. | - |
| `childHeight` | `string \| number` | **Required.** The height of the content that will be pinned. This is often `"100vh"`. | - |
| `children` | `React.ReactNode` | The content that will be pinned. | - |
| `top` | `string \| number` | The `top` offset for the sticky position. E.g., `0` or `"50px"`. | `0` |
| `pinSpacerClassName`| `string` | Optional CSS class for the spacer element. | - |
| `childClassName` | `string` | Optional CSS class for the sticky child element. | - |

#### Usage

```jsx
<Scrollytelling.Root>
  {/* This section will allow you to scroll for 300vh while the content remains pinned */}
  <Scrollytelling.Pin
    pinSpacerHeight="300vh"
    childHeight="100vh"
    top={0}
  >
    <div style={{ background: 'blue', height: '100%', width: '100%' }}>
      <h1>I am Pinned!</h1>
      {/* Other animations can go inside here */}
    </div>
  </Scrollytelling.Pin>
</Scrollytelling.Root>
```

### `<Parallax>`

A simplified wrapper around `<Animation>` for creating parallax effects.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `tween` | `object` | The parallax configuration object. See [parallax tween props](#parallax-tween-props) below. |
| `children` | `React.ReactNode` | The element to apply the parallax effect to. |
| `disabled` | `boolean` | If `true`, this parallax animation will be disabled. |

#### Parallax `tween` Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `start` | `number` | The start point of the parallax effect (0-100). |
| `end` | `number` | The end point of the parallax effect (0-100). |
| `movementX` | `UnitValue` | Optional. The amount of horizontal movement. E.g., `{ value: 100, unit: 'px' }`. |
| `movementY` | `UnitValue` | Optional. The amount of vertical movement. E.g., `{ value: -50, unit: '%' }`. |

**Note:** At least one of `movementX` or `movementY` is required.

#### Usage

```jsx
<Scrollytelling.Parallax
  tween={{
    start: 0,
    end: 100,
    movementY: { value: 100, unit: "px" },
  }}
>
  <img src="/my-image.jpg" alt="" />
</Scrollytelling.Parallax>
```

### `<Stagger>`

Animates a group of elements with a staggered delay, creating sequential or overlapping animations.

| Prop | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `tween` | `object` | A single tween definition that will be applied to all staggered elements. | - |
| `children` | `React.ReactNode[]` | An array of child elements to stagger. | - |
| `overlap` | `number` | A value from 0 to 1 indicating how much the animations should overlap. `0` is sequential, `1` is simultaneous. | `0` |
| `disabled` | `boolean` | If `true`, this stagger animation will be disabled. | `false`|

#### Usage

```jsx
<Scrollytelling.Stagger
  overlap={0.2}
  tween={{
    start: 0,
    end: 100,
    from: { opacity: 0, y: 50 },
  }}
>
  <p>First</p>
  <p>Second</p>
  <p>Third</p>
</Scrollytelling.Stagger>
```

### `<Waypoint>`

Triggers a callback or a one-off animation at a specific percentage point in the timeline.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `at` | `number` | **Required.** The percentage (0-100) on the timeline to trigger the event. |
| `onCall` | `() => void` | A callback function to execute when scrolling forward past the `at` point. |
| `onReverseCall`| `() => void` | A callback function to execute when scrolling backward past the `at` point. |
| `tween` | `object` | A one-off GSAP animation to play. Must include a `duration`. Does not scrub with the timeline. |
| `label` | `string` | Assigns a named label to this point on the timeline, which can be used with `useScrollToLabel`. |
| `disabled` | `boolean` | If `true`, this waypoint will be disabled. |

#### Usage

```jsx
import confetti from 'canvas-confetti';

// ...

<Scrollytelling.Root>
  {/* Trigger a function at the halfway point */}
  <Scrollytelling.Waypoint at={50} onCall={() => confetti()} label="confetti-time" />

  {/* Trigger a one-off animation at the 75% mark */}
  <Scrollytelling.Waypoint
    at={75}
    tween={{
      target: "body",
      to: { backgroundColor: "black" },
      duration: 0.5,
    }}
  />
</Scrollytelling.Root>
```

### `<ImageSequenceCanvas>`

A helper component for creating scroll-driven image sequence animations on an HTML `<canvas>`.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `controllerRef` | `React.ForwardedRef` | **Required.** A ref to control the canvas. See usage below. |
| `getFrameSrc` | `(frame, support) => string` | **Required.** A function that returns the image URL for a given frame number. |
| `width` | `number` | **Required.** The native width of the canvas element. |
| `height` | `number` | **Required.** The native height of the canvas element. |

#### The `controllerRef` Object

The `controllerRef` provides access to methods for controlling the canvas:

*   `draw(frame: number)`: Draws the specified image frame onto the canvas.
*   `preload(start: number, end: number)`: Preloads a range of image frames.
*   `canvas`: The underlying `<canvas>` element.

#### Usage

This component is controlled by an `<Animation>` component that updates the frame on scroll.

```jsx
import * as Scrollytelling from "@bsmnt/scrollytelling";
import { useRef } from "react";

const TOTAL_FRAMES = 150;

function MyImageSequence() {
  const controller = useRef(null);

  return (
    <Scrollytelling.Root end={`+=${TOTAL_FRAMES * 15}px`}>
      <Scrollytelling.Pin childHeight="100vh" pinSpacerHeight="300vh">
        <Scrollytelling.ImageSequenceCanvas
          controllerRef={controller}
          width={1920}
          height={1080}
          getFrameSrc={(frame) => `/sequence/frame_${frame.toString().padStart(4, '0')}.jpg`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Scrollytelling.Animation
          tween={{
            start: 0,
            end: 100,
            to: {
              onUpdate: () => {
                const progress = gsap.getProperty(
                  // Get the animation's own progress
                  gsap.getById('image-sequence-tween'), 'progress'
                );
                const frame = Math.round(progress * (TOTAL_FRAMES - 1));
                controller.current?.draw(frame);
              },
            },
            id: 'image-sequence-tween' // Give the tween an ID to reference it
          }}
        />
      </Scrollytelling.Pin>
    </Scrollytelling.Root>
  );
}
```

### Hooks and Utilities

#### `useScrollytelling()`

A hook that provides direct access to the parent `<Root>`'s context, including the raw GSAP timeline. Use this for advanced cases where you need to interact with the timeline imperatively.

```jsx
import { useScrollytelling } from "@bsmnt/scrollytelling";
import { useEffect } from "react";

function AdvancedComponent() {
  const { timeline } = useScrollytelling();

  useEffect(() => {
    if (timeline) {
      // You can now add custom tweens or control the timeline directly
      console.log("Timeline progress:", timeline.progress());
    }
  }, [timeline]);

  return <div>...</div>;
}
```

#### `useScrollToLabel(label, opts)`

A hook that returns a function to programmatically scroll the user to a specific `label` on the timeline (set via `<Waypoint>`).

| Argument | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | The label name to scroll to. |
| `opts` | `object` | Optional configuration: `{ behavior: 'smooth' \| 'auto', offset: number }`. |

```jsx
import { useScrollToLabel } from "@bsmnt/scrollytelling";

function MyPage() {
  const scrollToConfetti = useScrollToLabel("confetti-time", { behavior: 'smooth' });

  return (
    <>
      <button onClick={scrollToConfetti}>Jump to Confetti</button>
      <Scrollytelling.Root>
        ...
        <Scrollytelling.Waypoint at={75} label="confetti-time" />
        ...
      </Scrollytelling.Root>
    </>
  )
}
```

#### `<RegisterGsapPlugins>`

A utility component to register premium or custom GSAP plugins (like `SplitText`, `DrawSVGPlugin`, etc.) before any animations are created.

```jsx
import { RegisterGsapPlugins } from "@bsmnt/scrollytelling";
import { SplitText } from "gsap/SplitText";

function App() {
  return (
    <>
      {/* Register the plugin once at the top level */}
      <RegisterGsapPlugins plugins={[SplitText]} />

      <Scrollytelling.Root>
        {/* Now you can use SplitText in your animations */}
      </Scrollytelling.Root>
    </>
  )
}
```

---

## The Visualizer

The Scrollytelling Visualizer is a powerful debugging tool that gives you a visual representation of all your timelines and animations.

### How to Use

Enable it by adding the `debug` prop to your `<Root>` component:

```jsx
<Scrollytelling.Root debug={{ label: "Hero Animations" }}>
  ...
</Scrollytelling.Root>
```

### Features

*   **Timeline Panel:** A draggable panel shows all active timelines.
*   **Timeline Selector:** A dropdown lets you switch between different `<Root>` timelines if you have multiple on a page.
*   **Visual Tween Representation:** Each `<Animation>` appears as a block on the timeline, showing its start, end, and duration.
*   **Live Progress Indicator:** A playhead moves along the timeline as you scroll, showing the current progress and which animations are active.
*   **Target Highlighting:** Hovering over a tween in the visualizer will highlight the element it's targeting on the page.
*   **Click to Scroll:** Clicking a tween in the visualizer will smoothly scroll your page to the point where that animation starts.

---

## Advanced Patterns & Recipes

### Horizontal Scroll

To create a horizontal scroll effect, use a `<Pin>` component containing a very wide element. Then, use an `<Animation>` to tween the `xPercent` property of that wide element.

```jsx
<Scrollytelling.Root>
  <Scrollytelling.Pin pinSpacerHeight="400vh" childHeight="100vh">
    <div style={{ overflow: 'hidden', height: '100vh', width: '100vw' }}>
      <Scrollytelling.Animation
        tween={{
          start: 0,
          end: 100,
          from: { xPercent: 0 },
          to: { xPercent: -75 }, // Move left by 75% of the element's width
        }}
      >
        <div style={{ width: '400vw', display: 'flex' }}>
          <div style={{ width: '100vw' }}>Section 1</div>
          <div style={{ width: '100vw' }}>Section 2</div>
          <div style={{ width: '100vw' }}>Section 3</div>
          <div style={{ width: '100vw' }}>Section 4</div>
        </div>
      </Scrollytelling.Animation>
    </div>
  </Scrollytelling.Pin>
</Scrollytelling.Root>
```

### Layered Pinning

You can stack multiple `<Pin>` components to create an effect where sections appear to slide over one another. The key is to ensure each subsequent `<Pin>` has a higher `z-index`.

```jsx
<Scrollytelling.Root>
  <div style={{ position: "relative" }}>
    <Scrollytelling.Pin pinSpacerHeight="150vh" childHeight="100vh">
      <div style={{ zIndex: 1, position: "relative", background: "blue" }}>
        Panel 1
      </div>
    </Scrollytelling.Pin>

    <Scrollytelling.Pin pinSpacerHeight="150vh" childHeight="100vh">
      <div style={{ zIndex: 2, position: "relative", background: "red" }}>
        Panel 2 (slides over Panel 1)
      </div>
    </Scrollytelling.Pin>
  </div>
</Scrollytelling.Root>
```

---

## Troubleshooting

**"My animation isn't doing anything on scroll."**

This is almost always related to the `start` and `end` props on your `<Root>` component. If the trigger element's start point and end point are in the same place relative to the viewport, the scroll duration is 0.

For example, if your `<Root>` wraps a `div` that is only `100vh` tall, the default `start="top top"` and `end="bottom bottom"` will trigger at the exact same scroll position, resulting in no animation.

**Solutions:**

1.  **Increase the height** of the element your `<Root>` wraps (or a parent element). A common pattern is to use `<Pin>` which creates a `pinSpacerHeight` for this purpose.
2.  **Adjust the `end` value.** For a `100vh` section, you could use `end="bottom top"`, which means the animation ends when the bottom of the section hits the top of the viewport, giving you `100vh` of scroll duration.

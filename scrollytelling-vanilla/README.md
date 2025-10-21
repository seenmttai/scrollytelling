# @bsmnt/scrollytelling-vanilla

A framework-agnostic JavaScript library for creating stunning scroll-based animations, powered by GSAP.

`@bsmnt/scrollytelling-vanilla` provides a simple, imperative API for building complex scroll-triggered animations. It's a wrapper around the powerful GSAP (GreenSock Animation Platform) and its ScrollTrigger plugin, allowing you to create declarative-style, percentage-based tweens with ease.

This library is a vanilla JavaScript conversion of the original React-based `@bsmnt/scrollytelling`.

## Installation

```bash
npm install @bsmnt/scrollytelling-vanilla gsap
```

## Getting Started

Here's a simple example to get you up and running:

```html
<div id="my-trigger" style="height: 200vh;">
  <h1 style="opacity: 0;">Hello, Scrollytelling!</h1>
</div>
```

```javascript
import { Scrollytelling } from '@bsmnt/scrollytelling-vanilla';

const scrolly = Scrollytelling.create({
  trigger: '#my-trigger',
});

scrolly.addAnimation({
  target: 'h1',
  tween: {
    start: 0,
    end: 50,
    to: { opacity: 1 },
  },
});
```

## API Documentation

### `Scrollytelling.create(options)`

This is the main entry point for the library. It creates a new scrollytelling instance and returns it.

**Options:**

- `trigger` (string | HTMLElement): The element that triggers the animations.
- `start` (string): The start position of the timeline. (Default: `"top top"`)
- `end` (string): The end position of the timeline. (Default: `"bottom bottom"`)
- `scrub` (boolean | number): Whether to scrub the timeline. (Default: `true`)
- `defaults` (gsap.TweenVars): Default GSAP tween variables.

### Instance Methods

#### `.addAnimation({ target, tween })`

Adds a new animation to the timeline.

- `target` (string | HTMLElement | (string | HTMLElement)[]): The element(s) to animate.
- `tween` (object): An object describing the animation, with `start`, `end`, and `to`, `from`, or `fromTo` properties.

#### `.addParallax({ target, tween })`

Adds a parallax effect to an element.

- `target` (string | HTMLElement): The element to apply the parallax effect to.
- `tween` (object): An object with `start`, `end`, and `movementX` and/or `movementY` properties.

#### `.addStagger({ targets, tween, overlap })`

Adds a staggered animation to a group of elements.

- `targets` (string): A selector for the elements to animate.
- `tween` (object): The tween to apply to each element.
- `overlap` (number): The amount of overlap between animations (0 to 1).

#### `.addWaypoint({ at, label, onCall, onReverseCall, tween })`

Adds a waypoint to the timeline, which can trigger callbacks and animations.

- `at` (number): The position of the waypoint on the timeline (0 to 100).
- `label` (string): A label for the waypoint.
- `onCall` (function): A callback to execute when the waypoint is reached.
- `onReverseCall` (function): A callback to execute when the waypoint is reached in reverse.
- `tween` (object): An optional tween to play when the waypoint is reached.

#### `.scrollToLabel(label, opts)`

Scrolls the page to a waypoint label.

- `label` (string): The label to scroll to.
- `opts` (object): An optional object with `offset` and `behavior` properties.

#### `.getTimeline()`

Returns the underlying GSAP timeline instance.

#### `.on(event, callback)`

Subscribes to ScrollTrigger events.

- `event` ("update" | "enter" | "leave" | "enterBack" | "leaveBack"): The event to subscribe to.
- `callback` (function): The callback to execute when the event is triggered.

#### `.destroy()`

Cleans up the scrollytelling instance and all associated timelines and tweens.

## Creating Pinned Sections

To create a pinned section, you'll need a specific HTML and CSS structure. This library does not provide a JavaScript API for pinning; instead, you should rely on this standard CSS approach.

The outer `div` provides the scrollable height, and the inner `div` becomes sticky.

```html
<!-- The outer div provides the scrollable height for the animation -->
<div class="pin-spacer" style="height: 300vh;">
  <!-- The inner div becomes sticky -->
  <div class="pinned-content" style="height: 100vh; position: sticky; top: 0;">
    <!-- Your animated content goes here -->
    <h1>This content is pinned while the spacer scrolls.</h1>
  </div>
</div>
```

Then, you can use the `.pin-spacer` as the trigger for your scrollytelling instance:

```javascript
const scrolly = Scrollytelling.create({
    trigger: '.pin-spacer'
});
```

## Testing

This library uses a hybrid testing approach:

*   **Unit Tests:** Pure logic, such as the `getStaggeredTimeline` utility, is unit-tested with [Vitest](https://vitest.dev/) in a Node.js environment. You can run these tests with `yarn test`.
*   **Manual & E2E Testing:** A comprehensive set of live examples for manual and end-to-end visual verification can be found in the [`/examples`](./examples) directory.

## Examples

You can find a comprehensive example that demonstrates all of the library's features in the [`/examples`](./examples) directory.

### Simple Animation

```javascript
scrolly.addAnimation({
  target: 'h1',
  tween: {
    start: 0,
    end: 50,
    to: { opacity: 1 },
  },
});
```

### Parallax Effect

```javascript
scrolly.addParallax({
  target: '.parallax-image',
  tween: {
    start: 0,
    end: 100,
    movementY: '100px',
  },
});
```

### Staggered Animation

```javascript
scrolly.addStagger({
  targets: '.stagger-item',
  tween: {
    start: 20,
    end: 80,
    from: { y: 100, opacity: 0 },
  },
  overlap: 0.2,
});
```

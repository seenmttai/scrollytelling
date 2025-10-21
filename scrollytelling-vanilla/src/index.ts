import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Emitter } from "./util/emitter";
import { getStaggeredTimeline } from "./util/stagger";

type ScrollytellingOptions = {
  trigger: string | HTMLElement;
  start?: ScrollTrigger.Vars["start"];
  end?: ScrollTrigger.Vars["end"];
  scrub?: boolean | number;
  defaults?: gsap.TweenVars;
  toggleActions?: ScrollTrigger.Vars["toggleActions"];
};

type Tween = {
  start: number;
  end: number;
} & ({ to: gsap.TweenVars } | { from: gsap.TweenVars } | { fromTo: [gsap.TweenVars, gsap.TweenVars] });

type ParallaxTween = {
  start: number;
  end: number;
  movementX?: string | number;
  movementY?: string | number;
};

class ScrollytellingInstance {
  private timeline: gsap.core.Timeline;
  private triggerElement: Element;
  private scopedQuerySelector: (selector: string) => HTMLElement[];
  private emitter: Emitter;

  constructor(options: ScrollytellingOptions) {
    gsap.registerPlugin(ScrollTrigger);
    this.emitter = new Emitter();

    const triggerElement =
      typeof options.trigger === "string"
        ? document.querySelector(options.trigger)
        : options.trigger;

    if (!triggerElement) {
      throw new Error(`Scrollytelling trigger element not found: ${options.trigger}`);
    }

    this.triggerElement = triggerElement;
    this.scopedQuerySelector = gsap.utils.selector(this.triggerElement) as (selector: string) => HTMLElement[];

    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.triggerElement,
        start: options.start ?? "top top",
        end: options.end ?? "bottom bottom",
        scrub: options.scrub ?? true,
        toggleActions: options.toggleActions,
        onUpdate: (self) => this.emitter.emit("update", self.progress, self),
        onEnter: (self) => this.emitter.emit("enter", self),
        onLeave: (self) => this.emitter.emit("leave", self),
        onEnterBack: (self) => this.emitter.emit("enterBack", self),
        onLeaveBack: (self) => this.emitter.emit("leaveBack", self),
      },
      paused: true,
      defaults: options.defaults,
    });
  }

  private getTimelineSpace(tween: { start: number; end: number }) {
    const { start, end } = tween;
    if (start < 0 || start > 100) {
      throw new Error("Tween start must be between 0 and 100.");
    }
    if (end < 0 || end > 100) {
      throw new Error("Tween end must be between 0 and 100.");
    }
    if (start > end) {
      throw new Error("Tween start must be less than tween end.");
    }
    const duration = end - start;
    const position = start;

    const timelineDuration = this.timeline.duration();
    if (end > timelineDuration) {
      this.timeline.to({}, { duration: 100 - end }, end);
    }

    return { duration, position };
  }

  addAnimation(params: {target: string | HTMLElement | (string | HTMLElement)[], tween: Tween}) {
    const { target, tween } = params;

    const elements = Array.isArray(target)
      ? target.flatMap((t: string | HTMLElement) => typeof t === 'string' ? this.scopedQuerySelector(t) : t)
      : typeof target === 'string' ? this.scopedQuerySelector(target) : [target];

    if (elements.length === 0) {
      console.warn(`No elements found for target selector: ${target}`);
      return;
    }

    const { duration, position } = this.getTimelineSpace(tween);
    const options = { duration };

    if ("to" in tween) {
      this.timeline.to(elements, { ...tween.to, ...options }, position);
    } else if ("from" in tween) {
      this.timeline.from(elements, { ...tween.from, ...options }, position);
    } else if ("fromTo" in tween) {
      this.timeline.fromTo(elements, tween.fromTo[0], { ...tween.fromTo[1], ...options }, position);
    } else {
      throw new Error("Invalid tween type. Must be 'to', 'from', or 'fromTo'.")
    }
  }

  addParallax(params: { target: string | HTMLElement, tween: ParallaxTween }) {
    const { target, tween } = params;
    if (!tween.movementY && !tween.movementX) {
      throw new Error("At least one of movementY and movementX is required for parallax.");
    }

    const from = {
      y: tween.movementY ? `-=${tween.movementY}`: undefined,
      x: tween.movementX ? `-=${tween.movementX}`: undefined,
    };
    const to = {
      y: tween.movementY ? `+=${tween.movementY}`: undefined,
      x: tween.movementX ? `+=${tween.movementX}`: undefined,
      ease: "linear",
    };

    this.addAnimation({
      target,
      tween: {
        start: tween.start,
        end: tween.end,
        fromTo: [from, to]
      }
    });
  }

  addStagger(params: { targets: string, tween: Tween, overlap?: number }) {
    const { targets, tween, overlap } = params;
    const elements = this.scopedQuerySelector(targets);
    if (elements.length === 0) {
      console.warn(`No elements found for stagger targets selector: ${targets}`);
      return;
    }

    const staggeredTimeline = getStaggeredTimeline({
      start: tween.start,
      end: tween.end,
      chunks: elements.length,
      overlap,
    });

    elements.forEach((element, i) => {
      const individualTweenSpec = staggeredTimeline[i];
      if (!individualTweenSpec) return;

      const individualTween = {
        ...tween,
        start: individualTweenSpec.start,
        end: individualTweenSpec.end,
      };

      this.addAnimation({
        target: element,
        tween: individualTween,
      });
    });
  }

  addWaypoint(params: {
    at: number;
    label?: string;
    onCall?: () => void;
    onReverseCall?: () => void;
    tween?: { target: string | HTMLElement, duration?: number } & ({ to: gsap.TweenVars } | { from: gsap.TweenVars } | { fromTo: [gsap.TweenVars, gsap.TweenVars] });
  }) {
    const { at, label, onCall, onReverseCall, tween } = params;

    const waypoint = gsap.set({}, {
      onComplete: onCall,
      onReverseComplete: onReverseCall,
    });

    this.timeline.add(waypoint, at);

    if (tween) {
      const { target, duration = 1, ...op } = tween;
      const elements = typeof target === 'string' ? this.scopedQuerySelector(target) : [target as HTMLElement];
      if (elements.length > 0) {
          const tweenOptions = { duration };
        if ("to" in op) {
          this.timeline.to(elements, { ...op.to, ...tweenOptions }, at);
        } else if ("from" in op) {
          this.timeline.from(elements, { ...op.from, ...tweenOptions }, at);
        } else if ("fromTo" in op) {
          this.timeline.fromTo(elements, op.fromTo[0], { ...op.fromTo[1], ...tweenOptions }, at);
        }
      }
    }

    if (label) {
      this.timeline.addLabel(label, at);
    }
  }

  scrollToLabel(label: string, opts?: { behavior?: ScrollBehavior; offset?: number; }) {
    if (!this.timeline.scrollTrigger) {
      console.warn("ScrollTrigger not initialized. Cannot scroll to label.");
      return;
    }
    const st = this.timeline.scrollTrigger;
    if (!this.timeline.labels[label]) {
      console.warn(`Label '${label}' not found.`);
      return;
    }
    const targetPx = st.labelToScroll(label);
    window.scrollTo({
      top: targetPx + (opts?.offset ?? 0),
      behavior: opts?.behavior,
    });
  }

  getTimeline() {
    return this.timeline;
  }

  on(event: "update" | "enter" | "leave" | "enterBack" | "leaveBack", callback: (...args: any[]) => void) {
    this.emitter.on(event, callback);
  }

  destroy() {
    if (this.timeline?.scrollTrigger) {
      this.timeline.scrollTrigger.kill();
    }
    if (this.timeline) {
      this.timeline.revert();
    }
    this.emitter.destroy();
  }
}

export const Scrollytelling = {
  create: (options: ScrollytellingOptions) => {
    return new ScrollytellingInstance(options);
  },
};

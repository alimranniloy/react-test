import type { DirectiveBinding, ObjectDirective } from "vue";

type ScrollAnimateValue =
  | string
  | {
      type?: string;
      delay?: number;
      threshold?: number;
      rootMargin?: string;
    };

const animationTypes = new Set([
  "slide-left",
  "slide-right",
  "slide-up",
  "slide-down",
  "fade",
  "zoom",
]);

const normalizeOptions = (binding?: DirectiveBinding<ScrollAnimateValue>) => {
  if (!binding) {
    return { type: "fade", delay: 0, threshold: 0.15, rootMargin: "0px 0px -10% 0px" };
  }
  if (typeof binding.value === "string") {
    return {
      type: animationTypes.has(binding.value) ? binding.value : "fade",
      delay: 0,
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    };
  }
  const { type = "fade", delay = 0, threshold = 0.15, rootMargin = "0px 0px -10% 0px" } = binding.value || {};
  return {
    type: animationTypes.has(type) ? type : "fade",
    delay,
    threshold,
    rootMargin,
  };
};

declare global {
  interface HTMLElement {
    __scrollAnimateObserver__?: IntersectionObserver;
    __scrollAnimateTimeout__?: number;
  }
}

const createObserver = (
  el: HTMLElement,
  { delay, threshold, rootMargin }: { delay: number; threshold: number; rootMargin: string },
  type: string
) => {
  if (el.__scrollAnimateObserver__) {
    el.__scrollAnimateObserver__.disconnect();
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (el.__scrollAnimateTimeout__) {
            window.clearTimeout(el.__scrollAnimateTimeout__);
          }
          el.__scrollAnimateTimeout__ = window.setTimeout(() => {
            el.classList.add("scroll-animate--visible");
          }, delay);
          obs.unobserve(el);
        }
      });
    },
    {
      threshold,
      rootMargin,
    }
  );

  el.classList.add("scroll-animate", `scroll-animate--${type}`);
  el.__scrollAnimateObserver__ = observer;
  observer.observe(el);
};

const scrollAnimateDirective: ObjectDirective<HTMLElement, ScrollAnimateValue> = {
  mounted(el, binding) {
    const options = normalizeOptions(binding);
    createObserver(el, options, options.type);
  },
  unmounted(el) {
    if (el.__scrollAnimateObserver__) {
      el.__scrollAnimateObserver__.disconnect();
      delete el.__scrollAnimateObserver__;
    }
  },
};

export default scrollAnimateDirective;

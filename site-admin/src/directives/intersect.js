// src/directives/intersect.js
export default {
  mounted(el, binding) {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (binding.value && typeof binding.value === "function") {
          binding.value(entry.isIntersecting);
        }
      });
    };
    const observer = new IntersectionObserver(callback);
    observer.observe(el);
    el._observer = observer;
  },
  unmounted(el) {
    if (el._observer) {
      el._observer.disconnect();
      delete el._observer;
    }
  },
};

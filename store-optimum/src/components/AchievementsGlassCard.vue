<template>
  <div class="font-sans w-full">
    <div class="container mx-auto px-4">
      <div
        class="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 p-px shadow-lg shadow-black/20 group"
      >
        <div
          class="absolute inset-[-100%] w-[300%] h-[300%] animate-rotate-glow group-hover:animate-none"
          style="
            background: conic-gradient(
              from 180deg at 50% 50%,
              #fcd34d33 0%,
              #14b8a633 50%,
              #fcd34d33 100%
            );
          "
        ></div>

        <div
          class="relative grid grid-cols-2 sm:grid-cols-4 text-center w-full text-white rounded-2xl bg-slate-900/80 backdrop-blur-sm px-4 py-8"
        >
          <div class="stat-item px-4">
            <p class="stat-number">{{ years }}+</p>
            <p class="stat-label">ওয়েবসাইট থিম</p>
          </div>

          <div
            class="stat-item px-4 relative after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-left-0 after:w-px after:h-12 after:bg-white/10"
          >
            <p class="stat-number">{{ projects }}+</p>
            <p class="stat-label">প্রজেক্ট সম্পন্ন</p>
          </div>

          <div
            class="stat-item px-4 relative after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-left-0 after:w-px after:h-12 after:bg-white/10"
          >
            <p class="stat-number">{{ onTime }}%</p>
            <p class="stat-label">অন-টাইম ডেলিভারি</p>
          </div>

          <div
            class="stat-item px-4 relative after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-left-0 after:w-px after:h-12 after:bg-white/10"
          >
            <p class="stat-number">24/7</p>
            <p class="stat-label">কাস্টমার সাপোর্ট</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const years = ref(0);
const projects = ref(0);
const onTime = ref(0);
const continents = ref(0);

// Your excellent animation logic remains unchanged
function animateCount(target, refVar, duration = 2000) {
  let start = 0;
  const startTime = performance.now();

  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
    refVar.value = Math.floor(easedProgress * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      refVar.value = target; // Ensure final value is exact
    }
  }

  requestAnimationFrame(update);
}

onMounted(() => {
  const section = document.querySelector(".stat-item"); // Target the element to observe
  if (!section) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      if (entries[0].isIntersecting) {
        animateCount(12, years);
        animateCount(300, projects);
        animateCount(98, onTime);
        animateCount(1, continents);
        obs.disconnect(); // Disconnect after animating once
      }
    },
    { threshold: 0.5 } // Trigger when 50% of the element is visible
  );

  observer.observe(section);
});
</script>

<style scoped>
/* New Aurora Glow Animation */
@keyframes rotate-glow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.animate-rotate-glow {
  animation: rotate-glow 8s linear infinite;
}

/* Typography for stats */
.stat-number {
  @apply text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-400 mb-2;
}
.stat-label {
  @apply text-sm sm:text-base text-gray-300 uppercase tracking-wider;
}

/* On smaller screens, only the first item in a row should not have a separator.
   The grid resets to 2 columns on mobile, so we need to handle that. */
@media (max-width: 639px) {
  .stat-item:nth-child(2n + 1)::after {
    content: none;
  }
}
</style>

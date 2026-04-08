<template>
  <section ref="statCounter" class="py-20 bg-black text-white">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        <div v-for="stat in formattedStats" :key="stat.label">
          <p class="text-5xl md:text-6xl font-bold text-white tracking-tighter">
            {{ stat.formattedValue }} +
          </p>
          <p class="text-lg text-gray-400 mt-2">
            {{ stat.label }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from "gsap";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const stats = ref([
  { label: "Available Themes", targetValue: 20, displayValue: 0 },
  { label: "Stores Joined", targetValue: 16000, displayValue: 0 },
  { label: "Monthly Orders Processed", targetValue: 300000, displayValue: 0 },
  { label: "End-Consumers Reached", targetValue: 1400000, displayValue: 0 },
]);

const formattedStats = computed(() =>
  stats.value.map((stat) => ({
    ...stat,
    formattedValue: Math.ceil(stat.displayValue).toLocaleString("en-US"),
  }))
);

const startCounting = () => {
  stats.value.forEach((stat, index) => {
    gsap.to(stat, {
      displayValue: stat.targetValue,
      duration: 3.5,
      ease: "power3.out",
      snap: { displayValue: 1 },
      delay: index * 0.1,
    });
  });
};

const statCounter = ref(null);
let observer = null;
let hasStarted = false;
let hasScrolledPastInitialView = false;

const onScroll = () => {
  if (window.scrollY < window.innerHeight) {
    hasScrolledPastInitialView = true;
  }
};

window.addEventListener("scroll", onScroll);

onMounted(async () => {
  await nextTick();

  const options = {
    root: null,
    threshold: 0.5,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasStarted && hasScrolledPastInitialView) {
        hasStarted = true;
        startCounting();
        observer.unobserve(statCounter.value);
      }
    });
  }, options);

  if (statCounter.value) {
    observer.observe(statCounter.value);
  }
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
  window.removeEventListener("scroll", onScroll);
});
</script>

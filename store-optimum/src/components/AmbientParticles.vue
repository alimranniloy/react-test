<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <span
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :style="{
        left: particle.x,
        top: particle.y,
        width: particle.size,
        height: particle.size,
        animationDelay: particle.delay,
        animationDuration: particle.duration,
        opacity: particle.opacity,
      }"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const TOTAL_PARTICLES = 28;

const particles = computed(() =>
  Array.from({ length: TOTAL_PARTICLES }).map((_, index) => {
    const random = (min: number, max: number) =>
      (Math.random() * (max - min) + min).toFixed(2);
    return {
      id: index,
      x: `${random(0, 100)}%`,
      y: `${random(0, 100)}%`,
      size: `${random(12, 40)}px`,
      delay: `${random(-5, 5)}s`,
      duration: `${random(12, 28)}s`,
      opacity: random(0.05, 0.25),
    };
  })
);
</script>

<style scoped>
.particle {
  position: absolute;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(126, 255, 214, 0.8) 0%,
    rgba(126, 255, 214, 0.3) 45%,
    rgba(11, 184, 177, 0) 70%
  );
  filter: blur(0.5px);
  animation-name: floatParticle;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes floatParticle {
  0% {
    transform: translate3d(0px, 0px, 0) scale(1);
  }
  50% {
    transform: translate3d(60px, -80px, 0) scale(1.25);
  }
  100% {
    transform: translate3d(-30px, 40px, 0) scale(0.9);
  }
}

@media (max-width: 768px) {
  .particle {
    animation-duration: 18s !important;
    opacity: 0.15 !important;
  }
}
</style>

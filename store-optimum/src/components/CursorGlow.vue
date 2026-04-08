<template>
  <div
    class="pointer-events-none fixed inset-0 z-[60] transition-opacity duration-500"
    :class="{ 'opacity-0': !isVisible }"
    aria-hidden="true"
  >
    <div
      class="cursor-glow"
      :style="{
        transform: `translate3d(${position.x - 90}px, ${position.y - 90}px, 0)`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const isVisible = ref(false);
const position = ref({ x: 0, y: 0 });

function updatePosition(event: PointerEvent) {
  position.value = { x: event.clientX, y: event.clientY };
  isVisible.value = true;
}

function hide() {
  isVisible.value = false;
}

onMounted(() => {
  window.addEventListener("pointermove", updatePosition, { passive: true });
  window.addEventListener("pointerdown", updatePosition, { passive: true });
  window.addEventListener("pointerleave", hide, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("pointermove", updatePosition);
  window.removeEventListener("pointerdown", updatePosition);
  window.removeEventListener("pointerleave", hide);
});
</script>

<style scoped>
.cursor-glow {
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(92, 253, 213, 0.25) 0%,
    rgba(92, 253, 213, 0.15) 35%,
    rgba(0, 124, 137, 0) 70%
  );
  filter: blur(5px);
  transition: transform 0.2s ease-out;
  mix-blend-mode: screen;
}

@media (max-width: 768px), (pointer: coarse) {
  .cursor-glow {
    display: none;
  }
}
</style>

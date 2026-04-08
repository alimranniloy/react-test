<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
    >
      <div class="spinner"></div>
      <p class="mt-4 text-gray-500 text-sm tracking-wide">Loading...</p>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";

const visible = ref(true);

onMounted(() => {
  if (document.readyState === "complete") {
    setTimeout(() => (visible.value = false), 300);
  } else {
    window.addEventListener("load", () => {
      setTimeout(() => (visible.value = false), 300);
    });
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.spinner {
  display: inline-block;
  width: 56px;
  height: 56px;
}
.spinner:after {
  content: " ";
  display: block;
  width: 48px;
  height: 48px;
  margin: 4px;
  border-radius: 50%;
  border: 4px solid #f59e0b;
  border-color: #f59e0b transparent #f59e0b transparent;
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

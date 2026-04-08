<template>
  <section
    class="relative bg-slate-950 text-white py-24 sm:py-20 overflow-hidden font-sans"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-900 to-slate-950"
    ></div>

    <div class="particles-container absolute inset-0 -z-0 overflow-hidden">
      <div v-for="i in 20" :key="i" class="particle"></div>
    </div>

    <div
      class="absolute top-0 left-0 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-purple-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-teal-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000"
    ></div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-teal-400 font-semibold uppercase tracking-wider"
          >ইন্টারেক্টিভ প্রিভিউ</span
        >
        <h2 class="text-4xl md:text-5xl font-extrabold mt-2 mb-4 text-shadow">
          <span class="text-amber-400">থিম এক্সপ্লোর করুন</span>
        </h2>
        <p class="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
          আমাদের সেরা থিমগুলির ইন্টারেক্টিভ ডেমো সরাসরি ব্রাউজ করুন
        </p>
      </div>

      <div class="relative">
        <div
          class="swiper theme-carousel"
          ref="swiperContainer"
          @mouseenter="pauseAutoplay"
          @mouseleave="resumeAutoplay"
        >
          <div class="swiper-wrapper">
            <div
              v-for="(theme, index) in themes"
              :key="index"
              class="swiper-slide"
            >
              <div class="slide-content">
                <div class="browser-mockup">
                  <div class="browser-header">
                    <div class="dots">
                      <span class="dot" style="background: #f87171"></span>
                      <span class="dot" style="background: #fbbd23"></span>
                      <span class="dot" style="background: #34d399"></span>
                    </div>
                  </div>
                  <div class="iframe-container">
                    <iframe
                      :src="theme.url"
                      class="w-full h-full border-0"
                      loading="lazy"
                      allow="fullscreen"
                      :title="theme.name + ' Preview'"
                    ></iframe>
                  </div>
                </div>
                <div class="theme-info">
                  <h3 class="text-2xl font-bold text-white">
                    {{ theme.name }}
                  </h3>
                  <p class="text-gray-400 mt-1">{{ theme.description }}</p>
                  <a
                    :href="theme.url"
                    target="_blank"
                    class="inline-block mt-6"
                  >
                    <button
                      class="relative flex items-center justify-center px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold text-base rounded-full shadow-lg hover:shadow-amber-500/40 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
                    >
                      <EyeIcon class="w-5 h-5 mr-2" />
                      <span class="relative z-10">লাইভ ডেমো</span>
                      <div
                        class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"
                      ></div>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="swiper-button-prev navigation-button left-0 xl:-left-8">
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
        <button
          class="swiper-button-next navigation-button right-0 xl:-right-8"
        >
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>

      <div class="swiper-pagination-container">
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
} from "@heroicons/vue/24/solid";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { onMounted, ref } from "vue";

const themes = [
  {
    name: "ফুডি থিম",
    description: "রেস্টুরেন্ট ও ফুড বিজনেসের জন্য",
    url: "https://foodi.store.bponi.com/",
  },
  {
    name: "এজ থিম",
    description: "মডার্ন বিজনেস ও কর্পোরেট",
    url: "https://edge.store.bponi.com/",
  },
  {
    name: "জিরো থিম",
    description: "মিনিমাল ও ক্রিয়েটিভ পোর্টফোলিও",
    url: "https://zero.store.bponi.com/",
  },
  {
    name: "বুক থিম",
    description: "বইয়ের দোকান ও প্রকাশনীর জন্য",
    url: "https://boiadda.store.bponi.com/",
  },
];

const swiperContainer = ref(null);
const swiperInstance = ref(null);

const pauseAutoplay = () => {
  if (swiperInstance.value?.autoplay) swiperInstance.value.autoplay.stop();
};
const resumeAutoplay = () => {
  if (swiperInstance.value?.autoplay) swiperInstance.value.autoplay.start();
};

onMounted(() => {
  swiperInstance.value = new Swiper(swiperContainer.value, {
    effect: "slide",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    loop: true,
    speed: 1200,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});
</script>

<style>
/* --- CAROUSEL AND SLIDE SIZING (Unchanged) --- */
.theme-carousel {
  width: 100%;
  padding: 50px 0;
}
.swiper-wrapper {
  align-items: center;
  transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
}
.swiper-slide {
  width: 70%;
  max-width: 1000px;
  height: auto;
  transition: transform 0.8s, opacity 0.8s;
  opacity: 0.5;
  transform: scale(0.8);
}
.swiper-slide-active {
  opacity: 1;
  transform: scale(1);
}
.swiper-slide-active .theme-info {
  opacity: 1;
  transform: translateY(0);
}
.slide-content {
  display: flex;
  flex-direction: column;
}
.browser-mockup {
  @apply w-full bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 flex flex-col;
  aspect-ratio: 16 / 10;
}
.browser-header {
  @apply w-full h-8 bg-slate-900/80 rounded-t-lg flex-shrink-0 flex items-center p-2;
}
.dots {
  @apply flex gap-1.5;
}
.dot {
  @apply w-3 h-3 rounded-full;
}
.iframe-container {
  @apply w-full h-full rounded-b-lg overflow-hidden;
}
.theme-info {
  @apply text-center mt-8 opacity-0 transform translate-y-4 transition-all duration-500 delay-300;
}
.navigation-button {
  @apply absolute top-1/2 -translate-y-1/2 w-14 h-14 z-20 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 transform hover:scale-105;
}
.navigation-button.left-0 {
  @apply xl:-left-8;
}
.navigation-button.right-0 {
  @apply xl:-right-8;
}
.swiper-button-disabled {
  @apply opacity-30 pointer-events-none;
}
.swiper-pagination-container {
  @apply relative h-1 w-full max-w-sm mx-auto mt-5 bg-white/10 rounded-full;
}
.swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
  @apply bg-gradient-to-r from-amber-400 to-amber-500;
  border-radius: 10px;
}

/* --- NEW FLOATING PARTICLES ANIMATION --- */
@keyframes float-particle {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh);
    opacity: 0;
  }
}
.particle {
  position: absolute;
  bottom: -10px; /* Start from just below the screen */
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: float-particle linear infinite;
}

/* Create a variety of particles for a natural look */
.particle:nth-child(1) {
  width: 3px;
  height: 3px;
  left: 5%;
  animation-duration: 15s;
  animation-delay: 1s;
}
.particle:nth-child(2) {
  width: 2px;
  height: 2px;
  left: 10%;
  animation-duration: 20s;
  animation-delay: 3s;
}
.particle:nth-child(3) {
  width: 4px;
  height: 4px;
  left: 15%;
  animation-duration: 12s;
  animation-delay: 5s;
}
.particle:nth-child(4) {
  width: 2px;
  height: 2px;
  left: 20%;
  animation-duration: 18s;
  animation-delay: 0s;
}
.particle:nth-child(5) {
  width: 5px;
  height: 5px;
  left: 25%;
  animation-duration: 10s;
  animation-delay: 2s;
}
.particle:nth-child(6) {
  width: 3px;
  height: 3px;
  left: 30%;
  animation-duration: 22s;
  animation-delay: 4s;
}
.particle:nth-child(7) {
  width: 2px;
  height: 2px;
  left: 35%;
  animation-duration: 13s;
  animation-delay: 1s;
}
.particle:nth-child(8) {
  width: 4px;
  height: 4px;
  left: 40%;
  animation-duration: 19s;
  animation-delay: 6s;
}
.particle:nth-child(9) {
  width: 2px;
  height: 2px;
  left: 45%;
  animation-duration: 16s;
  animation-delay: 3s;
}
.particle:nth-child(10) {
  width: 3px;
  height: 3px;
  left: 50%;
  animation-duration: 14s;
  animation-delay: 0s;
}
.particle:nth-child(11) {
  width: 5px;
  height: 5px;
  left: 55%;
  animation-duration: 25s;
  animation-delay: 5s;
}
.particle:nth-child(12) {
  width: 2px;
  height: 2px;
  left: 60%;
  animation-duration: 11s;
  animation-delay: 2s;
}
.particle:nth-child(13) {
  width: 4px;
  height: 4px;
  left: 65%;
  animation-duration: 17s;
  animation-delay: 4s;
}
.particle:nth-child(14) {
  width: 3px;
  height: 3px;
  left: 70%;
  animation-duration: 21s;
  animation-delay: 1s;
}
.particle:nth-child(15) {
  width: 2px;
  height: 2px;
  left: 75%;
  animation-duration: 14s;
  animation-delay: 6s;
}
.particle:nth-child(16) {
  width: 4px;
  height: 4px;
  left: 80%;
  animation-duration: 18s;
  animation-delay: 3s;
}
.particle:nth-child(17) {
  width: 3px;
  height: 3px;
  left: 85%;
  animation-duration: 16s;
  animation-delay: 5s;
}
.particle:nth-child(18) {
  width: 5px;
  height: 5px;
  left: 90%;
  animation-duration: 12s;
  animation-delay: 2s;
}
.particle:nth-child(19) {
  width: 2px;
  height: 2px;
  left: 95%;
  animation-duration: 23s;
  animation-delay: 0s;
}
.particle:nth-child(20) {
  width: 4px;
  height: 4px;
  left: 100%;
  animation-duration: 15s;
  animation-delay: 4s;
}

/* --- GLOBAL ANIMATIONS --- */
.text-shadow {
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}
@keyframes blob {
  /* ... */
}
.animate-blob {
  /* ... */
}
.animation-delay-2000 {
  /* ... */
}
@keyframes fadeInUp {
  /* ... */
}
.animate-fade-in-up {
  /* ... */
}
@keyframes shimmer {
  /* ... */
}
.animate-shimmer {
  /* ... */
}
</style>

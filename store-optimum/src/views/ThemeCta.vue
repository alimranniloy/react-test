<template>
  <section
    class="relative bg-slate-950 text-white py-24 sm:py-32 px-4 overflow-hidden font-sans"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-900 to-slate-950"
    ></div>
    <div class="cosmic-energy-container absolute inset-0 -z-0 overflow-hidden">
      <div class="gradient-1"></div>
      <div class="gradient-2"></div>
      <div class="gradient-3"></div>
    </div>
    <div
      class="absolute top-0 left-0 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-purple-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-teal-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000"
    ></div>

    <div class="container mx-auto text-center relative z-10">
      <div class="max-w-3xl mx-auto animate-fade-in-up">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-6 text-shadow">
          আপনার ওয়েবসাইট <span class="text-amber-400">ট্রান্সফর্ম</span> করতে
          প্রস্তুত?
        </h2>
        <p
          class="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          ৫০,০০০+ সন্তুষ্ট গ্রাহকের সাথে যোগ দিন যারা আমাদের থিম দিয়ে
          দৃষ্টিনন্দন ওয়েবসাইট তৈরি করেছেন।
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/pricing">
            <button
              class="relative flex items-center justify-center w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-amber-500/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              <span class="relative z-10">আমাদের প্যাকেজ দেখুন</span>
              <span class="relative z-10 ml-3">
                <ArrowLongRightIcon
                  class="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
              <div
                class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"
              ></div>
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowLongRightIcon } from "@heroicons/vue/24/solid";
</script>

<style>
/* Add these styles to your existing style block or a global CSS file if not already present */
.text-shadow {
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
.animate-blob {
  animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
  opacity: 0;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

/* Cosmic Energy Animation */
@keyframes move-gradient {
  0% {
    transform: translate(0%, 0%) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(5%, 10%) rotate(10deg) scale(1.1);
  }
  50% {
    transform: translate(-5%, -10%) rotate(-10deg) scale(1);
  }
  75% {
    transform: translate(10%, -5%) rotate(5deg) scale(1.2);
  }
  100% {
    transform: translate(0%, 0%) rotate(0deg) scale(1);
  }
}

.cosmic-energy-container > div {
  position: absolute;
  mix-blend-mode: screen;
  filter: blur(60px);
  opacity: 0.5;
  animation: move-gradient 20s ease-in-out infinite alternate;
}

.gradient-1 {
  top: -10%;
  left: -10%;
  width: 50%;
  padding-top: 50%;
  background: radial-gradient(
    circle at center,
    rgba(8, 145, 178, 0.4),
    transparent 70%
  );
  animation-duration: 25s;
}

.gradient-2 {
  bottom: -10%;
  right: -10%;
  width: 60%;
  padding-top: 60%;
  background: radial-gradient(
    circle at center,
    rgba(168, 85, 247, 0.3),
    transparent 70%
  );
  animation-duration: 22s;
  animation-delay: -5s;
}

.gradient-3 {
  top: 30%;
  right: 10%;
  width: 40%;
  padding-top: 40%;
  background: radial-gradient(
    circle at center,
    rgba(252, 211, 77, 0.25),
    transparent 70%
  );
  animation-duration: 18s;
  animation-delay: -10s;
}
</style>

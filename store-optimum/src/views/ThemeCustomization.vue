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
      class="absolute -top-1/4 left-0 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-purple-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob"
    ></div>
    <div
      class="absolute -bottom-1/4 right-0 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-amber-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000"
    ></div>

    <div class="container mx-auto relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div class="lg:w-1/2 animate-fade-in-up">
          <span
            class="inline-block bg-teal-500/10 border border-teal-500/20 text-teal-400 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
          >
            🎨 লাইভ কাস্টমাইজেশন
          </span>
          <h2
            class="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight text-shadow"
          >
            আপনার <span class="text-amber-400">স্টাইল</span>, আপনার
            <span class="text-amber-400">পছন্দ</span>
          </h2>
          <p class="text-gray-300 text-lg mb-8 leading-relaxed">
            রিয়েল-টাইম কাস্টমাইজার দিয়ে যেকোনো থিমকে আপনার ব্র্যান্ডের সাথে
            মিলিয়ে নিন। কোন কোডিং জ্ঞান প্রয়োজন নেই - শুধু ক্লিক করুন এবং
            পরিবর্তনগুলি সরাসরি দেখুন।
          </p>

          <div class="space-y-5">
            <div class="flex items-start">
              <CheckCircleIcon
                class="w-6 h-6 text-teal-400 flex-shrink-0 mr-3 mt-1"
              />
              <div>
                <h3 class="text-lg font-medium text-white">
                  ৫০+ রেডিমেড কালার স্কিম
                </h3>
                <p class="text-gray-400 mt-1">
                  এক ক্লিকে সম্পূর্ণ থিমের রঙ পরিবর্তন করুন।
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <CheckCircleIcon
                class="w-6 h-6 text-teal-400 flex-shrink-0 mr-3 mt-1"
              />
              <div>
                <h3 class="text-lg font-medium text-white">
                  ফন্ট কাস্টমাইজেশন
                </h3>
                <p class="text-gray-400 mt-1">
                  Google Fonts থেকে ৮০০+ ফন্ট চয়েস করুন।
                </p>
              </div>
            </div>
          </div>

          <a
            href="https://site.bponi.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block mt-10"
          >
            <button
              class="relative flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-amber-500/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              <span class="relative z-10">কাস্টমাইজার এক্সপ্লোর করুন</span>
              <ArrowLongRightIcon
                class="w-6 h-6 ml-3 transform transition-transform duration-300 group-hover:translate-x-1 z-10"
              />
            </button>
          </a>
        </div>

        <div
          class="lg:w-1/2 w-full mt-12 lg:mt-0 animate-fade-in-up"
          style="animation-delay: 200ms"
        >
          <div
            class="group relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl"
            ref="sliderContainer"
            @mousemove="handleDragMove"
            @mouseleave="handleDragEnd"
            @touchmove="handleDragMove"
            @touchend="handleDragEnd"
          >
            <div
              class="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style="
                background: radial-gradient(
                  circle at 50% 50%,
                  rgba(20, 184, 166, 0.2) 0%,
                  rgba(20, 184, 166, 0) 70%
                );
              "
            ></div>

            <div
              class="relative w-full aspect-[16/10] rounded-lg overflow-hidden select-none"
            >
              <img
                src="https://i.ibb.co/4ZkrgBZ2/Screenshot-2025-08-14-at-4-11-30-PM.png"
                class="absolute inset-0 w-full h-full object-cover"
                alt="Default Theme"
              />

              <div
                class="absolute inset-0 w-full h-full"
                :style="{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }"
              >
                <img
                  src="https://i.ibb.co/fVJNqhvS/Screenshot-2025-08-17-at-2-36-34-PM.png"
                  class="absolute inset-0 w-full h-full object-cover"
                  alt="Customized Theme"
                />
              </div>

              <div
                class="absolute top-0 h-full w-1.5 bg-white/20 cursor-col-resize"
                :style="{
                  left: `${sliderPosition}%`,
                  transform: 'translateX(-50%)',
                }"
                @mousedown.prevent="handleDragStart"
                @touchstart.prevent="handleDragStart"
              >
                <div
                  class="absolute inset-y-0 -left-px w-px bg-white blur-[1px]"
                ></div>

                <div
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 transition-transform duration-200"
                  :class="{ 'scale-110': isDragging }"
                >
                  <ChevronUpDownIcon class="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div
              class="p-2 flex justify-between items-center text-sm font-medium"
            >
              <span class="text-gray-400">ডিফল্ট ভিউ</span>
              <span class="text-amber-400">কাস্টম ভিউ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import {
  CheckCircleIcon,
  ArrowLongRightIcon,
  ChevronUpDownIcon,
} from "@heroicons/vue/24/solid";

const sliderContainer = ref(null);
const sliderPosition = ref(50);
const isDragging = ref(false);

const handleDragStart = (e) => {
  isDragging.value = true;
  // Prevent default text selection behavior
  e.preventDefault();
};

const handleDragMove = (e) => {
  if (!isDragging.value || !sliderContainer.value) return;
  e.preventDefault();
  const rect = sliderContainer.value.getBoundingClientRect();
  const x = (e.clientX || e.touches[0].clientX) - rect.left;
  let percentage = (x / rect.width) * 100;

  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  sliderPosition.value = percentage;
};

const handleDragEnd = () => {
  isDragging.value = false;
};
</script>

<style>
/* Add these styles to your existing style block or a global CSS file if not already present */
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

@keyframes move-gradient {
  /* ... existing Cosmic Energy animation ... */
}
.cosmic-energy-container > div {
  /* ... */
}
.gradient-1,
.gradient-2,
.gradient-3 {
  /* ... */
}
</style>

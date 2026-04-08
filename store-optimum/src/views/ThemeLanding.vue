<template>
  <section
    class="relative bg-gradient-to-br from-gray-900 to-slate-950 text-white py-24 sm:py-32 px-4 overflow-hidden flex items-center font-sans"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
    ></div>
    <div
      class="absolute -top-1/4 left-0 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-purple-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob"
    ></div>
    <div
      class="absolute -bottom-1/4 right-0 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-teal-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000"
    ></div>

    <div class="container mx-auto relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div class="lg:w-1/2 text-center lg:text-left animate-fade-in-up">
          <div
            class="inline-block bg-teal-500/10 border border-teal-500/20 text-teal-400 px-4 py-2 rounded-full mb-6"
          >
            <span class="text-sm font-semibold"
              >🚀 ফাস্ট এবং রেসপন্সিভ থিম</span
            >
          </div>
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-shadow"
          >
            <span class="text-amber-400">বিপণির থিম:</span>
            সেরা ডিজাইন, সর্বাধিক জনপ্রিয়
          </h1>
          <p
            class="text-lg md:text-xl text-gray-300 opacity-90 mb-10 max-w-2xl mx-auto lg:mx-0"
          >
            অত্যাধুনিক সৌন্দর্য, নতুনধারার ডিজাইন এবং ব্যবহার সহজতা, যা আপনার
            ওয়েবসাইটকে বিশেষ ও আকর্ষণীয় করে।
          </p>
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href="https://foodi.store.bponi.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                class="w-full sm:w-auto relative flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-amber-500/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
              >
                <EyeIcon class="w-6 h-6 mr-2" />
                <span class="relative z-10">লাইভ প্রিভিউ</span>
                <div
                  class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"
                ></div>
              </button>
            </a>
            <router-link to="/pricing">
              <button
                class="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition duration-300 flex items-center justify-center"
              >
                <ShoppingBagIcon class="w-6 h-6 mr-2" />
                <span>প্যাকেজ দেখুন</span>
              </button>
            </router-link>
          </div>

          <div
            class="mt-12 flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <div
              class="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10"
            >
              <CheckCircleIcon class="w-5 h-5 text-teal-400 mr-2" />
              <span class="text-sm">কাস্টমার সাপোর্ট</span>
            </div>
            <div
              class="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10"
            >
              <CheckCircleIcon class="w-5 h-5 text-teal-400 mr-2" />
              <span class="text-sm">লাইফটাইম আপডেট</span>
            </div>
          </div>
        </div>

        <div class="lg:w-1/2 w-full mt-12 lg:mt-0 animate-fade-in-up delay-200">
          <div class="relative group w-full h-full p-4">
            <div
              class="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:rotate-1"
            >
              <div
                class="p-2 bg-slate-900/80 rounded-t-2xl flex items-center gap-1.5"
              >
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <img
                src="https://i.ibb.co/RpHWbYfc/Screenshot-2025-08-14-at-3-38-41-PM.png"
                alt="আল্টিমেট থিম"
                class="w-full h-auto rounded-b-xl"
              />
            </div>

            <div
              class="absolute -bottom-12 -left-12 w-1/2 max-w-[200px] transition-transform duration-500 ease-out group-hover:-translate-x-4 group-hover:translate-y-4 group-hover:-rotate-3"
            >
              <div
                class="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2"
              >
                <img
                  src="https://i.ibb.co/RpHWbYfc/Screenshot-2025-08-14-at-3-38-41-PM.png"
                  alt="মোবাইল প্রিভিউ"
                  class="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            <div
              class="absolute -top-6 -right-6 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:rotate-6"
            >
              <div
                class="flex items-center bg-slate-800/80 backdrop-blur-xl px-4 py-2 rounded-lg border border-white/10 shadow-lg"
              >
                <StarIcon class="w-5 h-5 text-yellow-400 mr-2" />
                <span class="text-white font-bold text-sm"
                  >৪.৯/৫ (১,২৪৩ রিভিউ)</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  EyeIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  StarIcon,
} from "@heroicons/vue/24/solid";
</script>

<style>
/* Add these styles to your existing style block or a global CSS file if not already present */
.text-shadow {
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}
@keyframes blob {
  /* ... existing animation ... */
}
.animate-blob {
  /* ... existing animation ... */
}
.animation-delay-2000 {
  /* ... existing animation ... */
}
@keyframes fadeInUp {
  /* ... existing animation ... */
}
.animate-fade-in-up {
  /* ... existing animation ... */
}
.delay-200 {
  animation-delay: 200ms;
}
@keyframes shimmer {
  /* ... existing animation ... */
}
.animate-shimmer {
  /* ... existing animation ... */
}
</style>

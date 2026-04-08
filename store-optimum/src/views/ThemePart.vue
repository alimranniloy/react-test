<template>
  <section
    class="relative bg-gradient-to-br from-gray-900 to-slate-950 text-white py-24 sm:py-32 px-4 overflow-hidden font-sans"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
    ></div>
    <div
      class="absolute top-0 -left-1/4 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-purple-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50"
    ></div>
    <div
      class="absolute bottom-0 -right-1/4 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-amber-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50"
    ></div>

    <div class="container mx-auto relative z-10">
      <div class="text-center mb-16">
        <span class="text-gray-500 font-semibold uppercase tracking-wider"
          >বিশেষ নির্বাচিত</span
        >
        <h2 class="text-4xl md:text-5xl font-extrabold mt-2 mb-4 text-shadow">
          আপনার প্রয়োজনের জন্য <span class="text-amber-400">পারফেক্ট থিম</span>
        </h2>
        <p class="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
          অসাধারণ ডিজাইন এবং কার্যকারিতা সহ নির্দিষ্ট উদ্দেশ্যে হ্যান্ড-পিক করা
          থিম।
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div class="relative group">
          <div
            class="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition duration-500 z-10"
          >
            <div class="relative h-64 overflow-hidden">
              <img
                src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/e6cedbdf-24a8-4b8c-b38f-956c879c6113.png"
                alt="ই-কমার্স প্রো থিম"
                class="absolute top-0 left-0 w-full h-auto min-h-full object-cover object-top transition-all duration-[3000ms] ease-linear group-hover:-top-1/2"
              />
            </div>

            <div class="p-8">
              <h3 class="text-2xl font-bold text-white">Zero</h3>
              <p class="text-gray-400 mt-1">
                আপনার গ্রোসারি ওয়েবসাইট এর জন্য সেরা থিম, সাশ্রয়ী ও নির্ভরযোগ্য
                প্ল্যাটফর্ম।।
              </p>

              <div class="flex flex-wrap gap-2 my-6">
                <span
                  class="bg-white/10 text-teal-300 px-3 py-1 rounded-full text-xs"
                >
                  WooCommerce
                </span>
                <span
                  class="bg-white/10 text-teal-300 px-3 py-1 rounded-full text-xs"
                >
                  পণ্য দ্রুত দেখুন
                </span>
                <span
                  class="bg-white/10 text-teal-300 px-3 py-1 rounded-full text-xs"
                >
                  ওয়ান-চেকআউট
                </span>
              </div>

              <div class="flex justify-between items-center">
                <a
                  href="https://zero.store.bponi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    class="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full font-semibold text-sm transition duration-300 flex items-center"
                  >
                    <EyeIcon class="w-5 mr-2" /> প্রিভিউ
                  </button>
                </a>

                <router-link to="/pricing">
                  <button
                    class="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-6 py-2 rounded-full font-semibold transition duration-300 shadow-lg hover:shadow-amber-500/40 transform hover:scale-105 text-sm"
                  >
                    প্যাকেজ
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="relative group">
          <div
            class="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition duration-500 z-10"
          >
            <div class="relative h-64 overflow-hidden">
              <img
                src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/131ec897-b789-448e-8062-35e138ae0214.png"
                alt="বইয়ের দোকান থিম"
                class="absolute top-0 left-0 w-full h-auto min-h-full object-cover object-top transition-all duration-[3000ms] ease-linear group-hover:-top-1/2"
              />
            </div>

            <div class="p-8">
              <h3 class="text-2xl font-bold text-white">Boi</h3>
              <p class="text-gray-400 mt-1">
                ঘরে বসেই সব ধরনের বই সহজে পাওয়ার একটি আধুনিক প্ল্যাটফর্ম।
              </p>

              <div class="flex flex-wrap gap-2 my-6">
                <span
                  class="bg-white/10 text-teal-300 px-3 py-1 rounded-full text-xs"
                >
                  বইয়ের কালেকশন
                </span>
                <span
                  class="bg-white/10 text-teal-300 px-3 py-1 rounded-full text-xs"
                >
                  লেখক পরিচিতি
                </span>
                <span
                  class="bg-white/10 text-teal-300 px-3 py-1 rounded-full text-xs"
                >
                  ডার্ক মোড
                </span>
              </div>

              <div class="flex justify-between items-center">
                <a
                  href="https://boiadda.store.bponi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    class="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full font-semibold text-sm transition duration-300 flex items-center"
                  >
                    <EyeIcon class="w-5 mr-2" /> প্রিভিউ
                  </button>
                </a>

                <router-link to="/pricing">
                  <button
                    class="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-6 py-2 rounded-full font-semibold transition duration-300 shadow-lg hover:shadow-amber-500/40 transform hover:scale-105 text-sm"
                  >
                    প্যাকেজ
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="theme in featuredThemes"
          :key="theme.title"
          class="relative group bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/10"
        >
          <div class="relative h-48 overflow-hidden">
            <img
              :src="theme.image"
              :alt="theme.title"
              class="scroll-image w-full h-auto min-h-full object-cover object-top transition-transform duration-[3000ms] ease-linear"
            />
          </div>

          <div class="p-6">
            <h3 class="text-xl font-bold text-white mb-2">
              {{ theme.title }}
            </h3>
            <p class="text-gray-400 text-sm mb-2 h-10">
              {{ theme.description }}
            </p>
            <div class="flex justify-between items-center">
              <a
                :href="theme.link"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-teal-400 hover:text-teal-300 flex items-center text-sm"
              >
                <EyeIcon class="w-5 mr-2" /> প্রিভিউ দেখুন
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { EyeIcon } from "@heroicons/vue/24/outline";

// Since animations that depended on screen size are removed,
// the related logic (isMobile, onMounted, onUnmounted) is no longer needed.

const featuredThemes = [
  {
    title: "Foodi",
    description: "সকল ধরনের পণ্যের জন্য সেরা সমাধান। আমাদের ফুডি থিমে।",
    // ✅ কার্যকরী Placeholder ইমেজ লিঙ্ক
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/a902a251-67df-4a10-83eb-6cc3a2b96203.png",
    link: "https://foodi.store.bponi.com/",
  },
  {
    title: "Tech",
    description:
      "স্মার্ট টেকনোলজি পণ্যের ওয়েবসাইট তৈরির সেরা সমাধান, আমাদের টেক থিমে।",
    // ✅ কার্যকরী Placeholder ইমেজ লিঙ্ক
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/f7402968-e9a5-4849-8018-23b801bafb15.png",
    link: "https://storetech.store.bponi.com/",
  },
  // {
  //   title: "Nova",
  //   description:
  //     "স্মার্ট টেকনোলজি পণ্যের ওয়েবসাইট তৈরির সেরা সমাধান, আমাদের টেক থিমে।",
  //   // ✅ কার্যকরী Placeholder ইমেজ লিঙ্ক
  //   image:
  //     "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/9314a342-1839-4874-8f43-c4057e186d93.png",
  //   link: "https://nova.store.bponi.com/",
  // },
  {
    title: "Zeen",
    description:
      "ফ্যাশন এবং লাইফস্টাইল ব্র্যান্ডের জন্য একটি স্টাইলিশ এবং আধুনিক ডিজাইনের থিম।",
    // ✅ কার্যকরী Placeholder ইমেজ লিঙ্ক
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/e4acff4c-11a8-4757-b979-30e47d53535e.png",
    link: "https://zeen.store.bponi.com/",
  },
];
</script>
<style scoped>
.group:hover .scroll-image {
  /* Move only the hidden overflow portion */
  transform: translateY(calc(-100% + 12rem)); /* 12rem = h-48 */
}
</style>

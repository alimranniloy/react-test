<template>
  <section
    class="relative bg-gradient-to-br from-gray-900 to-slate-950 text-white py-24 sm:py-32 px-4 overflow-hidden font-sans"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
    ></div>
    <div
      class="absolute -top-1/4 left-0 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-purple-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob"
    ></div>
    <div
      class="absolute -bottom-1/4 right-0 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-amber-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000"
    ></div>

    <div class="container mx-auto relative z-10">
      <div class="text-center mb-16 animate-fade-in-up">
        <span class="text-teal-400 font-semibold uppercase tracking-wider"
          >এক্সক্লুসিভ ফিচার</span
        >
        <h2 class="text-4xl md:text-5xl font-extrabold mt-2 mb-4 text-shadow">
          শুধুমাত্র <span class="text-amber-400">BPONI</span> থিমে পাওয়া যায়
        </h2>
        <p class="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
          বাংলাদেশী ডেভেলপার এবং ব্যবসার জন্য বিশেষভাবে ডিজাইন করা ফিচারসমূহ।
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="group relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-400/50 animate-fade-in-up"
          :style="{ 'animation-delay': `${index * 150 + 200}ms` }"
        >
          <div
            class="w-16 h-16 mb-6 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
            :class="feature.gradient"
          >
            <component :is="feature.icon" class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
          <p class="text-gray-400 mb-6 min-h-[72px]">
            {{ feature.description }}
          </p>
          <ul class="space-y-3">
            <li
              v-for="point in feature.points"
              :key="point"
              class="flex items-start text-gray-300"
            >
              <CheckCircleIcon
                class="w-5 h-5 mr-3 mt-0.5 text-teal-400 flex-shrink-0"
              />
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  BoltIcon,
  CloudIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/solid";

const features = [
  {
    icon: BoltIcon,
    gradient: "bg-gradient-to-br from-amber-500 to-amber-700",
    title: "বাংলাদেশী পেমেন্ট গেটওয়ে",
    description:
      "বিকাশ, নগদ, রকেট এবং অন্যান্য স্থানীয় পেমেন্ট সিস্টেমের জন্য বিল্ট-ইন সাপোর্ট।",
    points: ["SSL কমার্স রেডি", "ট্রানজেকশন লগ"],
  },
  {
    icon: CloudIcon,
    gradient: "bg-gradient-to-br from-purple-500 to-blue-600",
    title: "ক্লাউড অপ্টিমাইজড",
    description:
      "বাংলাদেশের সার্ভার লোকেশনের জন্য বিশেষভাবে অপ্টিমাইজড, যা দ্রুত লোডিং নিশ্চিত করে।",
    points: ["DigitalOcean/CDN রেডি", "Lazy Loading ইমেজ"],
  },
  {
    icon: ShieldCheckIcon,
    gradient: "bg-gradient-to-br from-green-500 to-teal-600",
    title: "বাংলাদেশী সাপোর্ট",
    description:
      "যেকোনো প্রয়োজনে স্থানীয় ভাষায় দ্রুত এবং নির্ভরযোগ্য প্রায়োরিটি সাপোর্ট।",
    points: ["ফেসবুক গ্রুপ সাপোর্ট", "টিম ভিউয়ার এক্সেস"],
  },
];
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
  animation: fadeInUp 1s ease-out forwards;
  opacity: 0;
}
</style>

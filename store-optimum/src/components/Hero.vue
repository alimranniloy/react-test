<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-[#04141c] via-[#03282a] to-[#020c14]">
    <AmbientParticles />
    <div class="noise-layer"></div>
    <div class="absolute -top-32 -right-24 w-[420px] h-[420px] bg-emerald-400/20 blur-[180px]"></div>
    <div class="absolute -bottom-32 -left-20 w-[350px] h-[350px] bg-cyan-300/15 blur-[150px]"></div>
    <div
      class="relative z-10 container mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-16"
      :class="heroVisible ? 'animate-hero-fade' : 'opacity-0 translate-y-6'"
    >
      <div class="max-w-3xl mx-auto text-center space-y-6">
        <h1 class="text-4xl leading-tight font-semibold text-white md:text-5xl xl:text-[56px] xl:leading-[1.15]">
          We craft <span class="gradient-text">theme-first stores</span> that feel premium from pixel to parcel.
        </h1>

        <p class="text-lg text-slate-200/80 leading-relaxed">
          Optimum Soft blends story-driven design with reliable tech so your storefronts, mobile apps, and logistics surfaces stay in sync. Launch fast with curated themes, smart automations, and a team obsessed with details.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <a class="hero-btn hero-btn__ghost" href="/contact">
            <span>Let’s build something great</span>
            <ArrowRightCircleIcon class="w-6 h-6" />
          </a>
        </div>
      </div>

      <div class="hero-grid rounded-[36px] border border-white/10 p-6">
        <div class="rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 to-white/[0.02] p-6 md:flex items-center gap-6">
          <div class="flex-1">
            <p class="text-sm uppercase tracking-[0.35em] text-emerald-100/80">
              System-first strategy
            </p>
            <p class="text-2xl font-semibold text-white mt-2">
              Commerce ecosystems with zero guesswork
            </p>
            <p class="text-slate-200/75 mt-3">
              Component libraries, analytics stack, headless APIs and logistics dashboards tuned for founders scaling beyond their first 1,000 orders.
            </p>
          </div>
          <div class="retention-card rounded-2xl border border-white/10 bg-white/5 px-8 py-6 text-center shrink-0">
            <p class="text-4xl font-semibold text-white">97%</p>
            <p class="text-xs uppercase tracking-[0.4em] text-emerald-100 mt-2">
              retention
            </p>
          </div>
        </div>
      </div>

      <div class="stats-panel rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="highlight in heroHighlights"
            :key="highlight.label"
            class="rounded-3xl border border-white/10 bg-transparent text-center py-4"
          >
            <p class="text-3xl font-semibold text-white">{{ highlight.value }}</p>
            <p class="text-xs uppercase tracking-[0.35em] text-emerald-100/80 mt-2">{{ highlight.label }}</p>
            <p class="text-slate-200/80 text-sm mt-2">{{ highlight.detail }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRightCircleIcon } from "@heroicons/vue/24/outline";
import AmbientParticles from "@/components/AmbientParticles.vue";
import { onMounted, ref } from "vue";

const heroVisible = ref(false);
onMounted(() => {
  requestAnimationFrame(() => {
    heroVisible.value = true;
  });
});

const heroHighlights = [
  {
    label: "Website themes",
    value: "12+",
    detail: "Production-ready experiences ready to ship.",
  },
  {
    label: "Projects delivered",
    value: "300+",
    detail: "Commerce rollouts across retail, SaaS, and fintech.",
  },
  {
    label: "On-time delivery",
    value: "98%",
    detail: "Predictable sprints and zero surprise deadlines.",
  },
  {
    label: "Customer support",
    value: "24/7",
    detail: "Dedicated product strategists on standby.",
  },
];
</script>

<style scoped>
.hero-btn {
  @apply inline-flex items-center justify-between gap-3 rounded-full px-6 py-3 font-semibold tracking-tight transition duration-300 ease-out w-full sm:w-auto;
}

.hero-btn__primary {
  background: linear-gradient(120deg, #6ef3c5, #14b8a6, #3b82f6);
  color: #02161b;
  box-shadow: 0 20px 45px rgba(14, 165, 137, 0.35);
}

.hero-btn__primary:hover {
  filter: brightness(1.15);
  transform: translateY(-2px);
}

.hero-btn__ghost {
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.04);
  color: white;
}

.hero-btn__ghost:hover {
  border-color: rgba(110, 243, 197, 0.7);
  transform: translateY(-2px);
}

.hero-grid {
  background: rgba(6, 32, 39, 0.7);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  box-shadow: 0 40px 120px rgba(1, 11, 14, 0.45);
}

.stats-panel {
  background: rgba(6, 32, 39, 0.75);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 25px 65px rgba(1, 10, 13, 0.35);
}

@media (max-width: 768px) {
  .hero-btn {
    justify-content: center;
  }
}

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-hero-fade {
  animation: heroFadeIn 0.9s ease forwards;
}
</style>

<template>
  <section class="relative overflow-hidden bg-[#031821] py-16 lg:py-24">
    <div class="absolute -top-20 right-0 w-[420px] h-[420px] bg-emerald-400/10 blur-[190px]"></div>
    <div class="absolute bottom-0 left-0 w-[320px] h-[320px] bg-cyan-400/10 blur-[160px]"></div>
    <div class="relative z-10 container mx-auto px-6 lg:px-12">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <p class="text-xs uppercase tracking-[0.35em] text-teal-100/70">Solutions that scale with you</p>
          <h2 class="text-3xl lg:text-5xl font-semibold text-white">
            Optimum Soft evolves into your <span class="gradient-text">embedded product team.</span>
          </h2>
          <p class="text-lg text-slate-200/80 leading-relaxed">
            Strategy, design, engineering, and lifecycle marketing flow together so your commerce experience
            feels intentional on every screen. We stay to run experiments, partner with your ops teams, and keep momentum high.
          </p>
          <div class="flex flex-col sm:flex-row gap-6 items-center">
            <div class="rounded-3xl border border-white/15 bg-white/5 px-8 py-6 text-center">
              <p class="text-4xl font-semibold text-white">4.9<span class="text-lg">/5</span></p>
              <p class="text-xs uppercase tracking-[0.35em] text-emerald-100 mt-2">client rating</p>
            </div>
            <p class="text-slate-200/70">
              Growth partners in SaaS, retail, wellness, and fintech rely on Optimum Soft for launches that blend craft with data.
            </p>
          </div>
        </div>
        <div class="relative">
          <div class="rounded-[32px] overflow-hidden border border-white/10 floating-card">
            <img :src="heroImage" alt="Optimum Soft team at work" class="w-full h-full object-cover" />
          </div>
          <div
            class="absolute -bottom-8 -right-4 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl px-6 py-4 w-64"
          >
            <p class="text-xs uppercase tracking-[0.35em] text-emerald-100/80">Operational clarity</p>
            <p class="text-white text-2xl font-semibold mt-1">Status dashboards</p>
            <p class="text-slate-200/75 text-sm mt-1">From backlog to fulfillment. Everyone knows what's shipping next.</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
        <article v-for="solution in solutions" :key="solution.title" class="solution-card">
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-teal-100/70">{{ solution.tag }}</p>
            <h3 class="text-2xl font-semibold text-white mt-2">{{ solution.title }}</h3>
            <p class="text-slate-200/80 mt-2">{{ solution.description }}</p>
          </div>
          <ArrowUpRightIcon class="w-6 h-6 text-emerald-200/80" />
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
import { getAssetUrl } from "@/utils";

const heroImage = getAssetUrl("support-team.jpg");

const solutions = [
  {
    tag: "Design + Research",
    title: "UI/UX design systems",
    description: "Interface patterns, motion, and prototyping that carry from marketing to dashboard.",
  },
  {
    tag: "Full-stack web",
    title: "Web development",
    description: "Headless storefronts, CMS integrations, and automation pipelines built with Vue & Vite.",
  },
  {
    tag: "Mobile",
    title: "Mobile app development",
    description: "Native and cross-platform builds with shared component libraries for instant iteration.",
  },
  {
    tag: "Brand core",
    title: "Brand strategy & identity",
    description: "Naming, messaging, and visual systems that scale across resellers and franchise models.",
  },
  {
    tag: "Growth",
    title: "SEO & performance optimization",
    description: "Speed, structure, and analytics tuned for organic discovery and high-intent funnels.",
  },
  {
    tag: "Product leadership",
    title: "Product strategy & advisory",
    description: "Sprint rituals, success metrics, and experimentation roadmaps delivered as a service.",
  },
];
</script>

<style scoped>
.solution-card {
  @apply flex items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-emerald-200/50 transition duration-300;
}
</style>

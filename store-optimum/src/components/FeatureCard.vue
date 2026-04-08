<template>
  <article
    class="feature-card group relative rounded-3xl border border-white/10 bg-white/5 p-6"
    :class="{ 'cursor-pointer': !!feature.link }"
    @click="handleClick(feature)"
  >
    <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
      <div class="hero-sheen"></div>
    </div>
    <div class="relative z-10 flex flex-col gap-4">
      <div class="flex items-center justify-between gap-4">
        <div
          class="w-14 h-14 rounded-2xl border border-white/15 bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center shadow-xl"
        >
          <img :src="feature.icon" :alt="feature.title" class="w-7 h-7 object-contain" />
        </div>
        <ArrowUpRightIcon
          v-if="feature.link"
          class="w-5 h-5 text-slate-200/60 transition duration-300 group-hover:text-emerald-200 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>
      <div>
        <p class="text-xs uppercase tracking-[0.35em] text-teal-100/70">
          {{ feature.highlight }}
        </p>
        <h3 class="text-2xl font-semibold text-white mt-2">{{ feature.title }}</h3>
      </div>
      <p class="text-sm leading-relaxed text-slate-200/80">
        {{ feature.description }}
      </p>
      <div class="flex items-center gap-2 text-sm text-emerald-200/90 font-semibold">
        <span>{{ feature.meta }}</span>
        <ArrowUpRightIcon class="w-4 h-4" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
import type { Component } from "vue";

interface Feature {
  title: string;
  highlight: string;
  description: string;
  meta: string;
  icon: Component | string;
  link?: string;
}

const props = defineProps<{ feature: Feature }>();

const handleClick = (feature: Feature) => {
  if (feature.link) {
    window.open(feature.link, "_self");
  }
};
</script>

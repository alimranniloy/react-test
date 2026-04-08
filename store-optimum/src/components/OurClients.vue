<template>
  <section class="relative bg-[#04121a] py-16 lg:py-24 overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    <div class="relative z-10 container mx-auto px-6 lg:px-12">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <p class="text-xs uppercase tracking-[0.35em] text-teal-100/70">Selected clients</p>
          <h2 class="text-3xl lg:text-5xl font-semibold text-white">
            Teams we have helped scale with <span class="gradient-text">Optimum Soft</span>
          </h2>
          <p class="text-slate-200/80">
            From lifestyle brands to digital first ventures, we partner with ambitious founders to create systems that
            keep every launch cohesive — design, logistics, analytics, and growth.
          </p>
          <div class="flex flex-col sm:flex-row gap-6">
            <div class="rounded-3xl border border-white/15 bg-white/5 px-6 py-5 flex items-center gap-4">
              <div>
                <p class="text-4xl font-semibold text-white">4.9</p>
                <p class="text-xs uppercase tracking-[0.35em] text-emerald-100/80 mt-1">average rating</p>
              </div>
              <div class="text-amber-200">
                <span v-for="i in 5" :key="i">★</span>
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm text-slate-200/70">
                “Optimum Soft is part of our product team now. They understand our constraints and still ship beautiful work.”
              </p>
              <p class="text-xs uppercase tracking-[0.35em] text-teal-100 mt-3">Head of Digital · Netzsche</p>
            </div>
          </div>
        </div>
        <div class="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_25px_60px_rgba(2,13,18,0.55)]">
          <header class="flex items-center justify-between mb-6">
            <div>
              <p class="text-xs uppercase tracking-[0.35em] text-teal-100/70">Selected clients</p>
              <p class="text-2xl font-semibold text-white mt-2">Brands who trust us</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-slate-200/70">Rated 4.9/5</p>
              <p class="text-xs text-slate-500">Based on 120+ reviews</p>
            </div>
          </header>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div
              v-for="logo in logosList"
              :key="logo.alt"
              class="rounded-2xl border border-white/10 bg-[#041921] flex items-center justify-center px-4 py-3 h-20"
            >
              <img :src="logo.src" :alt="logo.alt" class="max-h-10 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getAssetUrl } from "@/utils";

const logosList = [
  { src: getAssetUrl("clients/boi-shodai.png"), alt: "Boi Shodai" },
  { src: getAssetUrl("clients/mohnaz.png"), alt: "Mohnaz" },
  { src: getAssetUrl("clients/holygift.png"), alt: "Holy Gift" },
  { src: getAssetUrl("clients/book-bd.png"), alt: "Book BD" },
  { src: getAssetUrl("clients/kafela.png"), alt: "Kafela" },
  { src: getAssetUrl("clients/khan-gadget.png"), alt: "Khan Gadget" },
  { src: getAssetUrl("clients/mahira.png"), alt: "Mahira" },
  { src: getAssetUrl("clients/ankur.png"), alt: "Ankur" },
  { src: getAssetUrl("clients/anam-mart.png"), alt: "Anam Mart" },
];
</script>

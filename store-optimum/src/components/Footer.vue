<template>
  <footer id="footer" class="bg-slate-950 text-white">
    <div class="mx-auto max-w-6xl px-6 py-16">
      <div class="grid gap-10 md:grid-cols-3">
        <div class="space-y-4">
          <a href="/" class="inline-flex items-center">
            <img class="h-9 object-contain" :src="optimumLogo" alt="Optimum Soft Logo" />
          </a>
          <p class="text-base text-slate-300">
            Optimum Soft is a digital product studio focused on commerce. We craft end-to-end experiences and stay on to scale them.
          </p>
          <div class="flex gap-3 text-sm text-white/70">
            <span class="rounded-full border border-white/30 px-3 py-1">Commerce</span>
            <span class="rounded-full border border-white/30 px-3 py-1">Product Studio</span>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Quick links</h3>
          <ul class="mt-4 space-y-3 text-base text-slate-300">
            <li v-for="link in footerLinks.quickLinks" :key="link" class="transition hover:text-white">
              {{ link }}
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-white">Contact</h3>
          <p class="mt-4 text-base text-slate-300">
            Subhash Sadan, Champadali More, 22, Jessore Rd, Champadali, Barasat, Kolkata, West Bengal 700124, India
          </p>
          <p class="mt-2 text-base text-slate-300">
            <a href="tel:+918282905838" class="transition hover:text-white">+91 82829 05838</a>
          </p>
          <p class="mt-1 text-base text-slate-300">
            <a href="mailto:contact@optimumsoft.dev" class="transition hover:text-white">
              contact@optimumsoft.dev
            </a>
          </p>
        </div>
      </div>

      <div class="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>&copy; 2026 Optimum Soft. All rights reserved.</p>
        <p>Designed for scalable commerce teams.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import optimumLogo from "@/assets/optimum.png";

// Data for footer navigation links
const footerLinks = {
  quickLinks: ["Work & Case Studies", "Pricing", "Privacy Policy", "Terms & Conditions"],
};
</script>

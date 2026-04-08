<script setup>
import Button from "../ui/Button.vue";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Projects", href: "#projects" },
  { label: "Communities", href: "#communities" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-20 border-b border-white/40 bg-white/80 backdrop-blur-xl"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <a href="#top" class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white font-display text-xl"
        >
          FG
        </div>
        <div class="flex flex-col leading-tight text-slate-800">
          <span class="font-display text-lg font-semibold">Fortress Group</span>
          <span class="text-xs text-slate-500">Land & Construction</span>
        </div>
      </a>
      <nav class="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="rounded-full px-3 py-2 transition hover:bg-brand-50 hover:text-brand-700"
        >
          {{ link.label }}
        </a>
      </nav>
      <div class="hidden items-center gap-3 md:flex">
        <Button variant="secondary" size="sm" as="a" href="tel:+8801313714079">
          +880 13137 14079
        </Button>
        <Button size="sm" as="a" href="#contact">Schedule a call</Button>
      </div>
      <div class="flex items-center md:hidden">
        <Button size="sm" variant="outline" as="a" href="tel:+8801313714079">
          Call Us
        </Button>
      </div>
    </div>
  </header>
</template>

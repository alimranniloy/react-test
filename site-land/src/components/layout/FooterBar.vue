<script setup>
import { ref } from "vue";
import Button from "../ui/Button.vue";
import Input from "../ui/Input.vue";

const email = ref("");

const quickLinks = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
</script>

<template>
  <footer
    id="contact"
    class="relative mt-16 overflow-hidden rounded-t-[36px] bg-gradient-to-br from-brand-900 via-brand-800 to-sand-800 text-white"
  >
    <div class="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
    <div class="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
    <div class="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14">
      <div class="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div class="space-y-4">
          <p class="text-sm uppercase tracking-[0.3em] text-white/70">
            Trusted builders since 1998
          </p>
          <h2 class="font-display text-3xl font-semibold leading-tight md:text-4xl">
            Let’s craft your next landmark together.
          </h2>
          <p class="max-w-xl text-white/80">
            From master-planned communities to bespoke commercial spaces, our team delivers
            end-to-end solutions with transparency, care, and craftsmanship.
          </p>
          <div class="flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" as="a" href="mailto:info@fortress.com.bd">
              info@fortress.com.bd
            </Button>
            <Button size="lg" variant="ghost" as="a" href="tel:+8801313714079">
              +880 13137 14079
            </Button>
          </div>
        </div>
        <div class="glass rounded-3xl border border-white/20 p-6 shadow-xl backdrop-blur-lg">
          <p class="text-sm font-semibold uppercase tracking-wide text-white/80">
            Stay in the loop
          </p>
          <p class="mt-2 text-white/80">
            Monthly insights on projects, investment opportunities, and neighborhood highlights.
          </p>
          <div class="mt-4 flex flex-col gap-3">
            <Input v-model="email" placeholder="Enter your email" type="email" />
            <Button block size="md">Subscribe</Button>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col gap-6 rounded-3xl border border-white/15 bg-white/5 px-6 py-5 shadow-lg backdrop-blur"
      >
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-sm text-white/70">Need help fast?</p>
            <p class="font-display text-xl font-semibold">+880 13137 14080</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <Button variant="secondary" as="a" href="tel:+8801313714079">Call</Button>
            <Button variant="secondary" as="a" href="https://wa.me/8801313714079" target="_blank">
              WhatsApp
            </Button>
            <Button variant="secondary" as="a" href="mailto:info@fortress.com.bd">Email</Button>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4 text-sm text-white/60">
          <div class="flex items-center gap-4">
            <span class="font-semibold text-white">Fortress Group</span>
            <span class="hidden h-1 w-1 rounded-full bg-white/40 md:inline" />
            <span class="hidden md:inline">Dhaka, Bangladesh</span>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <a
              v-for="link in quickLinks"
              :key="link.label"
              :href="link.href"
              class="transition hover:text-white"
            >
              {{ link.label }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

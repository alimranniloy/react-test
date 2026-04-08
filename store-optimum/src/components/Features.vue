<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-[#04151e] via-[#031f24] to-[#021218] py-16 lg:py-24">
    <div class="absolute inset-0 opacity-40">
      <div class="optimum-grid w-full h-full"></div>
    </div>
    <div class="absolute top-20 -left-5 w-[360px] h-[360px] bg-emerald-400/15 blur-3xl"></div>
    <div class="absolute bottom-10 -right-5 w-[300px] h-[300px] bg-cyan-400/15 blur-[140px]"></div>

    <div class="relative z-10 w-full max-w-[1500px] mx-auto px-6">
      <section class="max-w-3xl mx-auto text-center mb-16">
        <p class="text-xs uppercase tracking-[0.35em] text-teal-100/70">Experience pillars</p>
        <h2 class="text-3xl lg:text-5xl font-semibold text-white mt-4">
          Keep every touchpoint on-brand with <span class="gradient-text">Optimum Soft</span>
        </h2>
        <p class="mt-5 text-slate-200/80 leading-relaxed">
          Theme libraries, checkout flows, and post-purchase journeys crafted for founders that want premium polish without the agency chaos.
        </p>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard v-for="(item, index) in features" :key="index" :feature="item" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { getAssetUrl } from "@/utils";
import FeatureCard from "./FeatureCard.vue";

const Checkout = getAssetUrl("steps/checklist.png");
const SuperFast = getAssetUrl("steps/fast-website.png");
const SecureData = getAssetUrl("steps/cyber-security.png");
const DigitalProduct = getAssetUrl("steps/digital-product.png");
const DropShipping = getAssetUrl("steps/logistics.png");
const Multivendor = getAssetUrl("steps/book.png");

const features = [
  {
    highlight: "Experience design",
    title: "Frictionless checkout journeys",
    description:
      "One-tap payments, address intelligence, and saved preferences help customers glide from inspiration to purchase.",
    meta: "Hand-off ready prototypes",
    icon: Checkout,
    link: "/pricing",
  },
  {
    highlight: "Reseller stack",
    title: "Resell-ready storefronts",
    description:
      "Launch layered storefronts so partners can push your products under their own brand without touching the codebase.",
    meta: "White-label controls",
    icon: SuperFast,
    link: "/feature-details",
  },
  {
    highlight: "Security first",
    title: "Customer data vaults",
    description:
      "Zero-trust access, audit trails, and encryption to protect every profile, invoice, and session on the platform.",
    meta: "SOC2 aligned",
    icon: SecureData,
  },
  {
    highlight: "Digital catalogues",
    title: "Sell apps, templates & seats",
    description:
      "Deliver licenses, gated downloads, subscriptions, or learning cohorts with automated fulfillment workflows.",
    meta: "Instant delivery",
    icon: DigitalProduct,
  },
  {
    highlight: "Logistics automation",
    title: "Drop shipping command center",
    description:
      "Route orders to partners, sync inventory, and surface SLA health across every warehouse in one timeline.",
    meta: "Realtime dashboards",
    icon: DropShipping,
  },
  {
    highlight: "Marketplace layer",
    title: "Multi-vendor orchestration",
    description:
      "Give every seller their own analytics, payouts, and merch rights without losing control of brand consistency.",
    meta: "Governance baked-in",
    icon: Multivendor,
  },
];
</script>

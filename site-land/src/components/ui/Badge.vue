<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "brand",
  },
});

const variants = {
  brand: "bg-brand-100 text-brand-700 border-brand-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  sand: "bg-sand-100 text-sand-700 border-sand-200",
};
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide"
    :class="variants[variant] || variants.brand"
  >
    <slot />
  </span>
</template>

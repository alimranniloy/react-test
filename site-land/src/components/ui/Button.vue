<script setup>
import { computed } from "vue";

const props = defineProps({
  as: {
    type: String,
    default: "button",
  },
  variant: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "md",
  },
  block: {
    type: Boolean,
    default: false,
  },
});

const variants = {
  primary:
    "bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500 focus-visible:ring-brand-500",
  secondary:
    "bg-white text-brand-700 border border-brand-100 hover:border-brand-200 hover:bg-brand-50 focus-visible:ring-brand-200",
  ghost:
    "bg-transparent text-slate-800 hover:bg-slate-100 focus-visible:ring-slate-200",
  outline:
    "border border-slate-200 text-slate-800 bg-white hover:bg-slate-50 focus-visible:ring-slate-200",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

const classes = computed(() => {
  const base =
    "inline-flex items-center justify-center font-semibold tracking-tight transition-all rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  return [
    base,
    variants[props.variant] || variants.primary,
    sizes[props.size] || sizes.md,
    props.block ? "w-full" : "",
  ]
    .filter(Boolean)
    .join(" ");
});
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>

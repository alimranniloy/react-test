<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  align: {
    type: String,
    default: "left",
  },
});
</script>

<template>
  <div
    class="flex flex-col gap-3"
    :class="{
      'text-center items-center': align === 'center',
      'text-left items-start': align !== 'center',
    }"
  >
    <p
      v-if="eyebrow"
      class="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600"
    >
      {{ eyebrow }}
    </p>
    <h2 class="font-display text-3xl md:text-4xl font-semibold leading-tight">
      {{ title }}
    </h2>
    <p v-if="description" class="max-w-2xl text-slate-600 text-base md:text-lg">
      {{ description }}
    </p>
  </div>
</template>

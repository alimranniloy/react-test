<script setup>
defineProps({
  label: String,
  value: [String, Number],
});
</script>

<template>
  <div class="flex flex-col gap-1 rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
    <span class="text-xs uppercase tracking-wide text-slate-500">{{ label }}</span>
    <span class="font-display text-2xl font-semibold text-slate-900">
      {{ value }}
    </span>
  </div>
</template>

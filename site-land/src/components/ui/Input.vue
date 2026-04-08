<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <input
    :value="modelValue"
    :placeholder="placeholder"
    :type="type"
    class="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-inner outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>

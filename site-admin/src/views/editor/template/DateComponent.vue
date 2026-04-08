<template>
    <input type="date" :value="value" @input="e => emit('input', e.target.value)"
        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed" />
</template>
<script setup>
const props = defineProps({
    value: {
        type: String,
        required: true
    }
});
const emit = defineEmits(["input"]);
</script>


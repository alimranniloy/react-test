<template>
    <input type="number" :value="value"
        @input="e => emit('input', parseFloat(e.target.value) ? parseFloat(e.target.value) : 0)"
        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:bg-white focus:border-yellow-300" />
</template>
<script setup>
const props = defineProps({
    value: {
        type: [Number, String],
        required: true
    }
});
const emit = defineEmits(["input"]);
</script>

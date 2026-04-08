<template>
  <div class="space-y-3 p-4 bg-transparent rounded-lg">
    <div class="font-semibold rounded-lg w-full mb-4">
      <span>{{ title }}</span>
    </div>

    <ul class="ml-1 text-sm">
      <li v-for="(item, index) in listItems" :key="index" class="flex gap-1">
        <CheckCircleIcon class="h-5 w-5 text-green-600" />
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { CheckCircleIcon } from "@heroicons/vue/solid";

// Props to receive title and listItems
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  listItems: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
/* Add any additional styles here */
</style>

<template>
  <component :is="getComponent(name)" :class="className"></component>
</template>

<script setup>
import { defineProps } from "vue";
import * as Heroicons from "@heroicons/vue/24/outline";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: false,
    default: "h-4 w-4",
  },
});
const getComponent = (item) => {
  return Heroicons[item] ? Heroicons[item] : null;
};
</script>

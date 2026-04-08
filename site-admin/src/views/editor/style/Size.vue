<template>
  <ul class="text-gray-500 bg-white text-sm shadow-sm font-medium text-center border flex rounded-3xl mb-3 p-1">
    <li @click="onSelect('')" class="w-full cursor-pointer "
      :class="size == '' ? 'bg-black text-white border shadow border-gray-500 rounded-2xl' : ''">
      <span
        class="inline-block px-1  rounded-2xl focus:ring-4 focus:ring-blue-300 focus:outline-none no-underline mb-0 text-xs">ALL</span>
    </li>
    <li @click="onSelect('sm')" class="w-full cursor-pointer "
      :class="size == 'sm' ? 'bg-black text-white border shadow border-gray-500 rounded-2xl' : ''">
      <span
        class="inline-block px-1  rounded-2xl focus:ring-4 focus:ring-blue-300 focus:outline-none no-underline mb-0 text-xs">SM</span>
    </li>
    <li @click="onSelect('md')" class="w-full cursor-pointer "
      :class="size == 'md' ? 'bg-black text-white border shadow border-gray-500 rounded-2xl' : ''">
      <span
        class="inline-block px-1  rounded-2xl focus:ring-4 focus:ring-blue-300 focus:outline-none no-underline mb-0 text-xs">MD</span>
    </li>
    <li @click="onSelect('lg')" class="w-full cursor-pointer "
      :class="size == 'lg' ? 'bg-black text-white border shadow border-gray-500 rounded-2xl' : ''">
      <span
        class="inline-block px-1  rounded-2xl focus:ring-4 focus:ring-blue-300 focus:outline-none no-underline mb-0 text-xs">LG</span>
    </li>
    <li @click="onSelect('xl')" class="w-full cursor-pointer "
      :class="size == 'xl' ? 'bg-black text-white border shadow border-gray-500 rounded-2xl' : ''">
      <span
        class="inline-block px-1  rounded-2xl focus:ring-4 focus:ring-blue-300 focus:outline-none no-underline mb-0 text-xs">XL</span>
    </li>
    <li @click="onSelect('2xl')" class="w-full cursor-pointer "
      :class="size == '2xl' ? 'bg-black text-white border shadow border-gray-500 rounded-2xl' : ''">
      <span
        class="inline-block px-1  rounded-2xl focus:ring-4 focus:ring-blue-300 focus:outline-none no-underline mb-0 text-xs">2XL</span>
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  option: {
    type: String,
    required: false,
  },
});
const size = ref(props.option ? props.option : '')
const emit = defineEmits(["onSelect"]);
const onSelect = (data) => {
  size.value = data;
  emit("onSelect", data);
};
</script>

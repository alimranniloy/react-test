<template>
  <Menu as="div" class="relative">
    <div class="text-slate-800 text-xs font-medium flex items-center">
      {{ title }}
    </div>
    <MenuButton class="px-2 py-2 text-xs border rounded w-full mt-1 flex items-center"
      :class="option ? 'text-gray-800' : ''">
      {{ option ? option.split(/:(.*)/s).length > 1 ? option.split(/:(.*)/s)[1] : option : options[0] }}</MenuButton>
    <MenuItems
      class="absolute z-40 rounded-md shadow-lg mt-5 overflow-y-auto bg-white max-h-[200px] min-w-[100px] border-separate">
      <MenuItem @click="onSelect(item)" as="div" v-for="item in options" :key="item"
        class="py-2 cursor-pointer hover:bg-green-50 px-3" v-slot="{ active }">
      <div class="text-slate-800 text-xs font-medium flex items-center">
        {{ item }}
      </div>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>

<script setup>
import { ref } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  option: {
    type: String,
    required: false,
  },
  options: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["onSelect"]);
const onSelect = (data) => {
  emit("onSelect", data);
};
</script>

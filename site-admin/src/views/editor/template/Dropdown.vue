<template>
  <Menu as="div" class="relative">
    <MenuButton><PlusIcon class="h-3 w-3" /></MenuButton>
    <MenuItems
      as="div"
      class="bg-white shadow border rounded-md absolute right-0 px-2 py-2 z-40 min-w-[150px]"
    >
      <MenuItem
        @click="onSelect(item.value)"
        as="div"
        v-for="item in items"
        :key="item.value"
        v-slot="{ active }"
      >
        <button
          class="px-2 py-1 rounded-md text-xs text-gray-700 w-full text-left"
          :class="{ 'bg-gray-100': active }"
        >
          {{ item.title }}
        </button>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>
<script setup>
import { PlusIcon } from "@heroicons/vue/24/outline";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["select"]);
const onSelect = (data) => {
  emit("select", data);
};
</script>

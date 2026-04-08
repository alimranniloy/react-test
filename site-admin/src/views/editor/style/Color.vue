<template>
  <Menu as="div" class="relative">
    <div class="text-slate-800 text-xs font-medium flex items-center">
      {{ title }}
    </div>
    <MenuButton class="px-2 py-2 text-xs border rounded w-full mt-1 flex items-center"
      :class="option ? 'text-gray-800' : ''">
      <div class="h-5 w-5 rounded-full pa-2 mr-2 border" :class="
          option
            ? `bg-${
                option.split(/-(.*)/s).length > 1
                  ? option.split(/-(.*)/s)[1]
                  : 'white'
              }`
            : 'bg-white '
        "></div>
      {{
      option
      ? option.split(/-(.*)/s).length > 1
      ? option.split(/-(.*)/s)[1]
      : "white"
      : `select color`
      }}
    </MenuButton>
    <MenuItems
      class="absolute z-40 rounded-md shadow-lg mt-5 overflow-y-auto px-4 bg-white max-h-[300px] min-w-[150px]">
      <MenuItem as="div" v-for="item in options" :key="item.base" class="py-2" v-slot="{ active }">
      <div class="text-slate-800 text-sm font-medium flex items-center mb-2 capitalize">
        {{ item.base }}
      </div>
      <div class="grid grid-cols-4 gap-3">
        <div class="h-5 w-5 rounded cursor-pointer" @click="onSelect(`${item.base}-${shade.name}`)"
          :style="{ backgroundColor: shade.code }" v-for="shade in item.shades" :key="shade.code"></div>
      </div>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>

<script setup>
import { kebabCase } from "lodash";
import colors from "tailwindcss/colors";
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
});
const unwantedColors = [
  "inherit",
  "white",
  "black",
  "current",
  "transparent",
  "lightBlue",
  "warmGray",
  "trueGray",
  "coolGray",
  "blueGray",
];
const colorKeys = Object.keys(colors).filter(
  (base) => !unwantedColors.includes(base)
);

const options = colorKeys.map((base) => ({
  base,
  shades: Object.keys(colors[base]).map((shade) => ({
    name: shade,
    code: colors[base][shade],
  })),
}));

const flattenedOptions = [];

colorKeys.forEach((base) => {
  Object.keys(colors[base]).forEach((shade) => {
    flattenedOptions.push(`${base}-${shade}`);
  });
});
const emit = defineEmits(["onSelect"]);
const onSelect = (data) => {
  emit("onSelect", data);
};
</script>

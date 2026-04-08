<template>
  <RadioGroup class="flex items-center gap-3" name="size">
    <RadioGroupOption @click="onSelect(item.name, selectOption == item.name)"
      class="h-10 w-10 flex items-center justify-center rounded cursor-pointer bg-white text-black duration-300"
      :class="selectOption == item.name ? 'border-2 border-black bg-gray-50' : 'border'" v-for="item in options"
      :key="item.name" v-slot="{ checked }" :value="item.name">
      <img v-lazy="item.image" alt="alt" class="false" />
    </RadioGroupOption>
  </RadioGroup>
</template>

<script setup>
import { ref } from "vue";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  option: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
});
const selectOption = ref(props.option);
const emit = defineEmits(["onSelect", "onRemove"]);
const onSelect = (data, status) => {
  if (status) {
    selectOption.value = null;
    emit("onRemove", data);
  } else {
    selectOption.value = data;
    emit("onSelect", data);
  }
};
</script>

<template>
  <div class="text-sm mb-4 md:mb-6">
    <fieldset
      class="relative bg-white border-2 shadow-sm rounded-md focus-within:border-[--primary]"
      :class="message ? 'border-red-600' : 'border-gray-200'"
    >
      <legend
        class="text-xs font-medium text-gray-900 mx-2 px-0.5"
        :class="message ? 'text-red-600' : ''"
      >
        Phone Number *
      </legend>
      <input
        ref="inputFocus"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="tel"
        :name="name"
        :id="id"
        :readonly="readonly"
        placeholder="Enter your phone number"
        autocomplete="off"
        class="w-full border-0 rounded-md p-3 pt-1.5 text-gray-600 placeholder-gray-400 placeholder:text-sm text-sm md:text-base focus:ring-0 focus:border-o"
      />
      <div
        v-if="editable"
        class="absolute top-1.5 md:top-2 right-0 flex items-center pr-3"
      >
        <span class="text-green-500 md:cursor-pointer" @click="handleClick"
          >Edit</span
        >
      </div>
    </fieldset>
    <div
      v-if="message"
      class="text-red-600 font-medium flex items-center gap-1 mt-1"
    >
      <span>
        <ExclamationCircleIcon class="w-5 h-5" />
      </span>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
// --- FIXES ARE HERE ---
import { onMounted, ref } from "vue"; // 1. Import ref, not useTemplateRef
import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";

// Define props for dynamic customization
const props = defineProps({
  modelValue: String, // UserInput value
  message: String,
  name: String,
  id: String,
  editable: Boolean,
  readonly: Boolean,
});

// 2. Declare a ref with the *same name* as the template ref attribute
const inputFocus = ref(null);

// 3. Add "updatePage" to the emits array
const emit = defineEmits(["update:modelValue", "updatePage"]);

const handleClick = () => {
  emit("updatePage", "Initial"); // This will now work
};

onMounted(() => {
  // 4. Access the element via .value
  if (!props.readonly && inputFocus.value) {
    inputFocus.value.focus();
  }
});
</script>

<template>
  <div class="mb-2 md:mb-4">
    <fieldset
      class="relative bg-white border-2 shadow-sm rounded-md focus-within:border-[--primary]"
      :class="message ? 'border-red-600' : 'border-gray-200'"
    >
      <legend
        class="text-xs font-medium text-gray-900 mx-2 px-0.5"
        :class="message ? 'text-red-600' : ''"
      >
        {{ label }} *
      </legend>
      <input
        ref="password"
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="showPassword ? 'text' : 'password'"
        :name="name"
        autocomplete="off"
        :placeholder="placeholder"
        class="w-full border-0 rounded-md p-3 pt-1.5 text-gray-600 placeholder-gray-400 placeholder:text-sm text-sm md:text-base focus:ring-0"
      />
      <EyeIcon
        v-if="showPassword"
        @click="togglePassword"
        class="w-5 h-5 text-gray-800 absolute top-1.5 md:top-2 right-2 md:cursor-pointer"
      />
      <EyeSlashIcon
        v-else
        @click="togglePassword"
        class="w-5 h-5 text-gray-800 absolute top-1.5 md:top-2 right-2 md:cursor-pointer"
      />
    </fieldset>
    <div
      v-if="message"
      class="text-red-600 text-sm font-medium flex items-center gap-1 mt-1"
    >
      <span>
        <ExclamationCircleIcon class="w-5 h-5" />
      </span>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
// 1. 'useTemplateRef' has been removed
import { ref, onMounted } from "vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";

// Define props for dynamic customization
const props = defineProps({
  modelValue: String, // Password value
  label: { type: String, default: "Password" },
  placeholder: { type: String, default: "Enter your password" },
  message: { type: String, default: "" },
  required: { type: Boolean, default: false },
  name: { type: String, default: "password" },
  id: { type: String, default: "password" },
  page: { type: String },
});

const emit = defineEmits(["update:modelValue"]);

const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 2. The variable name 'password' now matches the template ref="password"
const password = ref(null);

onMounted(() => {
  // 3. Use the correct 'password.value' to access the element
  if (props.page !== "Create" && password.value) {
    password.value.focus();
  }
});
</script>

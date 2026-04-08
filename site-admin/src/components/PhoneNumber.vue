<template>
  <div
    :class="height"
    class="relative rounded-md border px-3 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
  >
    <label
      for="phone"
      class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
      >{{title ? title : 'Phone' }}</label
    >


    <input
      v-model="phoneNumber"
      :placeholder="placeholder ? placeholder : selectedCountryPlaceholder"
      @input="validatePhoneNumber"
      :disabled="disabled"
      type="text"
      name="phone-number"
      id="phone-number"
      autocomplete="off"
      class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
    />
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
    >
      <ExclamationCircleIcon
        v-if="phoneNumberError"
        class="h-5 w-5 text-red-500"
        aria-hidden="true"
      />
      <CheckCircleIcon
        v-else
        class="h-5 w-5 text-green-500"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import { ref, computed } from "vue";
import parsePhoneNumber from "libphonenumber-js/max";
const props = defineProps({
  placeholder: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: false,
  },
  height: {
    type: String,
    required: false,
    default: "py-2",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const emit = defineEmits(["onPhone"]);
const countries = [
  { code: "BD", placeholder: "Enter phone" },
  { code: "US", placeholder: "Enter phone" },
  { code: "CA", placeholder: "Enter phone" },
  { code: "GB", placeholder: "Enter phone" },
  { code: "AU", placeholder: "Enter phone" },
];
const selectedCountry = ref("BD");
const phoneNumber = ref(props.phone ? props.phone : "");
const phoneNumberError = ref(true);

const selectedCountryPlaceholder = computed(() => {
  return countries.find((country) => country.code === selectedCountry.value)
    .placeholder;
});

const onChangeCountry = () => {
  phoneNumber.value = "";
  phoneNumberError.value = true;
};

const validatePhoneNumber = () => {
  const phone = phoneNumber.value.toString();
  const countryCode = selectedCountry.value;

  try {
    const parsedPhoneNumber = parsePhoneNumber(phone, countryCode);
    if (!parsedPhoneNumber.isValid()) {
      throw new Error("Invalid phone number");
    }
    phoneNumberError.value = false;
    emit("onPhone", parseInt(parsedPhoneNumber.number));
  } catch (error) {
    phoneNumberError.value = true;
  }
};
if (props.phone) {
  validatePhoneNumber();
  phoneNumberError.value = false;
}
</script>

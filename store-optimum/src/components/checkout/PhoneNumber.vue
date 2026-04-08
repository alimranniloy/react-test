<template>
  <div>
    <div class="relative rounded border px-3 py-3 mb-6">
      <label
        for="phone"
        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
        >{{ props.title }}</label
      >
      <input
        v-model="phoneNumber"
        :placeholder="selectedCountryPlaceholder"
        @input="validatePhoneNumber"
        type="text"
        name="phone-number"
        id="phone-number"
        autocomplete="off"
        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent focus:ring-0 sm:text-sm"
        placeholder="Enter phone, e.g. +91 98369 41943"
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
  </div>
</template>

<script setup>
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import { ref, computed, onMounted } from "vue";
import parsePhoneNumber from "libphonenumber-js/max";
const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: false,
  },
});
const emit = defineEmits(["onPhone"]);
const countries = [
  { code: "IN", placeholder: "Enter phone, e.g. +91 98369 41943" },
  { code: "BD", placeholder: "Enter phone" },
  { code: "US", placeholder: "(555) 555-5555" },
  { code: "CA", placeholder: "(555) 555-5555" },
  { code: "GB", placeholder: "020 7123 4567" },
  { code: "AU", placeholder: "(02) 5555 5555" },
];
const selectedCountry = ref("IN");
const phoneNumber = ref(props.phone ? props.phone : "");
const phoneNumberError = ref(true);

const selectedCountryPlaceholder = computed(() => {
  return countries.find((country) => country.code === selectedCountry.value)
    .placeholder;
});

// const onChangeCountry = () => {
//   phoneNumber.value = "";
//   phoneNumberError.value = true;
// };

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
onMounted(() => {
  if (props.phone) {
    validatePhoneNumber();
    phoneNumberError.value = false;
  }
});
</script>

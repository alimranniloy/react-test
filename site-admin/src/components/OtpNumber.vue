<template>
  <div class="flex space-x-3 justify-center">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      v-model.number="otp[index]"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      :name="'otp_' + props.otpFor"
      autocomplete="off"
      class="text-center gap-10 text-sm border border-gray-300 rounded-md py-2 px-2 w-full focus:outline-none focus:ring focus:ring-blue-400"
      @keydown.backspace="backspace(index)"
      @keydown.delete="clear(index)"
      @input="focusNext(index)"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["onOtp"]);
const props = defineProps({
  otpFor: {
    type: String,
    required: true,
  },
});
const digits = [0, 1, 2, 3, 4, 5];
const otp = ref(["", "", "", "", "", ""]);
const isInvalid = ref(false);
const backspace = (index) => {
  if (index > 0) {
    otp.value[index - 1] = "";
  }
};
const clear = (index) => {
  if (otp.value[index]) {
    otp.value[index] = "";
  } else if (index > 0) {
    otp.value[index - 1] = "";
  }
  const input = document.querySelectorAll(
    "input[name=otp_" + props.otpFor + "]"
  )[index - 1];
  if (input) {
    input.focus();
  }
};
const focusNext = (index) => {
  if (index < digits.length - 1) {
    otp.value[index + 1] = "";
    const input = document.querySelectorAll(
      "input[name=otp_" + props.otpFor + "]"
    )[index + 1];
    if (input) {
      input.focus();
    }
  }
  if (otp.value.join("").length == 6) {
    emit("onOtp", parseInt(otp.value.join("")));
  }
};
</script>

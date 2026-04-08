<template>
  <div class="flex space-x-3 justify-center">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      v-model="otp[index]"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      :name="'otp_' + props.otpFor"
      autocomplete="off"
      class="text-center gap-10 text-sm border border-gray-300 rounded-md py-2 px-2 w-full focus:outline-none focus:ring focus:ring-blue-400"
      @keydown.backspace="backspace(index, $event)"
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
  timer: {
    type: Number,
    required: false,
  },
});

const digits = [0, 1, 2, 3, 4, 5];
const otp = ref(["", "", "", "", "", ""]);

const backspace = (index, event) => {
  if (event.target.value === "" && index > 0) {
    otp.value[index - 1] = ""; // Only clear the previous digit if the current one is empty
    focusInput(index - 1);
  } else {
    otp.value[index] = "";
  }
};

const clear = (index) => {
  otp.value[index] = "";
};

const focusNext = (index) => {
  if (otp.value[index] && index < digits.length - 1) {
    focusInput(index + 1);
  }
  if (otp.value.join("").length === 6) {
    let otpValue = otp.value.join("")    
    emit("onOtp", parseInt(otpValue));
  }
};

const focusInput = (index) => {
  const inputs = document.querySelectorAll("input[name=otp_" + props.otpFor + "]");
  if (inputs[index]) {
    inputs[index].focus();
  }
};
</script>

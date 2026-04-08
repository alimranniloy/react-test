<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-[99]">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>
      <div
        class="fixed inset-0 z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300"
      >
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-xl sm:p-6"
            >
              <div
                class="flex absolute top-0 right-0 p-4 justify-between w-full z-40"
              >
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-offset-2"
                  @click="cancel()"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div
                class="my-4 h-[80vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300 relative"
              >
                <div v-for="img in extraImages" :key="img.id">
                  <img v-lazy="img.image" class="h-full w-full" />
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  @click="cancel()"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
const props = defineProps({
  extraImages: {
    type: Array,
    required: true,
  },
});
const open = ref(true);
const emit = defineEmits(["canceled"]);
const cancel = () => {
  emit("canceled");
  open.value = true;
};
</script>

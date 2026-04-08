<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="hover-animation fixed inset-0 bg-black/40" />
      </TransitionChild>
      <div
        class="fixed inset-0 overflow-y-auto scrollbar-thin p-4 flex items-center justify-center"
      >
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="flex justify-center w-full items-center relative h-full"
          >
            <button
              @click="back"
              class="custom-button main-tab absolute z-10 hover:bg-light-primary/10 active:bg-light-primary/20 left-2"
              type="button"
              tabindex="0"
            >
              <ArrowLeftIcon class="h-6 w-6 text-white" /></button
            ><button
              @click="forward"
              class="custom-button main-tab absolute z-10 hover:bg-light-primary/10 active:bg-light-primary/20 right-2 order-1"
              type="button"
            >
              <ArrowRightIcon class="h-6 w-6 text-white" />
            </button>
            <div
              class="relative mx-auto"
              data-projection-id="64"
              style="opacity: 1; transform: none"
            >
              <picture :key="index" class="group relative flex max-w-3xl">
                <img
                  class="max-h-[75vh] rounded-md object-contain md:max-h-[80vh]"
                  v-lazy="images[index].image"
                  alt="''"
                />

                <a
                  class="trim-alt accent-tab absolute bottom-0 right-0 mx-2 mb-2 translate-y-4 rounded-md bg-main-background/40 px-2 py-1 text-sm text-light-primary/80 opacity-0 transition hover:bg-main-accent hover:text-white focus-visible:translate-y-0 focus-visible:bg-main-accent focus-visible:text-white focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 dark:text-dark-primary/80"
                  :href="images[index].image"
                  target="_blank"
                  rel="noreferrer"
                  >{{ index + 1 }} / {{ images.length }} Image</a
                ></picture
              ><a
                class="custom-underline absolute left-0 -bottom-7 font-medium text-light-primary/80 decoration-transparent underline-offset-2 transition hover:text-light-primary hover:underline hover:decoration-light-primary focus-visible:text-light-primary dark:text-dark-primary/80 dark:hover:text-dark-primary dark:hover:decoration-dark-primary dark:focus-visible:text-dark-primary"
                :href="images[index].image"
                target="_blank"
                rel="noreferrer"
                >Open original</a
              >
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
      <div
        class="fixed bottom-10 mx-auto inset-x-0 flex justify-center w-full items-center z-40"
      >
        <button
          @click="closeModal"
          class="hover:bg-light-primary/10 active:bg-light-primary/20"
          type="button"
          tabindex="0"
        >
          <XCircleIcon class="h-8 w-8 text-white" />
        </button>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from "@headlessui/vue";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["close"]);
const isOpen = ref(true);
const index = ref(0);
const back = () => {
  if (index.value > 0) {
    index.value -= 1;
  }
};
const forward = () => {
  if (index.value < props.images.length - 1) {
    index.value += 1;
  }
};
function closeModal() {
  emit("close");
  isOpen.value = false;
}
</script>

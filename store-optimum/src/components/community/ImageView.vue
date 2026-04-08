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
              class="bg-white custom-button main-tab absolute z-10 left-2"
              type="button"
              tabindex="0"
            >
              <ArrowLeftIcon class="h-6 w-6 text-black" /></button
            ><button
              @click="forward"
              class="bg-white custom-button main-tab absolute z-10 right-2 order-1"
              type="button"
            >
              <ArrowRightIcon class="h-6 w-6 text-black" />
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
                  class="trim-alt accent-tab absolute bottom-0 right-0 mx-2 mb-2 translate-y-4 rounded-md bg-white/40 px-2 py-1 text-sm text-accent-red/80 opacity-0 transition hover:bg-main-accent hover:text-white focus-visible:translate-y-0 focus-visible:bg-main-accent focus-visible:text-white focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
                  :href="images[index].image"
                  target="_blank"
                  rel="noreferrer"
                  >{{ index + 1 }} / {{ images.length }} Image</a
                ></picture
              ><a
                class="custom-underline absolute left-0 -bottom-7 font-medium text-accent-red/80 decoration-transparent underline-offset-2 transition hover:text-accent-red hover:underline hover:decoration-accent-red focus-visible:text-accent-red"
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
        class="fixed top-12 mx-auto inset-x-0 flex justify-center w-full items-center z-40"
      >
        <button @click="closeModal" class="" type="button" tabindex="0">
          <XCircleIcon class="h-12 w-12 text-white" />
        </button>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref, defineAsyncComponent } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  CheckIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});
const { site } = storeToRefs(useSiteStore());
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
const closeModal = () => {
  emit("close");
  isOpen.value = false;
}
</script>

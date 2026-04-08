<template>
  <TransitionRoot as="template" :show="isAppDownload && isMobile">
    <Dialog as="div" class="relative z-[99]" @close="cancel()">
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
        class="fixed -inset-4 z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300"
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
              class="relative transform overflow-hidden rounded-t-3xl bg-white px-4 pt-4 pb-4 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg sm:p-6"
            >
              <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-offset-2"
                  @click="cancel()"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <h6 class="text-md text-center border-b pb-3 mb-3 font-semibold">
                Open {{ site.title }} in...
              </h6>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img class="h-10 w-10 rounded-full" v-lazy="site.favicon" />
                  <h6 class="text-md ml-4 font-semibold capitalize">
                    {{ site.title }} App
                  </h6>
                </div>
                <a
                  :href="
                    site.androidApp
                      ? site.androidApp
                      : `https://play.google.com/store/apps/details?id=com.bponi.site_${site.hostname}`
                  "
                  target="_blank"
                  type="button"
                  class="inline-flex justify-center rounded-2xl border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Open
                </a>
              </div>
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center">
                  <img
                    class="h-10 w-10 rounded-full"
                    v-lazy="
                      'https://bponi.sgp1.cdn.digitaloceanspaces.com/asset/browser/' +
                      result.name +
                      '.svg'
                    "
                  />
                  <h6 class="text-md ml-4 font-semibold capitalize">
                    {{ result.name }}
                  </h6>
                </div>
                <button
                  @click="cancel()"
                  type="button"
                  class="inline-flex justify-center rounded-2xl border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Continue
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
import { onMounted, ref } from "vue";
import browser from "browser-detect";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { useSiteStore } from "@/stores/site";
import { storeToRefs } from "pinia";
const { site, isMobile, isAppDownload } = storeToRefs(useSiteStore());
const open = ref(false);
const cancel = () => {
  open.value = false;
  isAppDownload.value = false;
};
const result = ref(browser());
onMounted(() => {
  if (isAppDownload.value && !document.location.origin.includes("bponi.com")) {
    setTimeout(() => {
      open.value = true;
    }, 100000);
  }
});
</script>

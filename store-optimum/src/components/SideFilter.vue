<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-[100]" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-[#0000004d] bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed md:top-[135px] inset-y-0 right-0 flex max-w-full pl-10"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <div
                  class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl rounded-tl-2xl rounded-bl-2xl"
                >
                  <div class="px-4 sm:px-6">
                    <div class="flex items-start justify-between">
                      <div class="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-0 outline-0"
                          @click="open = false"
                        >
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      <DialogTitle class="text-lg font-medium text-gray-900"
                        >Filter</DialogTitle
                      >
                    </div>
                  </div>
                  <div
                    class="relative px-4 sm:px-6 flex min-h-0 flex-1 flex-col overflow-y-scroll py-6"
                  >
                    <!-- Replace with your content -->
                    <div class="bg-white pb-5 relative">
                      <h2 class="mb-4 text-[18px] font-semibold">Show first</h2>
                      <RadioGroup v-model="selected">
                        <RadioGroupLabel class="sr-only">
                          Privacy setting
                        </RadioGroupLabel>
                        <div class="space-y-5 bg-white">
                          <RadioGroupOption
                            as="template"
                            v-for="(radioOption, radioIdx) in radioOptions"
                            :key="radioOption.id"
                            :value="radioOption"
                            v-slot="{ checked, active }"
                          >
                            <div
                              :class="[
                                radioIdx === 0 ? '' : '',
                                radioIdx === radioOption.length - 1 ? '' : '',
                                checked ? 'z-10' : '',
                                'relative flex justify-between cursor-pointer focus:outline-none',
                              ]"
                            >
                              <span class="flex">
                                <RadioGroupLabel
                                  as="span"
                                  :class="[
                                    checked ? '' : 'text-gray-900',
                                    'block text-base font-medium',
                                  ]"
                                  >{{ radioOption.title }}</RadioGroupLabel
                                >
                              </span>
                              <span
                                :class="[
                                  checked
                                    ? 'bg-[#fde046] border-transparent'
                                    : 'bg-white border-gray-300',
                                  active ? '' : '',
                                  'mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded-full border flex items-center justify-center',
                                ]"
                                aria-hidden="true"
                              >
                                <span class="rounded-full bg-white w-2 h-2" />
                              </span>
                            </div>
                          </RadioGroupOption>
                        </div>
                      </RadioGroup>
                    </div>
                    <div class="bg-white py-5">
                      <h2 class="mb-4 text-[18px] font-semibold">Category</h2>
                      <div class="flex flex-wrap gap-2 mt-5">
                        <button
                          v-for="category in categories"
                          class="px-3 py-2 rounded-xl border hover:bg-gray-100 transition-all"
                        >
                          {{ category.title }}
                        </button>
                        <button
                          class="px-3 py-2 rounded-xl border bg-gray-100 transition-all"
                        >
                          More
                        </button>
                      </div>
                    </div>
                    <!-- <div class="bg-white py-5 relative">
                      <h2 class="mb-4 text-[18px] font-semibold">Side</h2>
                      <div class="flex flex-wrap gap-2 mt-5">
                        <button
                          class="px-3 py-2 rounded-xl border hover:bg-gray-100 transition-all"
                        >
                          Russia
                        </button>
                        <button
                          class="px-3 py-2 rounded-xl border hover:bg-gray-100 transition-all"
                        >
                          Miracle
                        </button>
                        <button
                          class="px-3 py-2 rounded-xl border hover:bg-gray-100 transition-all"
                        >
                          Miracle
                        </button>
                        <button
                          class="px-3 py-2 rounded-xl border hover:bg-gray-100 transition-all"
                        >
                          Miracle
                        </button>
                        <button
                          class="px-3 py-2 rounded-xl border hover:bg-gray-100 transition-all"
                        >
                          Miracle
                        </button>
                        <button
                          class="px-3 py-2 rounded-xl border bg-gray-100 transition-all"
                        >
                          More
                        </button>
                      </div>
                    </div> -->
                  </div>
                  <div class="bg-white py-0.5 sm:py-1 px-2 sm:px-4 left-0">
                    <button
                      @click="queryType = selected.id"
                      class="px-5 py-3 w-full text-black rounded-xl bg-[#fde046] transition-all"
                    >
                      Show
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
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
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "@/stores/category";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
const { categories } = storeToRefs(useCategoryStore());
const { getCategories } = useCategoryStore();
const queryType = ref("latest");
const radioOptions = [
  { id: "highest_price", title: "Highest Price" },
  { id: "lowest_price", title: "Lowest Price" },
  { id: "highest_quantity", title: "Highest Quantity" },
  { id: "lowest_quantity", title: "Lowest quantity" },
  { id: "highest_sold", title: "Highest Sold" },
  { id: "lowest_sold", title: "Lowest Sold" },
  { id: "latest", title: "Latest" },
  { id: "new", title: "Top" },
];
const selected = ref(radioOptions[0]);
const open = ref(true);
if (categories.value.length == 0) {
  getCategories(
    [
      site.value.id,
      ...site.value.parent
        .filter((item) => item.isActive)
        .map((item) => item.id),
    ],
    site.value.parent.filter((item) => item.isActive).length > 0
      ? site.value.id
      : null
  );
}
</script>

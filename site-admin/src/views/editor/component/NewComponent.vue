<script setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  SITE_COMPONENT,
} from "@/gql/site";
import { ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { useComponentStore } from "@/stores/component";
import { BoltIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useEditorStore } from "@/stores/editor";
import * as t from "@rekajs/types";
import { camelCase, startCase } from "lodash";
import { useQuery, useMutation } from "@vue/apollo-composable";
const reka = inject("reka");
const emit = defineEmits(["add", "close"]);
const { components, componentCategories } = storeToRefs(useComponentStore());
const { getComponents, getComponentCategories } = useComponentStore();
const { isNewComponent } = storeToRefs(useEditorStore());
if (components.value.length == 0) {
  getComponents();
}
if (componentCategories.value.length == 0) {
  getComponentCategories();
}
const toggleElement = (element) => {
  const { onResult } = useQuery(SITE_COMPONENT, {
    id: element.id,
  });
  onResult((queryResult) => {
    if (queryResult.data.siteComponent) {

      let item = queryResult.data.siteComponent;
      const itemTemplate = t.Schema.fromJSON(item.componentData);
      emit("add", itemTemplate);
    }
  });
};
const toggleClose = () => {
  isNewComponent.value = false;
};
const scrollToElement = (index) => {
  const el = document.getElementById("targetElement_" + index);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
const groupArray = (array, groupSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += groupSize) {
    result.push(array.slice(i, i + groupSize));
  }
  return result;
};
</script>
<template>
  <div>
    <TransitionRoot as="template" :show="isNewComponent">
      <Dialog as="div" class="relative z-[9999]" @close="toggleClose()">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
        <div
          class="fixed inset-0 z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-offset-2"
                    @click="toggleClose()">
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div class="sm:flex sm:items-center">
                  <div class="sm:flex-auto">
                    <h1 class="text-xl font-semibold text-gray-900 flex items-center">
                      Component
                      <BoltIcon @click="getComponents()" class="cursor-pointer active:cursor-wait h-4 w-4 ml-2"
                        aria-hidden="true" />
                    </h1>
                    <p class="mt-2 text-sm text-gray-700">
                      A list of all the brands in your account including their
                      name, title, email and role.
                    </p>
                  </div>
                  <!-- <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <router-link
        :to="`/product/brand/create/`"
        type="button"
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto disabled:opacity-25"
        >Add New</router-link
      >
    </div> -->
                </div>
                <div class="mx-auto mt-4 w-full">
                  <div class="grid grid-cols-4">
                    <div class="col-span-1 sticky top-0 h-[80vh] overflow-auto border-r-2 mr-4">
                      <div v-for="(items, index) in groupArray(
                        componentCategories.sort(
                          (a, b) => a.priority - b.priority
                        ),
                        3
                      )" :key="index" class="py-2">
                        <div v-for="(item, index) in items" :key="item.id" class="py-1">
                          <button class="text-gray-600 font-regular hover:text-blue-400"
                            @click="scrollToElement(item.title)" :title="item.title">
                            {{ item.title }}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-span-3 h-[80vh] overflow-auto">
                      <ul class="border-b">
                        <li v-for="(item, index) in componentCategories.sort(
                          (a, b) => a.priority - b.priority
                        )" :key="item.id" class="block border-b py-4">
                          <h2 :id="'targetElement_' + item.title"
                            class="text-xl font-bold text-gray-800 flex items-center">
                            {{ item.title }}
                            <span v-if="item.title == 'Hero header'"
                              class="text-xs font-normal bg-green-400 px-2 py-0 rounded-sm mx-2 text-white"
                              style="cursor: default">
                              We recommend to start with a Hero
                            </span>
                          </h2>
                          <span class="text-sm font-normal">{{
                            item.description
                            }}</span>
                          <ul class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full py-4">
                            <li v-for="component in components
                              .filter((a) => a.categoryId == item.id)
                              .sort((a, b) => a.priority - b.priority)" :key="component.id" class="">
                              <button @click="toggleElement(component)" type="button" class="relative">
                                <img v-lazy="component.image" class="border rounded-md" /><span
                                  class="absolute right-0 text-[10px] bg-red-300 text-white bottom-2 px-2 py-1 rounded-l-sm">{{
                                  component.title
                                  }}</span>
                              </button>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

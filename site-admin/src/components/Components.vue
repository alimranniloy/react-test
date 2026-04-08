<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useComponentStore } from "@/stores/component";
import { BoltIcon } from "@heroicons/vue/24/outline";
import { cloneDeep } from "lodash";
const emit = defineEmits(["onSelect"]);
const { components, componentCategories } = storeToRefs(useComponentStore());
const { getComponents, getComponentCategories } = useComponentStore();
if (components.value.length == 0) {
  getComponents();
}
if (componentCategories.value.length == 0) {
  getComponentCategories();
}
const toggleElement = (element) => {
  emit("onSelect", cloneDeep(element));
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
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-gray-900 flex items-center">
        Component
        <BoltIcon
          @click="getComponents()"
          class="cursor-pointer active:cursor-wait h-4 w-4 ml-2"
          aria-hidden="true"
        />
      </h1>
      <p class="mt-2 text-sm text-gray-700">
        A list of all the brands in your account including their name, title,
        email and role.
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
      <div
        class="col-span-1 sticky top-0 h-[80vh] overflow-auto border-r-2 mr-4"
      >
        <div
          v-for="(items, index) in groupArray(
            componentCategories.sort((a, b) => a.priority - b.priority),
            3
          )"
          :key="index"
          class="py-2"
        >
          <div v-for="(item, index) in items" :key="item.id" class="py-1">
            <button
              class="text-gray-600 font-regular hover:text-blue-400"
              @click="scrollToElement(index)"
              :title="item.title"
            >
              {{ item.title }}
            </button>
          </div>
        </div>
      </div>
      <div class="col-span-3 h-[80vh] overflow-auto">
        <ul class="border-b">
          <li
            v-for="(item, index) in componentCategories.sort(
              (a, b) => a.priority - b.priority
            )"
            :key="item.id"
            class="block border-b py-4"
          >
            <h2
              :id="'targetElement_' + index"
              class="text-xl font-bold text-gray-800 flex items-center"
            >
              {{ item.title }}
              <span
                v-if="item.title == 'Hero header'"
                class="text-xs font-normal bg-green-400 px-2 py-0 rounded-sm mx-2 text-white"
                style="cursor: default"
              >
                We recommend to start with a Hero
              </span>
            </h2>
            <span class="text-sm font-normal">{{ item.description }}</span>
            <ul class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full py-4">
              <li
                v-for="component in components
                  .filter((a) => a.category == item.id)
                  .sort((a, b) => a.priority - b.priority)"
                :key="component.id"
                class=""
              >
                <button
                  @click="toggleElement(component)"
                  type="button"
                  class="relative"
                >
                  <img
                    :src="component.image"
                    alt="header-23 component thumbnail."
                    class="border rounded-md"
                  /><span
                    class="absolute right-0 text-xs bg-red-300 text-white bottom-2 px-2 py-1 rounded-l-sm"
                    >{{ component.title }}</span
                  >
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

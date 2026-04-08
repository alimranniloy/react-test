<template>
  <main class="px-4 pb-[60px] pt-0">
    <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
      <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-offset-2"
        @click="toggleClose()">
        <span class="sr-only">Close</span>
        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto relative">
        <h1 class="text-xl font-semibold text-gray-900 flex items-center">
          Component
          <BoltIcon @click="refresh()" class="cursor-pointer active:cursor-wait h-4 w-4 ml-2" aria-hidden="true" />
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the brands in your account including their
          name, title, email and role.
        </p>
      </div>
      <div v-if="me.isStaff || me.isSuperuser" class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link :to="`/component/create/`" type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto disabled:opacity-25">Add
          New</router-link>
      </div>
    </div>
    <div class="mx-auto mt-4 w-full">
      <div class="grid grid-cols-5">
        <div class="col-span-1 sticky top-0 h-[80vh] overflow-auto">
          <div v-for="(items, index) in groupArray(
            componentCategories.sort(
              (a, b) => a.priority - b.priority
            ),
            3
          )" :key="index" class="py-2">
            <div v-for="(item, index) in items" :key="item.id" class="py-1">
              <button class="text-gray-600 font-regular hover:text-blue-400" @click="scrollToElement(item.title)"
                :title="item.title">
                {{ item.title }}
              </button>
            </div>
          </div>
        </div>
        <div class="col-span-4 h-[80vh] overflow-auto p-4 border rounded-md">
          <ul class="">
            <li v-for="(item, index) in componentCategories.sort(
              (a, b) => a.priority - b.priority
            )" :key="item.id" class="block pb-4">
              <h2 :id="'targetElement_' + item.title" class="text-xl font-bold text-gray-800 flex items-center">
                {{ item.title }}
                <span v-if="item.title == 'Hero'"
                  class="text-xs font-normal bg-green-400 px-2 py-0 rounded-sm mx-2 text-white" style="cursor: default">
                  We recommend to start with a Hero
                </span>
              </h2>
              <span class="text-sm font-normal">{{
                item.description
                }}</span>
              <ul class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full pt-1 pb-4">
                <li v-for="component in components
  .filter((a) => a.categoryId == item.id)
                  .sort((a, b) => a.priority - b.priority)" :key="component.id" class="">
                  <button @click="toggleElement(component)" type="button" class="relative h-full">
                    <img v-lazy="component.image" class="border rounded-md h-full object-contain" /><span
                      class="absolute right-0 text-xs bg-red-300 text-white bottom-2 px-2 py-1 rounded-l-sm">{{
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
  </main>
</template>
<script setup>
import { ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { useComponentStore } from "@/stores/component";
import { BoltIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useEditorStore } from "@/stores/editor";
import { useMeStore } from "@/stores/me";
import { useRouter } from "vue-router";
const router = useRouter();
const { componentId, components, componentCategories } = storeToRefs(useComponentStore());
const { getComponents, getComponentCategories } = useComponentStore();
const { isNewComponent } = storeToRefs(useEditorStore());
const { me } = storeToRefs(useMeStore());
const key = ref(1);
if (components.value.length == 0) {
  getComponents();
}
if (componentCategories.value.length == 0) {
  getComponentCategories();
}
const toggleElement = (element) => {
  componentId.value = element.id;
  router.push(`/component/update/`);
};
const toggleClose = () => {
  isNewComponent.value = false;
};
const scrollToElement = (index) => {
  const el = document.getElementById("targetElement_" + index);
  console.log(el)
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
const refresh = () => {
  getComponents();
  key.value += 1;
} 
</script>
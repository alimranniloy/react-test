<template>
  <div v-if="component"
    class="flex px-4 py-2 flex-col border-b border-solid border-outline setting-section last:border-none">
    <div class="flex relative items-center cursor-pointer mt-2 mb-1">
      <header class="flex flex-1 items-center">
        <span class="text-slate-800 text-sm font-medium flex items-center">Props</span><button
          class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-gray-500 hover:bg-black/5 hover:text-neutral-900 text-xs py-3 px-1.5 rounded-md [&amp;>svg]:w-3 [&amp;>svg]:h-3 ml-1">
          <ChevronRightIcon class="h-4 w-4"></ChevronRightIcon>
        </button>
      </header>
      <button
        class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-gray-500 hover:bg-black/5 hover:text-neutral-900 text-xs py-3 px-1.5 rounded-md [&amp;>svg]:w-3 [&amp;>svg]:h-3">
        <PlusIcon class="h-4 w-4"></PlusIcon>
      </button>
    </div>
    <div v-for="item in formattedState" :key="item.title"
      class="relative rounded-md border border-gray-300 px-3 py-3 mb-4 ">
      <div class="flex gap-4">
        <div class="w-full">
          <label :for="`${item.id}`"
            class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
            {{ formatLabel(item.title) }}
          </label>
          <component :is="getComponentType(item.value)" :value="item.value"
            @input="value => changeData(item.title, value)" :id="`${item.id}`" :title="`${item.title}`" />
        </div>
        <div v-if="item.title == 'siteId'">
          <button @click="isSiteOpen = true"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white  hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto disabled:opacity-25">Select
          </button>
          <SiteSelectList @onClose="isSiteOpen = false" @onSelect="e => {
            isSiteOpen = false;
            siteId = e;
            changeData('siteId', e);
          }" v-if="isSiteOpen" />
        </div>
        <div v-else-if="item.title == 'productId'">
          <button @click="isProductOpen = true" :disabled="siteId == null"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white  hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto disabled:opacity-25">Select
          </button>
          <ProductSelectList :siteId="siteId" @onClose="isProductOpen = false" @onSelect="product => {
            isProductOpen = false;
            changeData('productId', product.id);
            changeData('title', product.title);
            changeData('image', product.thumbnail);
            changeData('price', product.price);
            changeData('quantity', 1);
          }" v-if="isProductOpen" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  ChevronRightIcon,
  PlusIcon,
  LinkIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import * as t from "@rekajs/types";
import { storeToRefs } from "pinia";
import { startCase } from "lodash";
import { useEditorStore } from "@/stores/editor";
import { ref, inject, computed, defineAsyncComponent } from "vue";
import ArrayComponent from './ArrayComponent.vue';
import BooleanComponent from './BooleanComponent.vue';
import DateComponent from './DateComponent.vue';
import NumberComponent from './NumberComponent.vue';
import StringComponent from './StringComponent.vue';
const { componentId } = storeToRefs(useEditorStore());
const reka = inject("reka");
const component = computed(() => {
  return reka.value.getNodeFromId(componentId.value);
});
const SiteSelectList = defineAsyncComponent(() =>
  import("@/components/SiteSelectList.vue")
);
const ProductSelectList = defineAsyncComponent(() =>
  import("@/components/ProductSelectList.vue")
);
const isSiteOpen = ref(false);
const isProductOpen = ref(false);
const siteId = ref(null);
const formattedState = computed(() => {
  return component.value.state.map(state => {
    let type;
    if (state.init instanceof t.ArrayExpression) {
      type = 'array';
    } else if (typeof state.init.value === 'boolean') {
      type = 'boolean';
    } else if (isValidDate(state.init.value)) {
      type = 'date';
    } else if (typeof state.init.value === 'number' || (!isNaN(parseFloat(state.init.value)) && isFinite(state.init.value))) {
      type = 'number';
    } else {
      type = 'string';
    }
    return {
      id: state.id,
      title: state.name,
      value: state.init instanceof t.ArrayExpression ? state.init.elements : state.init.value,
      type
    };
  });
});
const getComponentType = (value) => {
  if (Array.isArray(value)) {
    return ArrayComponent;
  } else if (typeof value === 'boolean') {
    return BooleanComponent;
  } else if (isValidDate(value)) {
    return DateComponent;
  } else if (typeof value === 'number' || (!isNaN(parseFloat(value)) && isFinite(value))) {
    return NumberComponent;
  } else {
    return StringComponent;
  }
};
const isValidDate = (value) => {
  // Check for common date formats (YYYY-MM-DD, MM/DD/YYYY, etc.)
  // You can expand this to include more formats as needed
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Simple regex for YYYY-MM-DD format
  return dateRegex.test(value) && !isNaN(Date.parse(value));
};
const formatLabel = (id) => {
  return id.replace(/[0-9]/g, '').replace(/([A-Z])/g, ' $1').trim();
};
const changeData = (title, data) => {
  const existingStateWithSameName = component.value.state.find(
    (state) => state.name === title
  );
  if ('update' === 'update') {
    if (!existingStateWithSameName) {
      return;
    }
    reka.value.change(() => {
      existingStateWithSameName.init = t.literal({ value: data });
    });
    return;
  }
  if (existingStateWithSameName) {
    return;
  }
  reka.value.change(() => {
    component.value.state.push(
      t.val({
        name: title,
        init: t.literal({ value: data }),
      })
    );
  });
}
</script>

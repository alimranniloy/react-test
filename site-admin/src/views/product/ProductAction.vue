<template>
  <main :key="product.id" v-if="product" class="flex-1">
    <div class="relative mx-auto md:px-8 xl:px-0">
      <div class="flex items-center space-x-5">
        <div class="flex-shrink-0">
          <div class="relative">
            <img class="h-16 w-16 rounded-full" v-lazy="product.image" alt="" />
            <span class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ product.title }}
          </h1>
          <p class="text-sm font-medium text-blue-700">
            <a :href="`https://${product.site.domain}/product-spotlight/${product.slug}/${product.hid}/`" target="_blank">{{ `/product-spotlight/${product.slug}/${product.hid}/` }}</a>
          </p>
        </div>
      </div>
      <div class="px-4 sm:px-6 md:px-0">
        <div class="py-0">
          <!-- Tabs -->
          <div class="lg:hidden">
            <label for="selected-tab" class="sr-only">Select a tab</label>
            <select v-model="selectedTab" id="selected-tab" name="selected-tab"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm">
              <option v-for="item in tabs" :key="item.name" :selected="selectedTab == item.name" :value="item.name">
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="lg:block">
            <div class="border-b border-gray-200">
              <nav class="overflow-x-auto -mb-px flex space-x-8">
                <div @click="selectedTab = item.name" v-for="item in tabs" :key="item.name" :class="[
                  item.name == selectedTab
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer active:cursor-wait',
                ]">
                  {{ item.name }}
                </div>
              </nav>
            </div>
          </div>
          <div v-if="selectedTab == 'Home' && product.schema" class="border border-t-0" :key="referenceId">
            <Editor :key="product.id + '_product' + referenceId" :page="'product'" :schema="product.schema"></Editor>
          </div>
          
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import Editor from "@/views/editor/Editor.vue";
import { STORE_PRODUCT_PREVIEW } from "@/gql/storeProduct";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/product";
import { ref, watch } from "vue";
import { cloneDeep } from "lodash";
const { productId, product } = storeToRefs(useProductStore());
const props = defineProps({
  id: {
    type: Number,
    required: false,
  },
});
const referenceId = ref(uuidv4());
const { onResult, loading, error, refetch } = useQuery(STORE_PRODUCT_PREVIEW, {
  id: props.id ? props.id : productId.value,
});
onResult((queryResult) => {
  if (queryResult.data) {
    product.value = cloneDeep(queryResult.data.storeProduct);
    referenceId.value = uuidv4();
  }
});
const tabs = [
  { name: "Home" },
];
const selectedTab = ref("Home");

</script>

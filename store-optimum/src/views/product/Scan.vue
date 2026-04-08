<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div class="max-w-screen-2xl mx-auto px-4 pb-5">
      <div
        @click="openFilePicker"
        class="w-full bg-white"
        id="app"
      >
        <input
          ref="fileInputRef"
          accept="image/*"
          id="fileInputRef"
          @change="handleFileUpload"
          name="fileInputRef"
          type="file"
          class="sr-only"
        />
        <div
          class="flex justify-center rounded-md border-2 border-dashed border-gray-300 p-5 mt-5"
        >
          <div class="space-y-1 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="flex text-sm text-gray-600">
              <label
                class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Select image</span>
              </label>
              <p class="pl-1">to find products</p>
            </div>
            <p class="text-xs text-gray-500">
              Must have barcode / qr code on image
            </p>
            <p class="text-md text-red-500">
              {{
                sku != "" && products.edges.length == 0
                  ? "No product found, try other"
                  : error
              }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="products.edges.length > 0"
        class="px-4 mt-4 md:px-0 md:mb-14 grid relative"
        :class="myClass"
      >
        <div
          v-for="product in products.edges"
          :key="product.node.id"
          class="cursor-pointer bg-white rounded-xl md:rounded-xl overflow-hidden flex flex-col justify-between"
        >
          <ProductItem :product="product.node" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "Qr",
};
</script>
<script setup>
import { ref, watch, computed, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { STORE_PRODUCTS } from "@/gql/product";
import { HOME_BARCODE_READER } from "@/gql/home";
import { useSiteStore } from "@/stores/site";
import { useQuery, useMutation } from "@vue/apollo-composable";
const ProductItem = defineAsyncComponent(() =>
  import("@/components/ProductItem.vue")
);
const { site } = storeToRefs(useSiteStore());
const { setLoading } = useSiteStore();
const fileInputRef = ref(null);
const sku = ref("");
const error = ref("");
const products = ref({ edges: [] });
const openFilePicker = () => {
  fileInputRef.value.click();
};
const handleFileUpload = async (event) => {
  setLoading(true);
  const file = event.target.files[0];
  const { mutate, loading, error } = useMutation(HOME_BARCODE_READER, {
    variables: {
      image: file,
    },
  });
  try {
    const response = await mutate();
    let result = response.data.homeBarcodeRead;
    if (result == "error") {
      error.value = result;
      sku.value = "";
      products.value = { edges: [] };
    } else {
      sku.value = result;
    }
    setLoading(false);
  } catch (e) {
    error.value = e;
    sku.value = "";
    products.value = { edges: [] };
    setLoading(false);
  }
};
watch(sku, (newSku) => {
  const { onResult, loading, error, refetch } = useQuery(STORE_PRODUCTS, {
    siteId: [
      site.value.id,
      ...site.value.parent
        .filter((item) => item.isActive)
        .map((item) => item.id),
    ],
    childId:
      site.value.parent.filter((item) => item.isActive).length > 0
        ? site.value.id
        : null,
    percentage:
      site.value.parent.filter((item) => item.isActive).length > 0
        ? site.value.parent
            .filter((item) => item.isActive)
            .map((el) => {
              return {
                site_id: el.id,
                percentage: el.percentage,
                is_fixed: el.isFixed,
                parent_id: el.parentId,
              };
            })
        : null,
    search: newSku,
    first: 2,
    after: null,
  });
  onResult((queryResult) => {
    products.value = queryResult.data.storeProducts;
  });
});
const myClass = computed(() => {
  if ([1].includes(site.value.industry)) {
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-4 gap-x-2 md:gap-2-2";
  }
  return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-4 gap-x-2 md:gap-2-2";
});
</script>

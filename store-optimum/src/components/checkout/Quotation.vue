<template>
  <div class="container mx-auto mt-5 sm:mt-0 mb-5" id="app">
    <div
      @click="openFilePicker"
      class="max-w-6xl mx-auto flex bg-white"
      id="app"
    >
      <input
        ref="fileInputRef"
        accept="image/*"
        id="fileInputRef"
        name="fileInputRef"
        @change="handleFileUpload"
        type="file"
        class="sr-only"
      />
      <div class="rounded-md border-2 border-dashed px-6 pt-4 pb-6 w-full">
        <div class="flex justify-center">
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
              <p class="pl-1">or screen shot</p>
            </div>
            <p class="text-xs text-gray-500">
              and write yours needs in details.
            </p>
          </div>
        </div>
        <div v-if="imageUrl" class="flex justify-center pt-4">
          <img
            v-lazy="imageUrl"
            class="w-[240px] h-[240px] rounded-md"
            alt="Image Preview"
          />
        </div>
      </div>
    </div>
    <div class="relative rounded-md border px-3 py-3 mt-6">
      <label
        for="productTitle"
        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
        >{{ $t("checkout.enterNote") }}</label
      >
      <textarea
        v-model="cartCustomer.productTitle"
        rows="4"
        name="comment"
        id="productTitle"
        placeholder="Enter details note"
        class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
      />
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <ExclamationCircleIcon
          v-if="cartCustomer.productTitle.length < 3"
          class="h-5 w-5 text-red-500"
          aria-hidden="true"
        />
        <CheckCircleIcon
          v-else
          class="h-5 w-5 text-green-500"
          aria-hidden="true"
        />
      </div>
    </div>
    <div
      v-if="site.siteInfo == 'sample'"
      class="relative rounded-md border px-3 py-3 mt-6"
    >
      <label
        for="productPrice"
        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
        >{{ $t("checkout.productPrice") }}</label
      >
      <input
        v-model.number="cartCustomer.productPrice"
        type="number"
        name="productPrice"
        id="productPrice"
        class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
      />
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <ExclamationCircleIcon
          v-if="true"
          class="h-5 w-5 text-red-500"
          aria-hidden="true"
        />
        <CheckCircleIcon
          v-else
          class="h-5 w-5 text-green-500"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { cloneDeep } from "lodash";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useRouter } from "vue-router";
import { useMeStore } from "@/stores/me";
import { useCartStore } from "@/stores/cart";
const { site } = storeToRefs(useSiteStore());
const router = useRouter();
const { cart, cartCustomer } = storeToRefs(useCartStore());
const { addToCart } = useCartStore();
const fileInputRef = ref(null);
const imageUrl = ref("");
const openFilePicker = () => {
  fileInputRef.value.click();
};
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    imageUrl.value = URL.createObjectURL(file);
    cartCustomer.value.productImage = event.target.files[0];
  } else {
    imageUrl.value = null;
  }
};
onMounted(() => {
  if (router.currentRoute.value.name == "Quotation") {
    var item = {
      affiliateCommission: 0.0,
      cashback: 0.0,
      comparePrice: 0.0,
      currency: site.value.currency,
      deliveryCharge: 0.0,
      emiPrice: 0.0,
      emiDuration: 0,
      emiInterest: 0,
      hid: "6",
      id: 1,
      isContinueSelling: true,
      isEmi: false,
      maxOrder: 1,
      maxResellPrice: 0.0,
      minOrder: 1,
      price: 0.0,
      quantity: 1,
      resellPrice: 0.0,
      rewardPoints: 0.0,
      sku: "",
      slug: "",
      thumbnail: "",
      title: "",
      translation: "",
      unit: 1,
      unitType: 1,
      variant: [],
      variants: [],
      vat: 0.0,
      weight: 1,
    };
    addToCart(cloneDeep(item));
  }
  if (cartCustomer.value.productImage) {
    console.log(cartCustomer.value.productImage);
    //imageUrl.value = URL.createObjectURL(cartCustomer.value.productImage);
  }
});
watch(cartCustomer.value, () => {
  if (router.currentRoute.value.name == "Quotation") {
    if (cart.value.length > 0) {
      cart.value[0].title = cartCustomer.value.productTitle;
      cart.value[0].price = parseFloat(cartCustomer.value.productPrice)
        ? parseFloat(cartCustomer.value.productPrice)
        : 0.0;
    } else {
      var item = {
        affiliateCommission: 0.0,
        cashback: 0.0,
        comparePrice: 0.0,
        currency: site.value.currency,
        deliveryCharge: 0.0,
        emiPrice: 0.0,
        emiDuration: 0,
        emiInterest: 0,
        hid: "6",
        id: 1,
        isContinueSelling: true,
        isEmi: false,
        maxOrder: 1,
        maxResellPrice: 0.0,
        minOrder: 1,
        price: 0.0,
        quantity: 1,
        resellPrice: 0.0,
        rewardPoints: 0.0,
        sku: "",
        slug: "",
        thumbnail: "",
        title: "",
        translation: "",
        unit: 1,
        unitType: 1,
        variant: [],
        variants: [],
        vat: 0.0,
        weight: 1,
      };
      addToCart(cloneDeep(item));
    }
  }
});
</script>

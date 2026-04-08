<template>
  <div v-if="products.edges.length > 0" class="w-full">
    <div class="py-2 text-sm font-bold">
      Purchase any of the following products to continue
    </div>
    <div
      class="grid relative"
      :class="[myClass]"
      v-if="
        cart.filter((a) => a.productType == 7).length == 0 &&
        products.edges.length > 2
      "
    >
      <div
        v-for="product in products.edges"
        :key="'productList_' + product.node.id"
        class="cursor-pointer bg-white rounded-2xl md:rounded-2xl overflow-hidden flex flex-col justify-between"
      >
        <ProductItem :source="'package'" :product="product.node" />
      </div>
    </div>
    <div
      class=""
      v-else-if="cart.filter((a) => a.productType == 7).length == 0"
    >
      <div
        v-for="product in products.edges"
        :key="'productList_' + product.node.id"
        class="cursor-pointe"
      >
        <div
          class="mx-auto mt-4 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-4 lg:mx-0 lg:flex lg:max-w-none"
        >
          <div class="p-6 sm:p-6 lg:flex-auto">
            <h3 class="text-2xl font-bold tracking-tight text-gray-900">
              {{ product.node.title }}
            </h3>
            <p class="mt-6 text-base leading-7 text-gray-600">
              {{ product.node.description }}
            </p>
            <div class="mt-10 flex items-center gap-x-4">
              <h4
                class="flex-none text-sm font-semibold leading-6 text-indigo-600"
              >
                What’s included
              </h4>
              <div class="h-px flex-auto bg-gray-100"></div>
            </div>
            <ul
              role="list"
              class="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600"
            >
              <li
                v-for="item in product.node.features"
                :key="item.key"
                class="flex gap-x-3"
              >
                <svg
                  class="h-6 w-5 flex-none text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ item.key }}: {{ item.value }}
              </li>
            </ul>
          </div>
          <div class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div
              class="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16"
            >
              <div class="mx-auto max-w-xs px-8">
                <p class="text-base font-semibold text-gray-600">
                  {{ product.node.subTitle }}
                </p>
                <p class="mt-6 flex items-baseline justify-center gap-x-2">
                  <span
                    class="text-5xl font-bold tracking-tight text-gray-900"
                    >{{ product.node.price }}</span
                  >
                  <span
                    class="text-sm font-semibold leading-6 tracking-wide text-gray-600"
                    >{{ site.currency }}</span
                  >
                </p>
                <button
                  @click="toggleAddToCart(product.node)"
                  class="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {{ false ? "Already purchased" : "Get access" }}
                </button>
                <p class="mt-6 text-xs leading-5 text-gray-600">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-90" v-else>
      <Checkout :isNative="false" />
    </div>
  </div>
</template>

<script setup>
import { cloneDeep } from "lodash";
import "v3-infinite-loading/lib/style.css";
import dayjs from "dayjs";
import { useCartStore } from "@/stores/cart";
import relativeTime from "dayjs/plugin/relativeTime";
import { STORE_PRODUCTS } from "@/gql/product";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useCustomerStore } from "@/stores/customer";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useSiteStore } from "@/stores/site";
dayjs.extend(relativeTime);
const emit = defineEmits(["onLoad"]);
const ProductItem = defineAsyncComponent(() =>
  import("@/components/ProductItem.vue")
);
const { customer } = storeToRefs(useCustomerStore());
const Checkout = defineAsyncComponent(() =>
  import("@/views/checkout/Checkout.vue")
);
const { addToCart } = useCartStore();
const { site } = storeToRefs(useSiteStore());

const { cart } = storeToRefs(useCartStore());
// customer parameter
const first = ref([1].includes(site.value.industry) ? 10 : 12);
// end parameter
// query
const { result, fetchMore, loading, error, refetch } = useQuery(
  STORE_PRODUCTS,
  {
    siteId: [
      site.value.id,
      ...site.value.parent
        .filter((item) => item.isActive)
        .map((item) => item.id),
    ],
    productType: 7,
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
    queryType: site.value.queryType,
    first: first.value,
    after: null,
  }
);
const products = computed(() => {
  return result.value?.storeProducts ?? { edges: [] };
});

const open = computed(() => {
  if (products.value && products.value.edges) {
    let productIds = products.value.edges.map((a) => a.node.id);
    return !customer.value.blockProducts.some((item) =>
      productIds.includes(item)
    );
  } else {
    return false;
  }
  // return arr1.some(item => arr2.includes(item));
});

watch(products, () => {
  if (products.value.edges.length > 0) {
    emit("onLoad", false);
  } else {
    emit("onLoad", true);
  }
});

const variants = ref([]);
const toggleAddToCart = (product) => {
  cart.value = [];
  let index = parseInt(
    variants.value
      .sort((a, b) => a.id - b.id)
      .map((v) => v.id)
      .join("")
  )
    ? parseInt(variants.value.map((v) => v.id).join(""))
    : 0;

  var item = {
    affiliateCommission: product.affiliateCommission,
    cashback: product.cashback,
    comparePrice: product.comparePrice,
    cost: product.cost,
    currency: product.currency,
    deliveryCharge: product.deliveryCharge,
    emiDuration: product.emiDuration ? product.emiDuration : 0,
    emiInterest: product.emiInterest ? product.emiInterest : 0,
    emiPrice: product.emiPrice,
    hid: product.hid,
    id: product.id,
    index: index,
    isContinueSelling: product.isContinueSelling,
    isEmi: false,
    maxOrder: product.maxOrder,
    maxResellPrice: product.maxResellPrice,
    minOrder: product.minOrder,
    price: product.price,
    productType: 7,
    quantity: product.quantity,
    resellPrice: product.price,
    rewardPoints: product.rewardPoints,
    sku: product.sku,
    slug: product.slug,
    thumbnail: product.thumbnail,
    title: product.title,
    translation: product.translation,
    unit: product.unit,
    unitType: product.unitType,
    variant: cloneDeep(variants.value),
    variants: cloneDeep(product.variants ? product.variants : []),
    vat: product.vat,
    weight: product.weight,
  };
  addToCart(cloneDeep(item));
  toAnalyticsAddCart(product);
};

const toAnalyticsAddCart = (product) => {
  // facebook pixel track AddToCart
  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [product.hid],
      content_name: product.title,
      content_type: "product",
      currency: product.currency,
      value: product.price,
      num_items: 1,
      source: `https://${site.value.domain}`,
    });
  }
  // end facebook pixel track AddToCart
  // google analytics track add_to_cart
  if (window.gtag) {
    gtag("event", "add_to_cart", {
      currency: product.currency,
      value: product.price,
      items: [
        {
          item_id: product.hid,
          item_name: product.title,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  }
  // end google analytics track add_to_cart
  // google analytics track view_item
  if (window.dataLayer) {
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: product.currency,
        value: price.value,
        items: [
          {
            item_id: product.hid,
            item_name: product.title,
            price: price.value,
            quantity: 1,
          },
        ],
      },
    });
  }
  // end google analytics track view_item
};
const myClass = computed(() => {
  console.log(site.value.industry);
  if ([1].includes(site.value.industry)) {
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-2";
  }
  return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-2";
});
</script>

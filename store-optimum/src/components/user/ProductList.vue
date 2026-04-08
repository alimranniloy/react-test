<template>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-gray-900">Products</h1>
      <p class="mt-2 text-sm text-gray-700">
        A list of all the products in your account including their name, title,
        email and role.
      </p>
    </div>
  </div>
  <div class="mt-4 mb:mt-8 flex flex-col">
    <div class="mb:-my-2 mb:-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div
        class="inline-block min-w-full py-1 mb:py-2 align-middle px-1 md:px-6 lg:px-8"
      >
        <div
          class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-md md:rounded-lg"
        >
          <!-- <div
            v-if="selectedProduct.length > 0"
            class="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16"
          >
            <button
              type="button"
              class="inline-flex items-center rounded bproduct bproduct-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Delete all
            </button>
          </div> -->
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="relative w-6 px-4 sm:w-6 sm:px-4">
                    SL
                  </th>
                  <th scope="col" class="relative w-5 px-5 sm:w-5 sm:px-5">
                  <input
                    type="checkbox"
                    class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded bproduct-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                    :checked="
                      indeterminate ||
                      selectedProduct.length === products.edges.length
                    "
                    :indeterminate="indeterminate"
                    @change="
                      selectedProduct = $event.target.checked
                        ? products.edges.map((p) => p.node.id)
                        : []
                    "
                  />
                </th>
                <th
                  scope="col"
                  class="min-w-[6rem] py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900"
                >
                  Title
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                >
                  Price
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                >
                  Commission
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-sm font-semibold text-gray-900 text-right"
                >
                  Stock
                </th>
                <th
                  scope="col"
                  class="px-4 py-3.5 text-right text-sm font-semibold text-gray-900"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="product in products.edges"
                :key="product.node.id"
                class="cursor-pointer active:cursor-wait"
              >
                <td class="relative w-5 px-5 sm:w-5 sm:px-5">
                  <div
                    v-if="selectedProduct.includes(product.node.id)"
                    class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                  ></div>
                  <input
                    type="checkbox"
                    class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded bproduct-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                    :value="product.node.id"
                    v-model="selectedProduct"
                  />
                </td>
                <td
                  @click="selectProduct(product.node)"
                  class="truncate py-2 pl-3 sm:pl-0 pr-3 text-sm max-w-[170px]"
                >
                  <div class="flex items-center">
                    <div class="ml-0">
                      <div
                        :class="[
                          'whitespace-nowrap text-sm font-medium text-gray-900',
                          selectedProduct.includes(product.node.id)
                            ? 'text-indigo-600'
                            : 'font-medium text-gray-900',
                        ]"
                      >
                        {{ product.node.title }}
                      </div>
                      <div class="text-gray-500 text-xs">
                        {{
                          formatMoney(product.node.price, product.node.currency)
                        }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-2 py-2 text-sm text-gray-500">
                  <div
                    class="text-gray-900 line-clamp-2 leading-snug text-xs text-right"
                  >
                    {{ formatMoney(product.node.price, product.node.currency) }}
                  </div>
                </td>
                <td class="px-2 py-2 text-sm text-gray-500">
                  <div
                    class="text-gray-900 line-clamp-2 leading-snug text-xs text-right"
                  >
                    {{
                      formatMoney(
                        product.node.affiliateCommission,
                        product.node.currency
                      )
                    }}
                  </div>
                </td>
                <td class="px-2 py-2 text-sm text-gray-500">
                  <div
                    class="text-gray-900 line-clamp-2 leading-snug text-xs text-right"
                  >
                    {{ product.node.quantity }}
                  </div>
                </td>
                <td
                  class="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right"
                >
                  <button
                    @click="selectProduct(product.node)"
                    type="button"
                    class="relative inline-flex border items-center rounded-md bproduct bproduct-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
                  >
                    Copy URL
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <nav
            v-if="products.edges.length == 0"
            class="text-center bproduct-t bproduct-gray-200 bg-white px-4 py-4 sm:px-6"
            aria-label="Pagination"
          >
            <div class="hidden sm:block">
              <p class="text-sm text-gray-700">No record :-(</p>
            </div>
            <div class="flex flex-1 justify-between sm:justify-end">
              <div class="inline-flex rounded-md shadow-sm"></div>
            </div>
          </nav>
          <nav
            v-else-if="products.edges.length >= first || hasMore"
            class="flex items-center justify-between bproduct-t bproduct-gray-200 bg-white px-4 py-3 sm:px-4"
            aria-label="Pagination"
          >
            <div class="hidden sm:block">
              <p class="text-sm text-gray-700">
                Showing
                {{ " " }}
                <span class="font-medium">1</span>
                {{ " " }}
                to
                {{ " " }}
                <span class="font-medium">{{
                  products.edges ? products.edges.length : 0
                }}</span>
              </p>
            </div>
            <div class="flex flex-1 justify-between sm:justify-end">
              <div class="inline-flex rounded-md shadow-sm">
                <button
                  @click="loadMore()"
                  type="button"
                  class="relative inline-flex items-center rounded-l-md bproduct bproduct-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
                >
                  Next
                </button>
                <Menu as="div" class="relative -ml-px block">
                  <MenuButton
                    class="relative inline-flex items-center rounded-r-md bproduct bproduct-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none"
                  >
                    <span class="sr-only">Open options</span>{{ first }}
                    <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                  </MenuButton>
                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      class="absolute left-0 sm:left-auto sm:right-0 bottom-12 z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div class="py-1">
                        <MenuItem
                          @click="first = item.value"
                          v-for="item in moreItems"
                          :key="item.name"
                          v-slot="{ active }"
                        >
                          <div
                            :class="[
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm',
                            ]"
                          >
                            {{ item.name }}
                          </div>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { copyText } from "vue3-clipboard";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { computed, ref, watch } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { STORE_PRODUCTS } from "@/gql/product";
import { useQuery } from "@vue/apollo-composable";
import { useNotificationsStore } from "@/stores/notifications";
import { storeToRefs } from "pinia";
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { useCustomerStore } from "@/stores/customer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const { addNotification } = useNotificationsStore();
const { site } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const { customer } = storeToRefs(useCustomerStore());

// customer parameter
const first = ref([1].includes(site.value.industry) ? 10 : 12);
const after = ref(null);
// end parameter

const selectedProduct = ref([]);
const indeterminate = computed(
  () =>
    selectedProduct.value.length > 0 &&
    selectedProduct.value.length < products.length
);
// query
const { result, fetchMore, loading, error, refetch } = useQuery(
  STORE_PRODUCTS,
  {
    siteId: site.value.id,
    customerId: customer.value.id,
    first: first.value,
    after: after.value,
  }
);
const products = computed(() => result.value?.storeProducts ?? { edges: [] });
const loadMore = () => {
  fetchMore({
    variables: {
      first: first.value,
      after: products.value.pageInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.storeProducts.edges;
      const newEdges = fetchMoreResult.storeProducts.edges;
      const pageInfo = fetchMoreResult.storeProducts.pageInfo;
      return newEdges.length
        ? {
            storeProducts: {
              __typename: previousResult.storeProducts.__typename,
              total: previousResult.storeProducts.total,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
// end query
const selectProduct = (product) => {
  const url = `https://${site.value.domain}/product/${product.slug}/${product.hid}/?refer=${me.value.referCode}`;
  copyText(url);
  addNotification(
    { title: "Product info", subTitle: "Successfully copied data." },
    "success"
  );
};

const moreItems = [
  { name: "15", value: 15 },
  { name: "30", value: 30 },
  { name: "100", value: 100 },
  { name: "200", value: 200 },
];
const selectedTab = ref("All");
const tabs = [{ id: null, name: "All", industry: [] }];
const status = computed(() =>
  tabs.find((el) => el.name == selectedTab.value)
    ? tabs.find((el) => el.name == selectedTab.value).id
    : null
);
watch(status, () => {
  refetch({ status: status.value || status.value == 0 ? status.value : null });
});

// watch(search, () => {
//   if (search.value) {
//     refetch({ search: search.value ? search.value : null });
//   } else {
//     refetch({ search: null });
//   }
// });
</script>

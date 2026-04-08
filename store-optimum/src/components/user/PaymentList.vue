<template>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-gray-900">Payments</h1>
      <p class="mt-2 text-sm text-gray-700">
        Track payments: amounts, dates, tx - your complete Reseller Dashboard.
      </p>
    </div>
  </div>
  <div class="mx-auto mt-4 w-full">
    <div class="space-y-6 lg:col-span-2 lg:col-start-1">
      <!-- Tabs -->
      <div class="lg:block">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-4 overflow-x-auto">
            <div
              @click="toggleTab(tab.name)"
              v-for="tab in tabs.filter((v) =>
                !v.industry.includes(site.industry) || v.industry.length == 0
                  ? true
                  : false
              )"
              :key="tab.name"
              :class="[
                selectedTab == tab.name
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer active:cursor-wait',
              ]"
            >
              {{ tab.name }}
            </div>
          </nav>
        </div>
      </div>
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
              v-if="selectedOrderPayment.length > 0"
              class="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16"
            >
                            <button
                type="button"
                class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Bulk edit
              </button>
              <button
                type="button"
                class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
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
                    class="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                    :checked="
                      indeterminate ||
                      selectedOrderPayment.length === orderPayments.edges.length
                    "
                    :indeterminate="indeterminate"
                    @change="
                      selectedOrderPayment = $event.target.checked
                        ? orderPayments.edges.map((p) => p.node.id)
                        : []
                    "
                  />
                </th>
                <th
                  scope="col"
                  class="min-w-[6rem] py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900"
                >
                  ID
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20"
                >
                  Update
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Payment
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Transaction
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
                v-for="payment in orderPayments.edges"
                :key="payment.node.id"
                :class="[
                  selectedOrderPayment.includes(payment.node.id) &&
                    'bg-gray-50',
                  payment.node.isPaid ? 'bg-green-100' : '',
                ]"
                class="cursor-pointer active:cursor-wait"
              >
                <td class="relative w-5 px-5 sm:w-5 sm:px-5">
                  <div
                    v-if="selectedOrderPayment.includes(payment.node.id)"
                    class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                  ></div>
                  <input
                    type="checkbox"
                    class="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                    :value="payment.node.id"
                    v-model="selectedOrderPayment"
                  />
                </td>
                <td
                  @click="selectOrderPayment(payment.node.id)"
                  class="whitespace-nowrap py-2 pl-3 sm:pl-0 pr-3 text-sm"
                >
                  <div class="flex items-center">
                    <div class="ml-0">
                      <div
                        :class="[
                          'whitespace-nowrap text-sm font-medium',
                          selectedOrderPayment.includes(payment.node.id)
                            ? 'text-indigo-600'
                            : 'font-medium text-gray-900',
                        ]"
                      >
                        ID: {{ payment.node.hid }}
                      </div>
                      <div class="text-gray-500 text-xs">
                        {{ formatMoney(payment.node.total, site.currency) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <span
                    class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-4 text-green-800"
                    >{{
                      payment.node.isPaid
                        ? "Paid"
                        : payment.node.isSettle
                        ? "Settled"
                        : "Processing"
                    }}</span
                  >
                </td>
                <td
                  @click="selectOrderPayment(payment.node.id)"
                  class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                >
                  <div class="text-gray-900">
                    {{ dayjs(payment.node.updatedAt).fromNow() }}
                  </div>
                  <div class="text-gray-500 text-xs">
                    @
                    {{ dayjs(payment.node.updatedAt).format("h:mm A MMM D") }}
                  </div>
                </td>
                <td
                  @click="selectOrderPayment(payment.node.id)"
                  class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                >
                  <div class="text-gray-900">
                    {{ payment.node.customerTitle }}
                  </div>
                  <div class="text-gray-500 text-xs">
                    {{ payment.node.customerPhone }}
                  </div>
                </td>
                <td class="px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{
                      payment.node.paymentTitle &&
                      payment.node.paymentTitle.length > 1
                        ? payment.node.paymentTitle
                        : "Processing"
                    }}
                  </div>
                  <div class="text-gray-500 text-xs">
                    {{
                      payment.node.paymentNo &&
                      payment.node.paymentNo.length > 1
                        ? payment.node.paymentNo
                        : "Processing"
                    }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{
                      payment.node.paymentId &&
                      payment.node.paymentId.length > 1
                        ? payment.node.paymentId
                        : "Processing"
                    }}
                  </div>
                  <div class="text-gray-500 text-xs">
                    {{
                      payment.node.paymentDate
                        ? dayjs(payment.node.paymentDate).format("D MMM Y")
                        : "Processing"
                    }}
                  </div>
                </td>
                <td
                  class="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right"
                >
                  <button
                    @click="selectOrderPayment(payment.node.id)"
                    type="button"
                    class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
                  >
                    Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <nav
            v-if="orderPayments.edges.length == 0"
            class="text-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6"
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
            v-else-if="orderPayments.edges.length >= first || hasMore"
            class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-4"
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
                  orderPayments.edges ? orderPayments.edges.length : 0
                }}</span>
              </p>
            </div>
            <div class="flex flex-1 justify-between sm:justify-end">
              <div class="inline-flex rounded-md shadow-sm">
                <button
                  @click="loadMore()"
                  type="button"
                  class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
                >
                  Next
                </button>
                <Menu as="div" class="relative -ml-px block">
                  <MenuButton
                    class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none"
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
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { computed, ref, watch } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { STORE_ORDER_PAYMENTS } from "@/gql/orderPayment";
import { useQuery } from "@vue/apollo-composable";
import { useOrderPaymentStore } from "@/stores/orderPayment";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCustomerStore } from "@/stores/customer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const { site } = storeToRefs(useSiteStore());
const { customer } = storeToRefs(useCustomerStore());
const { setOrderPaymentId } = useOrderPaymentStore();

// customer parameter
const first = ref([1].includes(site.value.industry) ? 10 : 12);
const after = ref(null);
// end parameter

const selectedOrderPayment = ref([]);
const indeterminate = computed(
  () =>
    selectedOrderPayment.value.length > 0 &&
    selectedOrderPayment.value.length < orderPayments.length
);
const router = useRouter();
// query
const { result, fetchMore, loading, error, refetch } = useQuery(
  STORE_ORDER_PAYMENTS,
  {
    siteId: site.value.id,
    customerId: customer.value.id,
    first: first.value,
    after: after.value,
  }
);
const orderPayments = computed(
  () => result.value?.storeOrderPayments ?? { edges: [] }
);
const loadMore = () => {
  fetchMore({
    variables: {
      first: first.value,
      after: orderPayments.value.pageInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.storeOrderPayments.edges;
      const newEdges = fetchMoreResult.storeOrderPayments.edges;
      const pageInfo = fetchMoreResult.storeOrderPayments.pageInfo;
      return newEdges.length
        ? {
            storeOrderPayments: {
              __typename: previousResult.storeOrderPayments.__typename,
              total: previousResult.storeOrderPayments.total,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
// end query
const selectOrderPayment = (paymentId) => {
  setOrderPaymentId(paymentId);
  router.push(`/user/payment/invoice/`);
};

const moreItems = [
  { name: "15", value: 15 },
  { name: "30", value: 30 },
  { name: "100", value: 100 },
  { name: "200", value: 200 },
];
const selectedTab = ref("All");
const tabs = [
  { id: null, name: "All", industry: [] },
  { id: 1, name: "Processing", industry: [] },
  { id: 2, name: "Paid", industry: [] },
  { id: 3, name: "Settled", industry: [] },
];
const toggleTab = (name) => {
  selectedTab.value = name;
};
const status = computed(() =>
  tabs.find((el) => el.name == selectedTab.value)
    ? tabs.find((el) => el.name == selectedTab.value).id
    : null
);
watch(status, () => {
  refetch({
    isPaid: status.value ? (status.value == 1 ? false : true) : null,
    isSettle: status.value ? (status.value == 2 ? true : null) : null,
  });
});

// watch(search, () => {
//   if (search.value) {
//     refetch({ search: search.value ? search.value : null });
//   } else {
//     refetch({ search: null });
//   }
// });
</script>

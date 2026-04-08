<template>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-gray-900">Transactions</h1>
      <p class="mt-2 text-sm text-gray-700">
        A list of all the transactions in your account including their name,
        title, email and role.
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
              {{ tab.name }}&nbsp;{{
                selectedTab == tab.name
                  ? "(" +
                    siteTransactions.edges.filter((v) =>
                      status ? v.node.status == status : true
                    ).length +
                    ")"
                  : ""
              }}
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
            v-if="selectedSiteTransaction.length > 0"
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
                      selectedSiteTransaction.length ===
                        siteTransactions.edges.length
                    "
                    :indeterminate="indeterminate"
                    @change="
                      selectedSiteTransaction = $event.target.checked
                        ? siteTransactions.edges.map((p) => p.node.id)
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
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Reference
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                >
                  TX Account
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                >
                  TX ID
                </th>
                <th
                  scope="col"
                  class="px-4 py-3.5 text-right text-sm font-semibold text-gray-900"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="transaction in siteTransactions.edges"
                :key="transaction.node.id"
                :class="[
                  selectedSiteTransaction.includes(transaction.node.id) &&
                    'bg-gray-50',
                  transaction.node.isPaid ? 'bg-green-100' : '',
                ]"
                class="cursor-pointer active:cursor-wait"
              >
                <td class="relative w-5 px-5 sm:w-5 sm:px-5">
                  <div
                    v-if="selectedSiteTransaction.includes(transaction.node.id)"
                    class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                  ></div>
                  <input
                    type="checkbox"
                    class="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                    :value="transaction.node.id"
                    v-model="selectedSiteTransaction"
                  />
                </td>
                <td
                  @click="selectSiteTransaction(transaction.node.id)"
                  class="whitespace-nowrap py-2 pl-3 sm:pl-0 pr-3 text-sm"
                >
                  <div class="flex items-center">
                    <div class="ml-0">
                      <div
                        :class="[
                          'whitespace-nowrap text-sm font-medium',
                          selectedSiteTransaction.includes(transaction.node.id)
                            ? 'text-indigo-600'
                            : 'font-medium text-gray-900',
                        ]"
                      >
                        {{ transaction.node.note }}
                      </div>
                      <div class="text-gray-500 text-xs">
                        {{ dayjs(transaction.node.updatedAt).fromNow() }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <span
                    class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-4 text-green-800"
                    >{{
                      transaction.node.isPaid
                        ? "Paid"
                        : transaction.node.isSettle
                        ? "Settled"
                        : "Processing"
                    }}</span
                  >
                </td>
                <td
                  @click="selectSiteTransaction(transaction.node.id)"
                  class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                >
                  <div class="text-gray-900">
                    {{ transaction.node.referTitle }}
                  </div>
                  <div class="text-gray-500 text-xs">
                    {{ transaction.node.referPhone }}
                  </div>
                </td>
                <td class="px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{
                      transaction.node.status == 0
                        ? "Wallet"
                        : transaction.node.paymentTitle &&
                          transaction.node.paymentTitle.length > 1
                        ? transaction.node.paymentTitle
                        : "Processing"
                    }}
                  </div>
                  <div class="text-gray-500 text-xs">
                    {{
                      transaction.node.status == 0
                        ? encodeId(me.id)
                        : transaction.node.paymentNo &&
                          transaction.node.paymentNo.length > 1
                        ? transaction.node.paymentNo
                        : "Processing"
                    }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{
                      transaction.node.status == 0
                        ? transaction.node.hid
                        : transaction.node.paymentId &&
                          transaction.node.paymentId.length > 1
                        ? transaction.node.paymentId
                        : "Processing"
                    }}
                  </div>
                  <div class="text-gray-500 text-xs">
                    {{
                      transaction.node.status == 0
                        ? dayjs(transaction.node.updatedAt).format(
                            "h:mm A MMM D"
                          )
                        : transaction.node.paymentDate
                        ? dayjs(transaction.node.paymentDate).format(
                            "h:mm A MMM D"
                          )
                        : "Processing"
                    }}
                  </div>
                </td>
                <td
                  class="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right"
                >
                  <span
                    class="inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-4"
                    :class="
                      transaction.node.status == 0
                        ? 'bg-green-100 text-green-800'
                        : ' bg-red-100 text-red-800'
                    "
                    >{{ transaction.node.status == 0 ? "" : "- "
                    }}{{
                      formatMoney(transaction.node.total, site.currency)
                    }}</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <nav
            v-if="siteTransactions.edges.length == 0"
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
            v-else-if="siteTransactions.edges.length >= first || hasMore"
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
                  siteTransactions.edges ? siteTransactions.edges.length : 0
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
import { SITE_TRANSACTIONS } from "@/gql/siteTransaction";
import { useQuery } from "@vue/apollo-composable";
import { useSiteTransactionStore } from "@/stores/siteTransaction";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const { site } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const { setSiteTransactionId } = useSiteTransactionStore();
// customer parameter
const first = ref([1].includes(site.value.industry) ? 10 : 12);
const after = ref(null);
// end parameter

const selectedSiteTransaction = ref([]);
const indeterminate = computed(
  () =>
    selectedSiteTransaction.value.length > 0 &&
    selectedSiteTransaction.value.length < siteTransactions.length
);
const router = useRouter();
// query
const { result, fetchMore, loading, error, refetch } = useQuery(
  SITE_TRANSACTIONS,
  {
    siteId: site.value.id,
    receiverId: me.value.id,
    first: first.value,
    after: after.value,
  }
);
const siteTransactions = computed(
  () => result.value?.siteTransactions ?? { edges: [] }
);
const loadMore = () => {
  fetchMore({
    variables: {
      receiverId: me.value.id,
      after: siteTransactions.value.pageInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.siteTransactions.edges;
      const newEdges = fetchMoreResult.siteTransactions.edges;
      const pageInfo = fetchMoreResult.siteTransactions.pageInfo;
      return newEdges.length
        ? {
            siteTransactions: {
              __typename: previousResult.siteTransactions.__typename,
              total: previousResult.siteTransactions.total,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
// end query
const selectSiteTransaction = (transactionId) => {
  setSiteTransactionId(transactionId);
  router.push(`/user/transaction/invoice/`);
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
  { id: 0, name: "In", industry: [] },
  { id: 1, name: "Out", industry: [] },
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

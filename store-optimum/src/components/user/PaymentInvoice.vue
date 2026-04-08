<template>
  <main v-if="orderPayment">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto relative">
        <h1 class="text-xl font-semibold text-gray-900 flex items-center">
          Invoice - ID: {{ orderPayment.hid }}
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Invoice processing from
          <time>{{ dayjs(orderPayment.updatedAt).format("D MMM YY") }}</time> to
          <time>{{ dayjs(orderPayment.updatedAt).fromNow() }}</time
          >.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <!-- <button
          @click="update()"
          type="button"
          class="inline-flex items-center justify-center rounded-l-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto"
        >
          Save
        </button>
        <button
          v-if="selectedTab == 'Invoice'"
          v-print="{
            id: 'Invoice',
            popTitle: 'Invoice',
            extraCss:
              'https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css',
          }"
          type="button"
          class="inline-flex items-center justify-center rounded-r-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto"
        >
          Print
        </button>
        <button
          v-else
          v-print="{
            id: 'POS',
            popTitle: 'POS',
            extraCss:
              'https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css',
          }"
          type="button"
          class="inline-flex items-center justify-center rounded-r-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto"
        >
          Print
        </button> -->
      </div>
    </div>
    <div
      class="mx-auto mt-4 mb-4 grid max-w-2xl grid-cols-1 gap-6 sm:px-0 lg:max-w-6xl lg:grid-flow-col-dense lg:grid-cols-2"
    >
      <div class="space-y-6 lg:col-span-2 lg:col-start-1">
        <!-- Tabs -->
        <div class="lg:block">
          <div class="border-b border-gray-200">
            <nav class="overflow-x-auto -mb-px flex space-x-8">
              <div
                @click="toggleTab(tab.name)"
                v-for="tab in tabs"
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
    <!-- Page header -->
    <div v-show="selectedTab === 'Invoice'"
      id="Invoice"
      class="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 lg:max-w-6xl lg:grid-flow-col-dense lg:grid-cols-3"
    >
      <div ref="invoiceContent" class="space-y-0 lg:col-span-3 lg:col-start-1">
        <!-- Invoice -->
        <div class="max-w-[85rem] mx-auto">
          <!-- Grid -->
          <div
            class="mb-5 pb-5 flex justify-between items-center border-b border-gray-400"
          >
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Invoice</h2>
              <dd class="font-medium text-gray-800">
                <span class="block font-semibold">{{ site.title }}</span>
                <address class="not-italic font-normal">
                  {{ site.domain }}
                </address>
                <address class="not-italic font-normal">
                  {{ site.address }}
                </address>
              </dd>
            </div>
            <!-- Col -->
            <!-- Col -->
          </div>
          <!-- End Grid -->

          <!-- Grid -->
          <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
            <div>
              <div class="grid space-y-3">
                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Billed to:
                  </dt>
                  <dd class="text-gray-800">
                    <div
                      class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
                    >
                      {{ orderPayment.customerPhone }}
                    </div>
                  <dd class="font-medium text-gray-800">
                    <span class="block font-semibold">{{
                      orderPayment.customerTitle
                    }}</span>
                  </dd>
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Billing details:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    <span class="block font-semibold">{{
                      orderPayment.paymentId
                    }}</span>
                    <address class="not-italic font-normal">
                      {{ orderPayment.paymentDate }}
                    </address>
                  </dd>
                </dl>
                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Note:
                  </dt>
                  <dd class="text-gray-800">
                    <div
                      class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
                    >
                      {{ orderPayment.note ? orderPayment.note : "---" }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <!-- Col -->

            <div>
              <div class="grid space-y-3">
                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Invoice number:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ orderPayment.hid }}
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Status:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ orderPayment.isPaid ? "Paid" : "Processing"}}
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Due date:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ dayjs(orderPayment.updatedAt).format("h:mm A D MMM YY") }}
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Billing method:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ orderPayment.paymentTitle }}
                  </dd>
                  <dd class="font-medium text-gray-800">
                    {{ orderPayment.paymentNo }}
                  </dd>
                </dl>
              </div>
            </div>
            <!-- Col -->
          </div>
          <!-- End Grid -->

          <!-- Table -->
          <div
            class="mt-6 border border-gray-400 p-4 rounded-lg space-y-4"
          >
            <div class="hidden sm:grid sm:grid-cols-5">
              <div
                class="sm:col-span-2 text-xs font-medium text-gray-500 uppercase"
              >
                Item
              </div>
              <div
                class="text-left text-xs font-medium text-gray-500 uppercase"
              >
                Sell
              </div>
              <div
                class="text-left text-xs font-medium text-gray-500 uppercase"
              >
                Charge
              </div>
              <div
                class="text-right text-xs font-medium text-gray-500 uppercase"
              >
                Commission
              </div>
            </div>

            <div
              class="hidden sm:block border-b border-gray-400"
            ></div>

            <div
              v-for="product in orderPayment.orders"
              :key="product.id"
              class="grid grid-cols-3 sm:grid-cols-5 gap-2"
            >
              <div class="col-span-full sm:col-span-2">
                <h5
                  class="sm:hidden text-xs font-medium text-gray-500 uppercase"
                >
                  Item
                </h5>
                <p class="font-medium text-gray-800">
                  ID: {{ encodeId(
                          product.id,
                          "76JRZVMHONQ0I24CUYSXKW58DF1EATB3GLP9"
                        ) }}
                </p>
                <p class="font-normal text-gray-500 text-xs">
                  {{ product.customerTitle
                  }} - {{ product.customerPhone }}
                </p>
              </div>
              <div>
                <h5
                  class="sm:hidden text-xs font-medium text-gray-500 uppercase"
                >
                  Sell
                </h5>
                <p class="text-gray-800">{{ formatMoney(product.total, site.currency) }}</p>
              </div>
              <div>
                <h5
                  class="sm:hidden text-xs font-medium text-gray-500 uppercase"
                >
                  Charge
                </h5>
                <p class="text-gray-800">
                  {{ formatMoney(product.logisticsCharge, site.currency) }}
                </p>
              </div>
              <div>
                <h5
                  class="sm:hidden text-xs font-medium text-gray-500 uppercase"
                >
                  Commission
                </h5>
                <p class="sm:text-right text-gray-800">
                  {{
                    formatMoney(
                      product.resellerCommission,
                      site.currency
                    )
                  }}
                </p>
              </div>
            </div>
          </div>
          <!-- End Table -->

          <!-- Flex -->
          <div class="mt-8 flex sm:justify-end">
            <div class="w-full max-w-xl sm:text-right space-y-2">
              <!-- Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                <dl
                  v-if="subTotal > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Subtotal:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(subTotal, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="charge > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Charge:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(charge, site.currency) }}
                  </dd>
                </dl>
                <dl
                  
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Net Amount:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(orderPayment.total, site.currency) }}
                  </dd>
                </dl>
                <dl
                  
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Total Paid:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(orderPayment.isPaid ? orderPayment.total : 0.0, site.currency) }}
                  </dd>
                </dl>
                <dl class="grid sm:grid-cols-5 gap-x-3 text-sm">
                  <dt class="col-span-3 text-gray-500">Due balance:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(orderPayment.isPaid ? 0.0 : orderPayment.total, site.currency) }}
                  </dd>
                </dl>
              </div>
              <!-- End Grid -->
            </div>
          </div>
          <!-- End Flex -->
        </div>
        <br />
        <!-- End Invoice -->
      </div>
    </div>
  </main>
</template>

<script setup>
import { STORE_ORDER_PAYMENT_DETAILS } from "@/gql/orderPayment";
import { useQuery } from "@vue/apollo-composable";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useOrderPaymentStore } from "@/stores/orderPayment";
import { useNotificationsStore } from "@/stores/notifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const { site } = storeToRefs(useSiteStore());
const { orderPaymentId } = storeToRefs(useOrderPaymentStore());
const orderPayment = ref(null);
const { onResult, loading, error, refetch } = useQuery(STORE_ORDER_PAYMENT_DETAILS, {
  siteId: site.value.id,
  id: orderPaymentId.value,
});
onResult((queryResult) => {
  orderPayment.value = queryResult.data.storeOrderPayment;
});

const selectedTab = ref("Invoice");
const tabs = [
  { name: "Invoice", industry: [] },
];
const toggleTab = (name) => {
  selectedTab.value = name;
};

const subTotal = computed(() => {
  let total = 0;
  if (orderPayment.value) {
    for (let product of orderPayment.value.orders) {
      total += product.resellerCommission;
    }
  }
  return total;
});
const charge = computed(() => {
  let total = 0;
  if (orderPayment.value) {
    for (let product of orderPayment.value.orders) {
      total += product.logisticsCharge;
    }
  }
  return total;
});
</script>

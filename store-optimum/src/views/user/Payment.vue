<template>
  <main class="max-w-screen-2xl mx-auto sm:px-4 pb-[50px] pt-[50px] sm:pt-0">
    <div class="bg-white pb-40 sm:pt-10">
      <div
        class="flex w-full flex-col rounded-lg lg:min-h-[70vh] lg:flex-row lg:shadow-card xl:min-h-[830px]"
      >
        <SideBar />
        <main
          v-if="customer"
          class="flex w-full flex-grow flex-col lg:flex-grow-0 lg:bg-light px-4 lg:p-5 lg:dark:bg-dark-250 overflow-auto"
        >
          <div class="flex align-center space-between w-full">
            <div class="sm:flex-auto w-full">
              <h1 class="text-xl font-semibold text-gray-900 flex items-center">
                {{ customer.title }}
                <BoltIcon
                  class="cursor-pointer active:cursor-wait h-4 w-4 ml-2"
                  aria-hidden="true"
                ></BoltIcon>
              </h1>
              <p class="mt-2 text-sm text-gray-700">
                {{ customer.phone }}<br />{{ customer.address }}
              </p>
            </div>
            <ArrowPathIcon
              @click="refetch()"
              class="cursor-pointer active:cursor-wait h-6 w-6 ml-2"
              aria-hidden="true"
            />
          </div>
          <dl
            class="mt-5 mb-5 grid grid-cols-2 divide-y divide-x divide-gray-200 overflow-hidden rounded-lg bg-white md:grid-cols-4"
          >
            <div class="px-2 py-4 sm:p-4">
              <dt class="text-base font-normal text-gray-900">
                Total transaction
              </dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                >
                  {{ formatMoney(customer.totalPurchase, site.currency) }}
                </div>
              </dd>
            </div>
            <div class="px-2 py-4 sm:p-4">
              <dt class="text-base font-normal text-gray-900">Total profit</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                >
                  {{ formatMoney(customer.resellTotal, site.currency) }}
                </div>
              </dd>
            </div>
            <div class="px-2 py-4 sm:p-4">
              <dt class="text-base font-normal text-gray-900">Payable</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                >
                  {{ formatMoney(customer.resellPayable, site.currency) }}
                </div>
              </dd>
            </div>
            <div class="px-2 py-4 sm:p-4">
              <dt class="text-base font-normal text-gray-900">Processing</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-red-500"
                >
                  {{ formatMoney(customer.resellProcessing, site.currency) }}
                </div>
              </dd>
            </div>
            <div class="px-2 py-4 sm:p-4">
              <dt class="text-base font-normal text-gray-900">Paid</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                >
                  {{ formatMoney(customer.resellPaid, site.currency) }}
                </div>
              </dd>
            </div>
            <div class="px-2 py-4 sm:p-4">
              <dt class="text-base font-normal text-gray-900">Order pending</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                >
                  {{ customer.ordersPending }}
                </div>
              </dd>
            </div>
            <div class="px-2 py-4 sm:p-4">
              <dt class="text-base font-normal text-gray-900">Processing</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                >
                  {{
                    customer.ordersPlaced +
                    customer.ordersConfirmed +
                      customer.ordersShipment +
                    customer.ordersPackaging
                  }}
                </div>
              </dd>
            </div>
            <div class="px-2 py-4 sm:p-4">
              <dt class="text-base font-normal text-gray-900">Cancel</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                >
                  {{ customer.ordersCancelled }}
                </div>
              </dd>
            </div>
            <div class="px-2 py-4 sm:p-4">
              <dt class="text-base font-normal text-gray-900">Returned</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-red-500"
                >
                  {{ customer.ordersReturned }}
                </div>
              </dd>
            </div>
            <div class="px-2 py-4 sm:p-4">
              <dt class="text-base font-normal text-gray-900">Deliverd</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                >
                  {{ customer.ordersDelivered }}
                </div>
              </dd>
            </div>
          </dl>
          <fieldset class="mb-0 grid gap-5 sm:grid-cols-3">
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 mt-2 w-full"
            >
              <label
                for="name"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                >Shop Name</label
              >
              <input
                @change="update()"
                v-model.lazy.trim="customer.title"
                placeholder="Enter your shop name"
                type="text"
                name="name"
                id="name"
                class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
              />
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <ExclamationCircleIcon
                  v-if="customer.title.length == 0"
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <CheckCircleIcon
                  v-else
                  class="h-5 w-5 text-gray-400 hidden"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 mt-2 w-full"
            >
              <label
                for="name"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                >Payment Title</label
              >
              <input
                @change="update()"
                v-model.lazy.trim="customer.paymentTitle"
                placeholder="Enter payment title"
                type="text"
                name="name"
                id="name"
                class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
              />
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <ExclamationCircleIcon
                  v-if="customer.paymentTitle.length == 0"
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <CheckCircleIcon
                  v-else
                  class="h-5 w-5 text-gray-400 hidden"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 mt-2 w-full"
            >
              <label
                for="name"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                >Payment NO.</label
              >
              <input
                @change="update()"
                v-model.lazy.trim="customer.paymentNo"
                placeholder="Enter payment no"
                type="text"
                name="name"
                id="name"
                class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
              />
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <ExclamationCircleIcon
                  v-if="customer.paymentNo.length == 0"
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <CheckCircleIcon
                  v-else
                  class="h-5 w-5 text-gray-400 hidden"
                  aria-hidden="true"
                />
              </div>
            </div>
          </fieldset>

          <div class="mx-auto mt-0 w-full">
            <div class="space-y-6 lg:col-span-2 lg:col-start-1">
              <!-- Tabs -->
              <div class="lg:block">
                <div class="border-b border-gray-200">
                  <nav class="-mb-px flex space-x-4 overflow-x-auto">
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
          <div v-if="selectedTab == 'Orders'" class="py-4">
            <OrderList v-if="selectedTab == 'Orders'" />
          </div>
          <div v-else-if="selectedTab == 'Payments'" class="py-4">
            <PaymentList />
          </div>
        </main>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "UserResell",
};
</script>
<script setup>
import { cloneDeep } from "lodash";
import { computed, ref, defineAsyncComponent } from "vue";
import {
  STORE_CUSTOMER_DETAILS,
  SELF_STORE_CUSTOMER_UPDATE,
} from "@/gql/customer";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useNotificationsStore } from "@/stores/notifications";
import { useMeStore } from "@/stores/me";
import { useCustomerStore } from "@/stores/customer";
import {
  BoltIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";
const OrderList = defineAsyncComponent(() =>
  import("@/components/user/OrderList.vue")
);
const PaymentList = defineAsyncComponent(() =>
  import("@/components/user/PaymentList.vue")
);
const SideBar = defineAsyncComponent(() =>
  import("@/components/user/SideBar.vue")
);
const { site } = storeToRefs(useSiteStore());
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { customerId } = storeToRefs(useCustomerStore());

const selectedTab = ref("Orders");
const tabs = [
  { id: 0, name: "Orders", industry: [] },
  { id: 1, name: "Payments", industry: [] },
];
const toggleTab = (name) => {
  selectedTab.value = name;
};
const note = ref([
  {
    key: "name",
    type: "text",
    title: "দোকানের নাম ?",
    value: "",
    placeholder: "দোকানের নাম লেখুন",
  },
  {
    key: "area",
    type: "text",
    title: "এরিয়া নাম ?",
    value: "",
    placeholder: "এরিয়া নাম লেখুন",
  },
  {
    key: "refer",
    type: "text",
    title: "রেফারেন্স কোড ?",
    value: "",
    placeholder: "রেফারেন্স কোড লেখুন",
  },
  {
    key: "nid",
    type: "text",
    title: "ভোটার আইডি ?",
    value: "",
    placeholder: "ভোটার আইডি লেখুন",
  },
  {
    key: "regid",
    type: "text",
    title: "ড্রাগ রেজিস্ট্রেশন ?",
    value: "",
    placeholder: "ড্রাগ রেজিস্ট্রেশন লেখুন",
  },
  {
    key: "trade",
    type: "text",
    title: "ট্রেড লাইসেন্স ?",
    value: "",
    placeholder: "ট্রেড লাইসেন্স লেখুন",
  },
  {
    key: "experience",
    type: "radio",
    title: "প্রোডাক্ট কেনা বেচার পূর্বক অভিজ্ঞতা আছে কি?",
    value: "yes",
    values: [
      { key: "yes", type: "radio", title: "হ্যাঁ, আমার আছে", value: "yes" },
      { key: "no", type: "radio", title: "না, আমার নেই", value: "no" },
    ],
    placeholder: "Select experience",
  },
  {
    key: "hasShop",
    type: "radio",
    title: "আপনি কি মাধ্যমে কেনা-বেচা করেছেন?",
    value: "online",
    values: [
      {
        key: "online",
        type: "radio",
        title: "অনলাইন : ওয়েবসাইট / ফেইসবুক",
        value: "online",
      },
      {
        key: "retail",
        type: "radio",
        title: "রিটেল : শপ / শোরুম",
        value: "retail",
      },
      { key: "no", type: "radio", title: "নেই", value: "no" },
    ],
    placeholder: "Select shop",
  },
]);
const { result, loading, error, refetch } = useQuery(STORE_CUSTOMER_DETAILS, {
  id: customerId.value,
});
const customer = computed(() => {
  let c = cloneDeep(result.value?.storeCustomer ?? null);
  if (c) {
    note.value = JSON.stringify(c.note) != "{}" ? cloneDeep(c.note) : [];
  }
  // update reseller
  if (c.isReseller == false) {
    update();
  }
  return c;
});

const update = async () => {
  const { mutate, loading, error } = useMutation(SELF_STORE_CUSTOMER_UPDATE, {
    variables: {
      userId: me.value.id,
      customerId: customer.value.id,
      title: customer.value.title,
      isReseller: true,
      paymentTitle: customer.value.paymentTitle,
      paymentNo: customer.value.paymentNo,
      note: note.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfStoreCustomerUpdateByCustomer) {
      addNotification(
        { title: "Users info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
  } catch (error) {
    addNotification({ title: "Users info", subTitle: error.message }, "error");
  }
};
</script>

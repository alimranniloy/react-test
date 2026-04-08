<template>
  <main class="max-w-screen-2xl mx-auto sm:px-4 pb-[50px] pt-12 md:pt-0">
    <div class="bg-white pb-40 lg:pt-8 sm:rounded-xl sm:mt-4">
      <div
        class="flex w-full flex-col gap-5 lg:min-h-[70vh] lg:flex-row lg:shadow-card xl:min-h-[830px]"
      >
        <SideBar />
        <div
          v-if="customer"
          class="flex w-full flex-grow flex-col lg:flex-grow-0 lg:bg-light px-4 lg:p-5 lg:dark:bg-dark-250 overflow-auto"
        >
          <div class="flex align-center space-between w-full">
            <div class="sm:flex-auto w-full">
              <h1 class="text-xl font-semibold text-gray-900">Reseller</h1>
              <p class="mt-2 text-sm text-gray-700">
                Manage payments: receiveable, received, processing in your
                Reseller Dashboard.
              </p>
            </div>
            <ArrowPathIcon
              @click="refetch()"
              class="cursor-pointer active:cursor-wait h-6 w-6 ml-2"
              aria-hidden="true"
            />
          </div>
          <div
            v-if="
              (customer.isActive && customer.isReseller) ||
              (site.isPublic && site.siteInfo == 'reseller')
            "
          >
            <dl
              class="mt-5 mb-5 grid grid-cols-2 border border-gray-200 overflow-hidden rounded-lg bg-white md:grid-cols-4"
            >
              <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
                <dt class="text-base font-normal text-gray-900">Receiveable</dt>
                <dd
                  class="flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                  >
                    {{ formatMoney(customer.resellPayable, site.currency) }}
                  </div>
                </dd>
              </div>
              <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
                <dt class="text-base font-normal text-gray-900">Received</dt>
                <dd
                  class="flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                  >
                    {{ formatMoney(customer.resellPaid, site.currency) }}
                  </div>
                </dd>
              </div>
              <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
                <dt class="text-base font-normal text-gray-900">Processing</dt>
                <dd
                  class="flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-red-500"
                  >
                    {{ formatMoney(customer.resellProcessing, site.currency) }}
                  </div>
                </dd>
              </div>
              <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
                <dt class="text-base font-normal text-gray-900">Total</dt>
                <dd
                  class="flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                  >
                    {{ formatMoney(customer.resellTotal, site.currency) }}
                  </div>
                </dd>
              </div>
            </dl>

            <button
              v-if="customer.resellPayable >= site.withdraw"
              @click="paymentRequest()"
              class="bg-[--primary] text-white py-3 px-6 text-sm font-medium rounded-md shadow-sm"
            >
              Payment Request
            </button>
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
            <div :key="key" class="py-4">
              <PaymentList />
            </div>
          </div>
          <div v-else>
            <ProductPackageList />

            <fieldset class="mb-0 grid gap-5 sm:grid-cols-3 mt-10">
              <div
                class="relative rounded-md border border-gray-300 px-3 py-3 w-full"
              >
                <label
                  for="title"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                  >Shop Name</label
                >
                <input
                  v-model.lazy.trim="customer.title"
                  placeholder="Enter your shop name"
                  type="text"
                  name="title"
                  id="title"
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
                class="relative rounded-md border border-gray-300 px-3 py-3 w-full"
              >
                <label
                  for="paymentTitle"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                  >Payment Title</label
                >
                <input
                  v-model.lazy.trim="customer.paymentTitle"
                  placeholder="Enter payment title"
                  type="text"
                  name="paymentTitle"
                  id="paymentTitle"
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
                class="relative rounded-md border border-gray-300 px-3 py-3 w-full"
              >
                <label
                  for="paymentNo"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                  >Payment NO.</label
                >
                <input
                  v-model.lazy.trim="customer.paymentNo"
                  placeholder="Enter payment no"
                  type="text"
                  name="paymentNo"
                  id="paymentNo"
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
            <button
              @click="update([...customer.customerTypes, 2])"
              class="mt-4 mr-4 bg-[--primary] text-white py-3 px-6 text-sm font-medium rounded-md shadow-sm"
            >
              {{
                customer.customerTypes.includes(2) && !customer.isReseller
                  ? "Requested"
                  : "Request for reselling"
              }}
            </button>
            <button
              v-if="customer.customerTypes.includes(2) && !customer.isReseller"
              @click="update(customer.customerTypes.filter(type => type !== 2))"
              class="mt-4 rounded-md bg-red-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
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
import { SELF_STORE_ORDER_PAYMENT_CREATE } from "@/gql/order";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useNotificationsStore } from "@/stores/notifications";
import { useMeStore } from "@/stores/me";
import { useCustomerStore } from "@/stores/customer";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";
const ProductPackageList = defineAsyncComponent(() =>
  import("@/components/ProductPackageList.vue")
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
const selectedTab = ref("Payments");
const tabs = [{ id: 1, name: "Payments", industry: [] }];
const toggleTab = (name) => {
  selectedTab.value = name;
};
const key = ref(1);
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
  return c;
});

const update = async (customerTypes) => {
  const { mutate, loading, error } = useMutation(SELF_STORE_CUSTOMER_UPDATE, {
    variables: {
      userId: me.value.id,
      customerId: customer.value.id,
      title: customer.value.title,
      customerTypes: customerTypes,
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
  refetch()
};

const paymentRequest = async () => {
  const { mutate, loading, error } = useMutation(
    SELF_STORE_ORDER_PAYMENT_CREATE,
    {
      variables: {
        userId: me.value.id,
        siteId: site.value.id,
        customerId: customer.value.id,
        queryType: "reseller",
      },
    }
  );
  try {
    const response = await mutate();
    if (response.data.selfStoreOrderPaymentCreate) {
      addNotification(
        { title: "Users info", subTitle: "Payment Request Sent Successfully!" },
        "success"
      );
      key.value = +1;
    }
  } catch (error) {
    addNotification({ title: "Users info", subTitle: error.message }, "error");
  }
};
</script>

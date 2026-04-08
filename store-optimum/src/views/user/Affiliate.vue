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
              <h1 class="text-xl font-semibold text-gray-900">Affiliate</h1>
              <p class="mt-2 text-sm text-gray-700">
                Manage payments: receiveable, received, processing in your
                Affiliate Dashboard.
              </p>
            </div>
            <ArrowPathIcon
              @click="update([4])"
              class="cursor-pointer active:cursor-wait h-6 w-6 ml-2"
              aria-hidden="true"
            />
          </div>

          <div v-if="customer.isActive && customer.isAffiliate">
            <dl
              class="mt-5 mb-5 grid grid-cols-2 md:grid-cols-5 border border-gray-200 bg-white"
            >
              <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
                <dt class="text-base font-normal text-gray-900">Refer code</dt>
                <dd
                  class="mt-1 flex items-center justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-center text-0.5xl md:text-1xl font-semibold text-indigo-600"
                  >
                    {{ customer.isAffiliate ? me.referCode : "******" }}
                  </div>
                  <div v-if="customer.isAffiliate" class="flex items-center">
                    <ClipboardDocumentCheckIcon
                      @click="
                        copyText(
                          `https://${site.domain}/?refer=${me.referCode}`
                        )
                      "
                      class="cursor-pointer active:cursor-wait h-5 w-5 text-blue-400"
                      aria-hidden="true"
                    />
                    <a
                      :href="`https://${site.domain}/?refer=${me.referCode}`"
                      target="_blank"
                    >
                      <LinkIcon
                        class="cursor-pointer active:cursor-wait h-5 w-5 ml-4 text-blue-400"
                        aria-hidden="true"
                    /></a>
                  </div>
                </dd>
              </div>
              <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
                <dt class="text-base font-normal text-gray-900">Receiveable</dt>
                <dd
                  class="mt-1 flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                  >
                    {{ formatMoney(customer.affiliatePayable, site.currency) }}
                  </div>
                </dd>
              </div>
              <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
                <dt class="text-base font-normal text-gray-900">Received</dt>
                <dd
                  class="mt-1 flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                  >
                    {{ formatMoney(customer.affiliatePaid, site.currency) }}
                  </div>
                </dd>
              </div>
              <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
                <dt class="text-base font-normal text-gray-900">Processing</dt>
                <dd
                  class="mt-1 flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-red-500"
                  >
                    {{
                      formatMoney(customer.affiliateProcessing, site.currency)
                    }}
                  </div>
                </dd>
              </div>
              <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
                <dt class="text-base font-normal text-gray-900">Total</dt>
                <dd
                  class="mt-1 flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                  >
                    {{ formatMoney(customer.affiliateTotal, site.currency) }}
                  </div>
                </dd>
              </div>
            </dl>
            <button
              v-if="customer.affiliatePayable > site.withdraw"
              @click="showWithdraw = !showWithdraw"
              class="bg-[--primary] text-white py-3 px-6 text-sm font-medium rounded-md shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--primary]"
            >
              Withdraw
            </button>
            <div class="mx-auto mt-4 w-full">
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
            <div :key="key" v-if="selectedTab == 'Payments'" class="py-4">
              <TransactionList />
            </div>
            <div v-else-if="selectedTab == 'Orders'" class="py-4">
              <OrderList :referId="customer.userId" />
            </div>
            <div v-else-if="selectedTab == 'Users'" class="py-4">
              <UserList />
            </div>
            <div v-else-if="selectedTab == 'Products'" class="py-4">
              <ProductList />
            </div>
          </div>
          <div v-else>
            <ProductPackageList @onLoad="toggleShowRequest" />
            <div v-show="showRequest">
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
                @click="update([4])"
                class="h-10 mr-2 mt-4 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {{
                  customer.customerTypes.includes(4) && !customer.isAffiliate
                    ? "Requested"
                    : "Request for affiliate"
                }}
              </button>
              <button
                v-if="customer.customerTypes.includes(4) && !customer.isAffiliate"
                @click="update([1])"
                class="h-10 mr-2 mt-4 rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TransitionRoot as="template" :show="showWithdraw">
      <Dialog as="div" class="relative z-[99]" @close="showWithdraw = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>
        <div
          class="fixed inset-0 z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300"
        >
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg sm:p-6"
              >
                <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-offset-2"
                    @click="showWithdraw = false"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <h6
                  class="text-md text-center border-b pb-3 mb-3 font-semibold"
                >
                  Withdraw amount
                </h6>
                <div
                  class="relative rounded-md border border-gray-300 px-3 py-3 mt-4 w-full"
                >
                  <label
                    for="amount"
                    class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                    >Amount</label
                  >
                  <input
                    v-model.number="amount"
                    placeholder="Enter withdraw amount"
                    type="number"
                    name="amount"
                    id="amount"
                    class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
                  />
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    @click="withdraw"
                    type="button"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-25"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    @click="showWithdraw = false"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </main>
</template>
<script>
export default {
  name: "UserAffiliate",
};
</script>
<script setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { copyText } from "vue3-clipboard";
import { cloneDeep } from "lodash";
import { computed, ref, defineAsyncComponent } from "vue";
import {
  STORE_CUSTOMER_DETAILS,
  SELF_STORE_CUSTOMER_UPDATE,
} from "@/gql/customer";
import { SELF_SITE_TRANSACTION_CREATE } from "@/gql/siteTransaction";
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
  XMarkIcon,
  LinkIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/vue/24/outline";
const ProductPackageList = defineAsyncComponent(() =>
  import("@/components/ProductPackageList.vue")
);
const SideBar = defineAsyncComponent(() =>
  import("@/components/user/SideBar.vue")
);
const UserList = defineAsyncComponent(() =>
  import("@/components/user/UserList.vue")
);
const ProductList = defineAsyncComponent(() =>
  import("@/components/user/ProductList.vue")
);
const TransactionList = defineAsyncComponent(() =>
  import("@/components/user/TransactionList.vue")
);
const OrderList = defineAsyncComponent(() =>
  import("@/components/user/OrderList.vue")
);
const { site } = storeToRefs(useSiteStore());
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { customerId } = storeToRefs(useCustomerStore());
const showRequest = ref(false);
const amount = ref(0.0);
const showWithdraw = ref(false);
const selectedTab = ref("Payments");
const key = ref(1);
const tabs = [
  { id: 0, name: "Payments", industry: [] },
  { id: 1, name: "Orders", industry: [] },
  { id: 2, name: "Users", industry: [] },
  { id: 3, name: "Products", industry: [] },
];
const toggleTab = (name) => {
  selectedTab.value = name;
};
const { result, refetch } = useQuery(STORE_CUSTOMER_DETAILS, {
  id: customerId.value,
});
const customer = computed(() => {
  let c = cloneDeep(result.value?.storeCustomer ?? null);
  return c;
});

const update = async (customerTypes) => {
  const { mutate } = useMutation(SELF_STORE_CUSTOMER_UPDATE, {
    variables: {
      userId: me.value.id,
      customerId: customer.value.id,
      title: customer.value.title,
      customerTypes: customerTypes,
      paymentTitle: customer.value.paymentTitle,
      paymentNo: customer.value.paymentNo,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfStoreCustomerUpdateByCustomer) {
      addNotification(
        { title: "Users info", subTitle: "Successfully updated new data." },
        "success"
      );
      refetch();
    }
  } catch (error) {
    addNotification({ title: "Users info", subTitle: error.message }, "error");
  }
};

const withdraw = async () => {
  if (customer.value.affiliatePayable >= amount.value) {
    const { mutate } = useMutation(SELF_SITE_TRANSACTION_CREATE, {
      variables: {
        userId: me.value.id,
        siteId: site.value.id,
        charge: 0.0,
        isPaid: false,
        isSettle: false,
        note: "Cash withdraw",
        other: 0.0,
        paymentNo: customer.value.paymentNo,
        paymentTitle: customer.value.paymentTitle,
        receiverId: me.value.id,
        referId: customer.value.id,
        referPhone: customer.value.phone,
        referTitle: customer.value.title,
        senderId: site.value.createdById,
        source: "customer_withdraw",
        status: 1,
        subTotal: amount.value,
        total: amount.value,
      },
    });
    try {
      const response = await mutate();
      if (response.data.selfSiteTransactionCreate) {
        addNotification(
          { title: "Users info", subTitle: "Successfully updated new data." },
          "success"
        );
        update("refresh");
        key.value += 1;
        showWithdraw.value = false;
      }
    } catch (error) {
      addNotification(
        { title: "Users info", subTitle: error.message },
        "error"
      );
    }
  } else {
    addNotification(
      {
        title: "Users info",
        subTitle:
          "Amount can't be more than payable or less than " +
          site.value.affiliateJoinFee * 10,
      },
      "error"
    );
  }
};
const toggleShowRequest = (status) => {
  showRequest.value = status;
};
</script>

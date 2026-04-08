<template>
  <main class="max-w-screen-2xl mx-auto sm:px-4 pb-[50px] pt-12 md:pt-0">
    <div class="bg-white pb-40 lg:pt-8 sm:rounded-xl sm:mt-4">
      <div
        class="flex w-full flex-col gap-5 lg:min-h-[70vh] lg:flex-row lg:shadow-card xl:min-h-[830px]"
      >
        <SideBar />
        <div
          v-if="customer"
          class="flex w-full flex-grow flex-col lg:flex-grow-0 lg:bg-light px-4 pb-4 lg:px-5 lg:dark:bg-dark-250 overflow-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300"
        >
          <div class="flex align-center space-between">
            <div class="sm:flex-auto w-full">
              <h1 class="text-xl font-semibold text-gray-900 flex items-center">
                {{ customer.title }}
              </h1>
              <div class="flex items-center gap-1">
                <PhoneIcon class="w-4 h-4 text-gray-700"/>
                <p class="mt-1 text-sm text-gray-700 font-semibold">
                  {{ customer.phone }}
                </p>
              </div>
              <div class="flex items-center gap-1">
                <MapPinIcon class="w-4 h-4 text-gray-700"/>
                <p class="mt-1 text-sm text-gray-700 font-semibold">
                  {{ customer.address }}
                </p>
              </div>
            </div>
            <ArrowPathIcon
              @click="refetch()"
              class="cursor-pointer active:cursor-wait h-6 w-6 ml-2"
              aria-hidden="true"
            />
          </div>
          <dl
            class="mt-5 mb-5 grid grid-cols-2 md:grid-cols-5 overflow-hidden rounded-lg bg-white border border-gray-20"
          >
            <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
              <dt class="text-base font-normal text-gray-900">Purchase</dt>
              <dd class="flex items-baseline justify-between md:block lg:flex">
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                >
                  {{ formatMoney(customer.totalPurchase, site.currency) }}
                </div>
              </dd>
            </div>
            <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
              <dt class="text-base font-normal text-gray-900">Balance</dt>
              <dd class="flex items-baseline justify-between md:block lg:flex">
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-red-500"
                >
                  {{ formatMoney(customer.totalBalance, site.currency) }}
                </div>
              </dd>
            </div>
            <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
              <dt class="text-base font-normal text-gray-900">Cashback</dt>
              <dd class="flex items-baseline justify-between md:block lg:flex">
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                >
                  {{
                    formatMoney(customer.totalCashbackBalance, site.currency)
                  }}
                </div>
              </dd>
            </div>
            <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
              <dt class="text-base font-normal text-gray-900">Gift Card</dt>
              <dd class="flex items-baseline justify-between md:block lg:flex">
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                >
                  {{
                    formatMoney(customer.totalGiftCardBalance, site.currency)
                  }}
                </div>
              </dd>
            </div>
            <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
              <dt class="text-base font-normal text-gray-900">Reward point</dt>
              <dd class="flex items-baseline justify-between md:block lg:flex">
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                >
                  {{ formatMoney(customer.totalRewardPoints, site.currency) }}
                </div>
              </dd>
            </div>
            <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
              <dt class="text-base font-normal text-gray-900">Order pending</dt>
              <dd class="flex items-baseline justify-between md:block lg:flex">
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                >
                  {{ customer.ordersPending }}
                </div>
              </dd>
            </div>
            <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
              <dt class="text-base font-normal text-gray-900">Processing</dt>
              <dd class="flex items-baseline justify-between md:block lg:flex">
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
            <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
              <dt class="text-base font-normal text-gray-900">Cancel</dt>
              <dd class="flex items-baseline justify-between md:block lg:flex">
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                >
                  {{ customer.ordersCancelled }}
                </div>
              </dd>
            </div>
            <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
              <dt class="text-base font-normal text-gray-900">Returned</dt>
              <dd class="flex items-baseline justify-between md:block lg:flex">
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-red-500"
                >
                  {{ customer.ordersReturned }}
                </div>
              </dd>
            </div>
            <div class="px-3 py-2 mb:px-2 mb:py-4 border border-gray-200">
              <dt class="text-base font-normal text-gray-900">Deliverd</dt>
              <dd class="flex items-baseline justify-between md:block lg:flex">
                <div
                  class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-green-500"
                >
                  {{ customer.ordersDelivered }}
                </div>
              </dd>
            </div>
          </dl>
          <!-- <div class="mt-4">
            <div class="space-y-6">
              <div class="sm:flex-auto">
                <h1
                  class="text-xl font-semibold text-gray-900 flex items-center"
                >
                  User Details
                  <BoltIcon
                    @click="refetch()"
                    class="cursor-pointer active:cursor-wait h-4 w-4 ml-2"
                    aria-hidden="true"
                  />
                </h1>
                <p class="mt-2 text-sm text-gray-700">
                  A list of all the company in your account including their
                  name, title, net cash and available balance.
                </p>
              </div>
              <div v-for="item in note" :key="item.title">
                <div
                  v-if="item.type != 'radio'"
                  class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
                >
                  <label
                    for="title"
                    class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >{{ item.title }}</label
                  >
                  <input
                    v-model.trim.lazy="item.value"
                    :type="item.type"
                    :name="item.key"
                    :placeholder="item.placeholder"
                    autocomplete="off"
                    class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                  />
                  <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <ExclamationCircleIcon
                      v-if="item.value.length < 3"
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
                <RadioGroup
                  v-else-if="item.values && item.values.length > 0"
                  v-model="item.value"
                  :disabled="
                    item.values.filter((v) => v.type == 'package').length > 0
                  "
                  class="mt-4"
                >
                  <RadioGroupLabel class="text-md font-semibold text-gray-600">
                    {{ item.title }}
                  </RadioGroupLabel>
                  <RadioGroupOption
                    as="template"
                    v-for="(i, timeIdx) in item.values"
                    :key="i.key"
                    :value="i.value"
                    v-slot="{ checked, active }"
                    class="cursor-pointer focus:outline-none"
                  >
                    <div
                      v-if="i.type == 'radio'"
                      class="flex flex-wrap justify-between grid-cols-2 gap-4 lg:grid sm:grid-cols-3 lg:grid-cols-3"
                    >
                      <div
                        :class="[
                          timeIdx === 0 ? 'rounded-md' : '',
                          timeIdx === item.values.length - 1
                            ? 'rounded-md'
                            : '',
                          checked || i.key === item.value
                            ? 'border-[#24b47e]'
                            : 'border-gray-200',
                          'mt-2 flex items-center',
                        ]"
                      >
                        <span
                          :class="[
                            checked
                              ? 'bg-[#24b47e] border-transparent'
                              : 'bg-white border-gray-300',
                            active ? '' : '',
                            'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center',
                          ]"
                          aria-hidden="true"
                        >
                          <span class="rounded-full bg-white w-1.5 h-1.5" />
                        </span>
                        <RadioGroupLabel
                          as="p"
                          :class="[
                            checked ? '' : 'text-gray-900',
                            'text-sm text-black ml-3 ltr:ml-2 rtl:mr-2',
                          ]"
                          >{{ i.title }}</RadioGroupLabel
                        >
                      </div>
                    </div>
                    <div v-else-if="i.type == 'package'">
                      <div
                        class="mx-auto mt-4 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-4 lg:mx-0 lg:flex lg:max-w-none"
                      >
                        <div class="p-8 sm:p-10 lg:flex-auto">
                          <h3
                            class="text-2xl font-bold tracking-tight text-gray-900"
                          >
                            {{ i.title }}
                          </h3>
                          <p class="mt-6 text-base leading-7 text-gray-600">
                            {{ i.data.description }}
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
                            class="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                          >
                            <li
                              v-for="item in i.data.features"
                              :key="item.id"
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
                              {{ item.title }}
                            </li>
                          </ul>
                        </div>
                        <div
                          class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0"
                        >
                          <div
                            class="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16"
                          >
                            <div class="mx-auto max-w-xs px-8">
                              <p class="text-base font-semibold text-gray-600">
                                {{ i.data.subTitle }}
                              </p>
                              <p
                                class="mt-6 flex items-baseline justify-center gap-x-2"
                              >
                                <span
                                  class="text-5xl font-bold tracking-tight text-gray-900"
                                  >{{ i.data.price }}</span
                                >
                                <span
                                  class="text-sm font-semibold leading-6 tracking-wide text-gray-600"
                                  >{{ site.currency }}</span
                                >
                              </p>
                              <button
                                :disabled="item.value == i.value"
                                @click="addToCartPackage(i)"
                                class="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                {{
                                  item.value == i.value
                                    ? "Already purchased"
                                    : "Get access"
                                }}
                              </button>
                              <p class="mt-6 text-xs leading-5 text-gray-600">
                                Invoices and receipts available for easy company
                                reimbursement
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroupOption>
                </RadioGroup>
              </div>

              <div class="pt-5">
                <div class="flex justify-end">
                  <button
                    @click="update()"
                    type="submit"
                    class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "User",
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
// import { useCartStore } from "@/stores/cart";
// import { useMeStore } from "@/stores/me";
import { useCustomerStore } from "@/stores/customer";
import {
  PhoneIcon,
  MapPinIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";
const SideBar = defineAsyncComponent(() =>
  import("@/components/user/SideBar.vue")
);
const { site } = storeToRefs(useSiteStore());
// const { addToCart, setToCart, removeFromCart, removeCart } = useCartStore();
// const { me } = storeToRefs(useMeStore());
const { customerId } = storeToRefs(useCustomerStore());

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
  let c = result.value?.storeCustomer ?? null;
  if (c) {
    note.value = JSON.stringify(c.note) != "{}" ? cloneDeep(c.note) : [];
  }
  return c;
});

// const update = async () => {
//   const { mutate, loading, error } = useMutation(SELF_STORE_CUSTOMER_UPDATE, {
//     variables: {
//       userId: me.value.id,
//       customerId: customer.value.id,
//       note: note.value,
//     },
//   });
//   try {
//     const response = await mutate();
//     if (response.data.selfStoreCustomerUpdateByCustomer) {
//       addNotification(
//         { title: "Users info", subTitle: "Successfully updated new data." },
//         "success"
//       );
//       onCanceled();
//     }
//   } catch (error) {
//     addNotification({ title: "Users info", subTitle: error.message }, "error");
//   }
// };
// const addToCartPackage = (product) => {
//   var item = {
//     affiliateCommission: 0.0,
//     cashback: 0.0,
//     comparePrice: 0.0,
//     currency: site.value.currency,
//     deliveryCharge: 0.0,
//     emiPrice: 0.0,
//     emiDuration: 0,
//     emiInterest: 0,
//     hid: "6",
//     id: 1,
//     isContinueSelling: true,
//     isEmi: false,
//     maxOrder: 1,
//     maxResellPrice: 0.0,
//     minOrder: 1,
//     price: product.data.price,
//     quantity: 1,
//     resellPrice: product.data.price,
//     rewardPoints: 0.0,
//     sku: "",
//     slug: "",
//     thumbnail: "",
//     title: product.title,
//     translation: product.title,
//     unit: 1,
//     unitType: 1,
//     variant: [],
//     variants: [],
//     vat: 0.0,
//     weight: 1,
//   };
//   addToCart(cloneDeep(item));
// };

// const openback = () => {
//   paymentWindow.location.href = "http://localhost:5123/checkout";
// };
</script>

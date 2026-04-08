<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-[99]" @close="cancel()">
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
        class="fixed inset-0 z-[999] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300"
      >
        <div
          class="flex z-[999] min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
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
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6"
            >
              <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-offset-2"
                  @click="cancel()"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div class="">
                <div v-for="item in note" :key="item.title">
                  <RadioGroup
                    v-if="item.values && item.values.length > 0"
                    v-model="item.value"
                    :disabled="
                      item.values.filter((v) => v.type == 'package').length > 0
                    "
                    class="mt-4"
                  >
                    <RadioGroupLabel
                      v-if="item.values.filter((v) => v.type == 'package') > 0"
                      class="text-md font-semibold text-gray-600"
                    >
                      {{ item.title }}
                    </RadioGroupLabel>
                    <RadioGroupOption
                      as="template"
                      v-for="(i, timeIdx) in item.values.filter(
                        (v) => v.type == 'package'
                      )"
                      :key="i.key"
                      :value="i.value"
                      v-slot="{ checked, active }"
                      class="cursor-pointer focus:outline-none"
                    >
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
                    </RadioGroupOption>
                  </RadioGroup>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref } from "vue";
import { cloneDeep } from "lodash";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  XMarkIcon,
} from "@heroicons/vue/24/outline";
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
const { addToCart } = useCartStore();
const props = defineProps({
  note: {
    type: Object,
    required: true,
  },
});
const addToCartPackage = (product) => {
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
    price: product.data.price,
    productType: 6,
    quantity: 1,
    resellPrice: product.data.price,
    rewardPoints: 0.0,
    sku: "",
    slug: "",
    thumbnail: site.value.favicon,
    title: product.title,
    translation: product.title,
    unit: 1,
    unitType: 1,
    variant: [],
    variants: [],
    vat: 0.0,
    weight: 1,
  };
  addToCart(cloneDeep(item));
  router.push(`/checkout/`);
};
const open = ref(true);
const emit = defineEmits(["confirmed", "canceled"]);
const cancel = () => {
  emit("canceled");
  open.value = true;
};
</script>

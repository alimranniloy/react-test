<template>
  <div v-if="vouchers.length"
    @click="open = true"
    class="bg-white border px-4 py-3 mb-4 rounded-lg sticky top-[7rem]"
  >
    <div class="flex align-items-center justify-between">
      <p class="text-base">Coupon and offers</p>
      <p>
        <span class="text-base">{{ vouchers.length }} offers</span>
      </p>
    </div>
    <div
      v-if="vouchers.length > 0"
      class="-mt-0 flex justify-between items-center"
    >
      <p class="text-gray-500 text-sm">
        Save
        {{
          formatMoney(
            vouchers[0].voucherType == 1
              ? vouchers[0].discount
              : vouchers[0].voucherType == 2
              ? (vouchers[0].discount * total) / 100
              : 0,
            site.currency
          )
        }}
        with {{ vouchers[0].code }}
      </p>
    </div>
  </div>
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
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-full sm:w-full sm:max-w-lg sm:p-6"
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
              <div class="mt-6">
                <div class="relative rounded-md shadow-sm mb-2">
                  <input
                    v-model="coupon"
                    :placeholder="'Enter a coupon'"
                    type="text"
                    name="coupon"
                    id="cost"
                    class="block w-full rounded-md border py-3 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0.00"
                    aria-describedby="cost-currency"
                  />
                  <div
                    @click="apply(coupon)"
                    class="absolute inset-y-0 right-3 flex items-center"
                  >
                    <span
                      class="text-[#17B31B] font-bold sm:text-sm"
                      id="cost-currency"
                      >Apply</span
                    >
                  </div>
                </div>
                <p class="text-base mb-4 border-b-4 pb-1 pt-4 border-blue-400">
                  Coupon and offers
                </p>
                <div
                  v-for="voucher in vouchers"
                  :key="voucher.id"
                  class="flex align-items-center justify-between mb-4"
                >
                  <div class="w-full">
                    <div class="flex">
                      <div class="relative mb-2">
                        <div
                          class="bg-white w-4 h-4 rounded-full absolute -left-2.5 top-2.5"
                        ></div>
                        <div
                          class="bg-white w-4 h-4 rounded-full absolute -right-2.5 top-2.5"
                        ></div>
                        <div
                          class="border-2 border-yellow-200 bg-yellow-200 px-4 py-1 rounded text-md font-semibold text-gray-700"
                        >
                          {{ voucher.code }}
                        </div>
                      </div>
                    </div>
                    <p class="text-[14px] text-[#17B31B] mt-0">
                      You will save
                      {{
                        formatMoney(
                          voucher.voucherType == 1
                            ? voucher.discount
                            : voucher.voucherType == 2
                            ? (voucher.discount * total) / 100
                            : 0,
                          site.currency
                        )
                      }}
                      with this coupon
                    </p>
                    <p
                      class="text-[12px] text-gray-500 py-2"
                      v-html="voucher.description"
                    ></p>
                  </div>
                  <div
                    @click="apply(voucher.code)"
                    class="text-base text-[#17B31B]"
                  >
                    Apply
                  </div>
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
import { SELF_STORE_VOUCHER_CHECK_BY_CODE } from "@/gql/voucher";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { computed, ref, onMounted } from "vue";
import { useCartStore } from "@/stores/cart";
import { useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { useVoucherStore } from "@/stores/voucher";
import { storeToRefs } from "pinia";
import { useNotificationsStore } from "@/stores/notifications";
const open = ref(false);
const { cart, cartCustomer } = storeToRefs(useCartStore());
const { addNotification } = useNotificationsStore();
const router = useRouter();
const { me } = storeToRefs(useMeStore());
const { site } = storeToRefs(useSiteStore());
const { vouchers } = storeToRefs(useVoucherStore());
const { getVouchers } = useVoucherStore();
const coupon = ref("");
const voucher = ref(null);
const apply = (code) => {
  if (me.value) {
    const { onResult } = useQuery(SELF_STORE_VOUCHER_CHECK_BY_CODE, {
      siteId: site.value.id,
      userId: me.value.id,
      code: code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
      quantity: 1,
      total: total.value,
      delivery: 0.0,
      products: cart.value.map((a) => {
        return { id: a.id, price: a.price };
      }),
    });
    onResult((queryResult) => {
      voucher.value = queryResult.data.selfStoreVoucherCheckByCode;
      if (voucher.value.message.includes("successfully")) {
        cartCustomer.value.discount = voucher.value.discount;
        cartCustomer.value.discountName = code;

        open.value = false;
        addNotification(
          { title: "Order info", subTitle: voucher.value.message },
          "success"
        );
      } else {
        addNotification(
          { title: "Order info", subTitle: voucher.value.message },
          "error"
        );
      }
    });
  } else {
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
};
const total = computed(() => {
  return cart.value.reduce((total, obj) => total + obj.price * obj.qnt, 0);
});
const cancel = () => {
  open.value = false;
};
onMounted(() => {
  getVouchers(site.value.id);
});
</script>

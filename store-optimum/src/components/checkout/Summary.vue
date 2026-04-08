<template>
  <div
    v-if="router.currentRoute.value.name == 'Checkout' || isNative == false"
    class="bg-white border p-4 rounded-lg sticky top-[7rem] mb-5 md:mb-0"
  >
    <div
      v-if="isCaptured || paymentErrorMessage.length > 0"
      class="p-4 rounded-md border mb-4"
      :class="isCaptured ? 'bg-green-50' : 'bg-red-50'"
    >
      <div v-if="isCaptured">
        <p class="text-base">Payment received</p>
        <p class="text-gray-500 text-sm">Order will be placed shortly</p>
      </div>
      <div v-else>
        <p class="text-base">Payment NOT received</p>
        <p class="text-gray-500 text-sm">{{ paymentErrorMessage }}</p>
      </div>
    </div>
    <!-- মোট পণ্য -->
    <div class="border-b pb-3">
      <div class="flex align-items-center justify-between">
        <p class="text-base">{{ $t("checkout.total") }}</p>
        <p>
          <span
            v-if="totalComparePrice > subTotal"
            class="line-through text-gray-500 mr-3"
            >{{
              site.isPublic ||
              ![1, 2, 5, 6].includes(
                cart.length > 0 ? cart[0].productType : true
              ) ||
              (customer && customer.isActive)
                ? formatMoney(totalComparePrice, site.currency)
                : "***"
            }}</span
          >
          <span class="text-base">{{
            site.isPublic ||
            ![1, 2, 5, 6].includes(
              cart.length > 0 ? cart[0].productType : true
            ) ||
            (customer && customer.isActive)
              ? formatMoney(subTotal, site.currency)
              : "***"
          }}</span>
        </p>
      </div>
      <div
        v-if="
          typeof cartCustomer.customLogisticsExtraCharge == 'number' &&
          step > 1 &&
          [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
        "
        class="flex align-items-center justify-between mt-3"
      >
        <del class="text-base">{{ $t("checkout.deliveryFee") }}</del>
        <del class="text-[#17B31B]">
          {{
            site.isPublic ||
            ![1, 2, 5, 6].includes(
              cart.length > 0 ? cart[0].productType : true
            ) ||
            (customer && customer.isActive)
              ? formatMoney(
                  cart.length > 0
                    ? cart[0].productType == 7
                      ? 0.0
                      : cartCustomer.logisticsIsFree
                      ? 0.0
                      : cartCustomer.logisticsCharge
                    : cartCustomer.logisticsIsFree
                    ? 0.0
                    : cartCustomer.logisticsCharge,
                  site.currency
                )
              : "***"
          }}
        </del>
      </div>

      <!-- logistics charge -->
      <div
        v-else-if="
          step > 1 &&
          [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
        "
        class="flex align-items-center justify-between mt-3"
      >
        <p class="text-base">{{ $t("checkout.deliveryFee") }}</p>
        <p class="text-[#17B31B]">
          {{
            site.isPublic ||
            ![1, 2, 5, 6].includes(
              cart.length > 0 ? cart[0].productType : true
            ) ||
            (customer && customer.isActive)
              ? formatMoney(
                  cart.length > 0
                    ? cart[0].productType == 7
                      ? 0.0
                      : cartCustomer.logisticsIsFree
                      ? 0.0
                      : cartCustomer.logisticsCharge
                    : cartCustomer.logisticsIsFree
                    ? 0.0
                    : cartCustomer.logisticsCharge,
                  site.currency
                )
              : "***"
          }}
        </p>
      </div>
      <div
        v-if="
          cartCustomer.logisticsText.length > 0 &&
          step > 1 &&
          [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
        "
        class="mt-1 flex justify-between items-center"
      >
        <p class="text-gray-500 text-sm">
          {{ $t("checkout.deliveryCompany") }}
        </p>
        <p class="text-gray-500 text-sm">{{ cartCustomer.logisticsText }}</p>
      </div>
      <div
        v-if="
          cartCustomer.deliveryTime &&
          step > 1 &&
          [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
        "
        class="mt-1 flex justify-between items-center"
      >
        <p class="text-gray-500 text-sm">
          {{ $t("checkout.deliveryTime") }}
        </p>
        <p class="text-gray-500 text-sm">
          {{ dayjs(cartCustomer.deliveryTime).format("h:mm A MMM D") }}
        </p>
      </div>
    </div>

    <div v-if="cartCustomer.discount > 0" class="border-b pb-3 mt-3">
      <div class="flex align-items-center justify-between">
        <p class="text-base">{{ $t("checkout.discount") }}</p>
        <p>
          <span class="text-base">{{
            formatMoney(cartCustomer.discount, site.currency)
          }}</span>
        </p>
      </div>
      <p class="text-gray-500 text-sm">
        {{ $t("checkout.discountName") }}: {{ cartCustomer.discountName }}
      </p>
    </div>
    <div v-if="step > 2" class="border-b pb-3 mt-3">
      <div class="flex align-items-center justify-between">
        <p class="text-base">{{ $t("checkout.grandTotal") }}</p>
        <p>
          <span
            v-if="totalComparePrice > subTotal"
            class="line-through text-gray-500 mr-3"
            >{{
              site.isPublic ||
              ![1, 2, 5, 6].includes(
                cart.length > 0 ? cart[0].productType : true
              ) ||
              (customer && customer.isActive)
                ? formatMoney(
                    totalComparePrice +
                      (cart.length > 0
                        ? cart[0].productType == 7
                          ? 0.0
                          : cartCustomer.logisticsIsFree
                          ? 0.0
                          : cartCustomer.logisticsCharge
                        : cartCustomer.logisticsIsFree
                        ? 0.0
                        : cartCustomer.logisticsCharge) -
                      cartCustomer.discount,
                    site.currency
                  )
                : "***"
            }}</span
          >
          <span class="text-base">{{
            site.isPublic ||
            ![1, 2, 5, 6].includes(
              cart.length > 0 ? cart[0].productType : true
            ) ||
            (customer && customer.isActive)
              ? formatMoney(
                  subTotal +
                    (cart.length > 0
                      ? cart[0].productType == 7
                        ? 0.0
                        : cartCustomer.logisticsIsFree
                        ? 0.0
                        : cartCustomer.logisticsCharge
                      : cartCustomer.logisticsIsFree
                      ? 0.0
                      : cartCustomer.logisticsCharge) -
                    cartCustomer.discount,
                  site.currency
                )
              : "***"
          }}</span>
        </p>
      </div>
      <p class="text-gray-500 text-sm">
        {{ $t("checkout.inclusiveTaxes") }}
      </p>
    </div>
    <div class="pb-3">
      <!-- এভারেজ ডেলিভারি টাইম: --- -->
      <!-- <div
        v-if="
          step > 1 &&
          [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
        "
        class="flex align-items-center justify-between"
      >
        <p class="text-gray-500 text-sm">
          {{ $t("checkout.averageDeliveryTime") }}:
          <span class="text-black">---</span>
        </p>
      </div> -->
      <button
        v-if="totalComparePrice - subTotal > 0 && subResell < subTotal"
        class="bg-green-100 w-full p-3 rounded text-sm text-[#17B31B] mt-2"
      >
        {{
          site.isPublic ||
          ![1, 2, 5, 6].includes(
            cart.length > 0 ? cart[0].productType : true
          ) ||
          (customer && customer.isActive)
            ? formatMoney(totalComparePrice - subTotal, site.currency)
            : "***"
        }}
        {{ $t("checkout.savedSoFar") }}
      </button>

      <div v-if="subResell > subTotal" class="rounded p-4 mt-4 bg-green-50">
        <div class="flex align-items-center justify-between">
          <p class="text-base">{{ $t("checkout.resell") }}</p>
        </div>
        <div class="flex items-center align-items-center justify-between">
          <p class="text-gray-500 text-sm">
            {{ $t("checkout.total") }}
          </p>
          <p>
            <span class="text-md">{{
              site.isPublic ||
              ![1, 2, 5, 6].includes(
                cart.length > 0 ? cart[0].productType : true
              ) ||
              (customer && customer.isActive)
                ? formatMoney(subResell - cartCustomer.discount, site.currency)
                : "***"
            }}</span>
          </p>
        </div>
        <div
          v-if="
            typeof cartCustomer.customLogisticsExtraCharge == 'number' &&
            step > 1 &&
            [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
          "
          class="flex items-center align-items-center justify-between"
        >
          <del class="text-gray-500 text-sm">
            {{ $t("checkout.ourDeliveryCharge") }}
          </del>
          <p>
            <del class="text-gray-500 text-sm">{{
              site.isPublic ||
              ![1, 2, 5, 6].includes(
                cart.length > 0 ? cart[0].productType : true
              ) ||
              (customer && customer.isActive)
                ? formatMoney(
                    (cart.length > 0
                      ? cart[0].productType == 7
                        ? 0.0
                        : cartCustomer.logisticsIsFree
                        ? 0.0
                        : cartCustomer.logisticsCharge
                      : cartCustomer.logisticsIsFree
                      ? 0.0
                      : cartCustomer.logisticsCharge) +
                      cartCustomer.logisticsExtraCharge,
                    site.currency
                  )
                : "***"
            }}</del>
          </p>
        </div>
        <div
          v-else-if="
            step > 1 &&
            [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
          "
          class="flex items-center align-items-center justify-between"
        >
          <p class="text-gray-500 text-sm">
            {{ $t("checkout.ourDeliveryCharge") }}
          </p>
          <p>
            <span class="text-gray-500 text-sm">{{
              site.isPublic ||
              ![1, 2, 5, 6].includes(
                cart.length > 0 ? cart[0].productType : true
              ) ||
              (customer && customer.isActive)
                ? formatMoney(
                    (cart.length > 0
                      ? cart[0].productType == 7
                        ? 0.0
                        : cartCustomer.logisticsIsFree
                        ? 0.0
                        : cartCustomer.logisticsCharge
                      : cartCustomer.logisticsIsFree
                      ? 0.0
                      : cartCustomer.logisticsCharge) +
                      cartCustomer.logisticsExtraCharge,
                    site.currency
                  )
                : "***"
            }}</span>
          </p>
        </div>
        <div
          v-if="
            typeof cartCustomer.customLogisticsExtraCharge == 'number' &&
            step > 1
          "
          class="flex items-center align-items-center justify-between"
        >
          <p class="text-gray-500 text-sm">
            {{ $t("checkout.yourDeliveryCharge") }}
          </p>
          <p>
            <span class="text-gray-500 text-sm">{{
              site.isPublic ||
              ![1, 2, 5, 6].includes(
                cart.length > 0 ? cart[0].productType : true
              ) ||
              (customer && customer.isActive)
                ? formatMoney(
                    typeof cartCustomer.customLogisticsExtraCharge == "number"
                      ? cartCustomer.customLogisticsExtraCharge
                      : 0,
                    site.currency
                  )
                : "***"
            }}</span>
          </p>
        </div>
        <div
          v-if="step > 1"
          class="flex items-center align-items-center justify-between"
        >
          <p class="text-gray-500 text-sm">
            {{ $t("checkout.resellerAdvanceCollected") }}
          </p>
          <p>
            <span class="text-gray-500 text-sm">{{
              site.isPublic ||
              ![1, 2, 5, 6].includes(
                cart.length > 0 ? cart[0].productType : true
              ) ||
              (customer && customer.isActive)
                ? formatMoney(
                    typeof cartCustomer.resellerAdvanceCollect == "number"
                      ? cartCustomer.resellerAdvanceCollect
                      : 0,
                    site.currency
                  )
                : "***"
            }}</span>
          </p>
        </div>
        <div class="border-b mt-3 mb-3"></div>
        <div
          v-if="step > 2"
          class="flex items-center align-items-center justify-between"
        >
          <p class="text-gray-500 text-sm">
            {{ $t("checkout.grandTotal") }}
          </p>
          <p>
            <span class="text-md">{{
              site.isPublic ||
              ![1, 2, 5, 6].includes(
                cart.length > 0 ? cart[0].productType : true
              ) ||
              (customer && customer.isActive)
                ? formatMoney(
                    subResell +
                      (cart.length > 0
                        ? cart[0].productType == 7
                          ? 0.0
                          : cartCustomer.logisticsIsFree
                          ? 0.0
                          : cartCustomer.logisticsCharge
                        : cartCustomer.logisticsIsFree
                        ? 0.0
                        : cartCustomer.logisticsCharge) +
                      totalLogisticsExtraCharge -
                      cartCustomer.resellerAdvanceCollect,
                    site.currency
                  )
                : "***"
            }}</span>
          </p>
        </div>
        <button
          class="bg-green-100 w-full p-3 rounded text-sm text-[#17B31B] mt-2"
        >
          {{
            site.isPublic ||
            ![1, 2, 5, 6].includes(
              cart.length > 0 ? cart[0].productType : true
            ) ||
            (customer && customer.isActive)
              ? formatMoney(
                  subResell -
                    subTotal +
                    totalLogisticsExtraCharge -
                    cartCustomer.discount,
                  site.currency
                )
              : "***"
          }}
          {{ $t("checkout.profitSoFar") }}
        </button>
      </div>
    </div>

    <!-- buttons -->
    <div
      v-if="cart.reduce((total, obj) => total + obj.qnt, 0) > 0"
      class="flex w-full gap-2"
    >
      <button
        v-show="step != 1"
        @click="toggleBack()"
        class="bg-gray-300 w-full text-center py-3 px-4 rounded-l-md mt-4"
      >
        {{ $t("checkout.back") }}
      </button>
      <button
        v-if="step == 3"
        @click="confirm()"
        class="bg-[--primary] text-white w-full text-center py-3 px-4 mt-4 disabled:bg-gray-100 disabled:text-gray-400"
        :class="step > 1 ? 'rounded-r-md' : 'rounded-md'"
        :disabled="isFinal == false ? true : false"
      >
        {{ $t("checkout.confirm") }}
      </button>
      <button
        v-else
        @click="toggleNext()"
        class="bg-[--primary] text-white w-full text-center py-3 px-4 mt-4"
        :class="step > 1 ? 'rounded-r-md' : 'rounded-md'"
      >
        {{ $t("checkout.continue") }}
      </button>
    </div>

    <!-- confirmation agreement -->
    <div class="py-3" v-if="step == 3">
      <input
        v-model="isFinal"
        id="lowest"
        name="amountType"
        value="lowest"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
      />
      <label for="lowest" class="font-medium text-gray-900 text-sm">
        <span>I agree to</span>
        <router-link to="/page/terms-conditions/" class="text-blue-400">
          Terms & Conditions </router-link
        >,
        <router-link to="/page/return-refund-policy/" class="text-blue-400">
          Refund & Return Policy
        </router-link>
        <span>and</span>
        <router-link to="/page/privacy-policy/" class="text-blue-400">
          Privacy Policy
        </router-link>
        <span>of {{ site.title }}.</span>
        <span> | developed by </span>
        <a href="https://optimumsoft.dev" target="_blank" class="text-red-400">
          Bponi
        </a>
      </label>
    </div>
  </div>
  <div
    v-else-if="router.currentRoute.value.name == 'Quotation'"
    class="flex w-full gap-2"
  >
    <button
      @click="confirm()"
      class="bg-[--primary] text-white p-3 rounded text-sm w-full hover:opacity-90 transition-all whitespace-nowrap disabled:bg-gray-100 disabled:text-gray-400"
      :disabled="isFinal == false ? true : false"
    >
      {{ $t("checkout.confirm") }}
    </button>
  </div>
  <!-- ====== summary and action buttons for mobile ====== -->
  <!-- <div
    class="md:hidden flex items-center justify-between pt-4 w-full bottom-0 bg-white sm:hidden z-10"
    :class="isNative ? 'sticky right-0 left-0 pb-16 border-t' : ''"
  >
    <div class="w-full" v-if="total > 0">
      <h3 v-if="step < 3" class="text-base">
        {{
          site.isPublic ||
          ![1, 2, 5, 6].includes(
            cart.length > 0 ? cart[0].productType : true
          ) ||
          (customer && customer.isActive)
            ? formatMoney(
                cart.reduce((total, obj) => total + obj.price * obj.qnt, 0),
                site.currency
              )
            : "***"
        }}
      </h3>
      <h3 v-else class="text-base">
        {{
          site.isPublic ||
          ![1, 2, 5, 6].includes(
            cart.length > 0 ? cart[0].productType : true
          ) ||
          (customer && customer.isActive)
            ? formatMoney(
                subTotal +
                  (cart.length > 0
                    ? cart[0].productType == 7
                      ? 0.0
                      : cartCustomer.logisticsIsFree
                      ? 0.0
                      : cartCustomer.logisticsCharge
                    : cartCustomer.logisticsIsFree
                    ? 0.0
                    : cartCustomer.logisticsCharge) -
                  cartCustomer.discount,
                site.currency
              )
            : "***"
        }}
      </h3>
      <p class="rounded text-sm text-[#17B31B] mt-0">প্রাইসিং ডিটেইল</p>
    </div>

    <div
      v-if="
        cart.reduce((total, obj) => total + obj.qnt, 0) > 0 &&
        (router.currentRoute.value.name == 'Checkout' || isNative == false) &&
        cart.filter((v) => v.title.length > 0).length
      "
      class="flex w-full gap-2"
    >
      <button
        v-show="step != 1"
        @click="toggleBack()"
        class="bg-gray-200 p-3 rounded text-sm w-full hover:bg-gray-300 transition-all whitespace-nowrap"
      >
        {{ $t("checkout.back") }}
      </button>
      <button
        v-if="step == 3"
        @click="confirm()"
        class="bg-[--primary] text-white p-3 rounded text-sm w-full hover:opacity-90 transition-all whitespace-nowrap disabled:bg-gray-100 disabled:text-gray-400"
        :disabled="isFinal == false ? true : false"
      >
        {{ $t("checkout.confirm") }}
      </button>
      <button
        v-else
        @click="toggleNext()"
        class="bg-[--primary] text-white p-3 rounded text-sm w-full hover:opacity-90 transition-all whitespace-nowrap"
      >
        {{ $t("checkout.continue") }}
      </button>
    </div>
    <div
      v-else-if="router.currentRoute.value.name == 'Quotation'"
      class="flex w-full gap-2"
    >
      <button
        @click="confirm()"
        class="bg-[--primary] text-white p-3 rounded text-sm w-full hover:opacity-90 transition-all whitespace-nowrap disabled:bg-gray-100 disabled:text-gray-400"
        :disabled="isFinal == false ? true : false"
      >
        {{ $t("checkout.confirm") }}
      </button>
    </div>
  </div> -->
</template>
<script setup>
import analytics from "@/analytics";
import {
  SELF_STORE_ORDER_CREATE_BY_CUSTOMER,
  SELF_STORE_ORDER_CREATE_BY_GUEST,
  STORE_ORDER_PAYMENT_REQUEST,
} from "@/gql/order";
import { PAY_TRANSACTION_DETAILS_PUBLIC } from "@/gql/pay";
import { v4 as uuidv4 } from "uuid";
import { computed, ref, onMounted } from "vue";
import { useCheckoutStore } from "@/stores/checkout";
import { useCartStore } from "@/stores/cart";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { useCustomerStore } from "@/stores/customer";
import { useLogisticsStore } from "@/stores/logistics";
import { storeToRefs } from "pinia";
import { useNotificationsStore } from "@/stores/notifications";
import dayjs from "dayjs";
const { cart, cartCustomer, selectedGateway } = storeToRefs(useCartStore());
const { addNotification } = useNotificationsStore();
const router = useRouter();
const { me } = storeToRefs(useMeStore());
const { site, isMobile, referCode } = storeToRefs(useSiteStore());
const { step, taxId } = storeToRefs(useCheckoutStore());
const { setStep, setOrderId } = useCheckoutStore();
const { stoppages } = storeToRefs(useLogisticsStore());
const { resetCart } = useCartStore();
const { setLoading } = useSiteStore();
const { customer } = storeToRefs(useCustomerStore());
const isFinal = ref(true);
const referenceId = ref(uuidv4());
const isCaptured = ref(false);
const paymentErrorMessage = ref("");
const getDomainFromUrl = (url) => {
  var parser = new URL(url);
  return parser.hostname + (parser.port ? ":" + parser.port : "");
};
const domain = ref(getDomainFromUrl(window.location.href));
const toggleNext = () => {
  if (step.value < 3) {
    if (step.value == 1 && router.currentRoute.value.name == "Quotation") {
      if (cartCustomer.value.productTitle == "") {
        addNotification(
          { title: "Cart info", subTitle: "Enter details note." },
          "error"
        );
        return true;
      } else if (cartCustomer.value.productImage == null) {
        addNotification(
          { title: "Cart info", subTitle: "Select image." },
          "error"
        );
        return true;
      }
    }
    if (step.value == 2) {
      if (cartCustomer.value.name == "") {
        addNotification(
          { title: "Cart info", subTitle: "Enter customer name." },
          "error"
        );
        return true;
      } else if (cartCustomer.value.phone == null) {
        addNotification(
          { title: "Cart info", subTitle: "Enter customer phone." },
          "error"
        );
        return true;
      } else if (
        stoppages.value.filter((a) => a.stoppageType == 4).length > 0 &&
        cartCustomer.value.logisticsStoppageId == null
      ) {
        addNotification(
          { title: "Cart info", subTitle: "Select area." },
          "error"
        );
        return true;
      } else if (cartCustomer.value.address == "") {
        addNotification(
          { title: "Cart info", subTitle: "Enter customer address." },
          "error"
        );
        return true;
      } else if (
        cartCustomer.value.logisticsText == "" &&
        cart.value.length > 0 &&
        [1, 2, 5, 6].includes(cart.value[0].productType)
      ) {
        addNotification(
          { title: "Cart info", subTitle: "Select logistics." },
          "error"
        );
        return true;
      }
    }
    window.scrollTo(0, 0);
    setStep(step.value + 1);
  } else {
    window.scrollTo(0, 0);
    setStep(1);
  }
};
const toggleBack = () => {
  if (step.value > 1) {
    window.scrollTo(0, 0);
    setStep(step.value - 1);
  }
};
const props = defineProps({
  isNative: {
    type: Boolean,
    default: true,
  },
});
const paid = ref(0.0);
const totalComparePrice = computed(() => {
  return cart.value.reduce(
    (total, obj) => total + obj.comparePrice * obj.qnt,
    0
  );
});
const subResell = computed(() => {
  return cart.value.reduce(
    (total, obj) => total + obj.resellPrice * obj.qnt,
    0
  );
});
const subTotal = computed(() => {
  return cart.value.reduce((total, obj) => total + obj.price * obj.qnt, 0);
});

const total = computed(() => {
  return (
    subTotal.value +
    (cart.value.length > 0
      ? cart.value[0].productType == 7
        ? 0.0
        : cartCustomer.value.logisticsIsFree
        ? 0.0
        : cartCustomer.value.logisticsCharge
      : cartCustomer.value.logisticsIsFree
      ? 0.0
      : cartCustomer.value.logisticsCharge) +
    cartCustomer.value.logisticsExtraCharge -
    cartCustomer.value.discount
  );
});
const resell = computed(() => {
  return (
    subResell.value +
    (cart.value.length > 0
      ? cart.value[0].productType == 7
        ? 0.0
        : cartCustomer.value.logisticsIsFree
        ? 0.0
        : cartCustomer.value.logisticsCharge
      : cartCustomer.value.logisticsIsFree
      ? 0.0
      : cartCustomer.value.logisticsCharge) +
    cartCustomer.value.logisticsExtraCharge -
    cartCustomer.value.discount
  );
});
const totalLogisticsExtraCharge = computed(() => {
  if (typeof cartCustomer.value.customLogisticsExtraCharge == "number") {
    return (
      cartCustomer.value.customLogisticsExtraCharge -
      (cart.value.length > 0
        ? cart.value[0].productType == 7
          ? 0.0
          : cartCustomer.value.logisticsIsFree
          ? 0.0
          : cartCustomer.value.logisticsCharge
        : cartCustomer.value.logisticsIsFree
        ? 0.0
        : cartCustomer.value.logisticsCharge)
    );
  } else {
    return 0.0;
  }
});

const cartProduct = computed(() => {
  let products = [];
  for (let product of cart.value) {
    if (product.title.length > 0) {
      let item = {
        id: product.id,
        price: parseFloat(product.isEmi ? product.emiPrice : product.price)
          ? parseFloat(product.isEmi ? product.emiPrice : product.price)
          : 0.0,
        quantity: parseInt(product.qnt) ? parseInt(product.qnt) : 0,
        resellPrice: parseFloat(product.resellPrice)
          ? parseFloat(product.resellPrice)
          : 0.0,
        thumbnail: product.thumbnail,
        title: product.title,
        variant: product.variant.map((el) => el.title).join(" - "),
        variantId: product.variant[0] ? product.variant[0].id : null,
        vat: parseFloat(product.vat) ? parseFloat(product.vat) : 0.0,
      };
      products.push(item);
    }
  }
  return products;
});

const totalAffiliateCommission = computed(() => {
  let total = 0;
  for (let product of cart.value) {
    total +=
      product.qnt * ((product.price * product.affiliateCommission) / 100);
  }
  return total;
});
const totalCashback = computed(() => {
  let total = 0;
  for (let product of cart.value) {
    total += product.qnt * ((product.price * product.cashback) / 100);
  }
  return total;
});

const confirm = async () => {
  if (
    selectedGateway.value &&
    selectedGateway.value.gatewayType == 4 &&
    (router.currentRoute.value.name == "Checkout" || props.isNative == false)
  ) {
    payWithThirdParty();
  } else {
    makeOrder();
  }
};

const makeOrder = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(
    me.value
      ? SELF_STORE_ORDER_CREATE_BY_CUSTOMER
      : SELF_STORE_ORDER_CREATE_BY_GUEST,
    {
      variables: {
        userId: me.value ? me.value.id : null,
        siteId: site.value.id,
        address:
          cartCustomer.value.formattedAddress.length > 0
            ? cartCustomer.value.formattedAddress
            : cartCustomer.value.address,
        affiliateCommission: totalAffiliateCommission.value,
        browser: analytics({
          siteId: site.value.id,
        }).user().anonymousId,
        cashbackBalance: totalCashback.value,
        charge: 0.0,
        cost: 0.0,
        currency: site.value.currency,
        customerAddress: cartCustomer.value.address,
        customerId: customer.value && customer.value.id ? customer.value.id : 0,
        customerName: cartCustomer.value.name,
        customerNote: cartCustomer.value.note,
        customerPhone: parseInt(cartCustomer.value.phone),
        deliveryTime: cartCustomer.value.deliveryTime,
        discount: cartCustomer.value.discount,
        discountName: cartCustomer.value.discountName,
        emiDuration: 0.0,
        emiInterest: 0.0,
        gatewayText: cartCustomer.value.gatewayText,
        grossAmount: 0.0,
        image: cartCustomer.value.productImage,
        isEmi: false,
        isRenew: false,
        latitude: cartCustomer.value.latitude,
        logisticsCharge:
          cart.value.length > 0
            ? cart.value[0].productType == 7
              ? 0.0
              : cartCustomer.value.logisticsIsFree
              ? 0.0
              : cartCustomer.value.logisticsCharge
            : cartCustomer.value.logisticsIsFree
            ? 0.0
            : cartCustomer.value.logisticsCharge,
        logisticsExtraCharge:
          subResell.value > subTotal.value
            ? parseFloat(totalLogisticsExtraCharge.value)
              ? parseFloat(totalLogisticsExtraCharge.value)
              : 0.0
            : cartCustomer.value.logisticsExtraCharge,
        logisticsId: cartCustomer.value.logisticsId
          ? cartCustomer.value.logisticsId
          : 1,
        logisticsStoppageId: cartCustomer.value.logisticsStoppageId,
        logisticsText: cartCustomer.value.logisticsText,
        longitude: cartCustomer.value.longitude,
        netAmount: 0.0,
        otp: Math.floor(Math.random() * (2000000000 + 1)),
        paid: paid.value,
        parentId: null,
        parentSiteId: null,
        productId: cartProduct.value[0].id,
        products: cartProduct.value,
        profit: 0.0,
        referCode:
          referCode.value && referCode.value != "c"
            ? referCode.value
            : me.value && me.value.referedCode
            ? me.value.referedCode
            : "6",
        resellAmount: 0.0,
        resellerAdvanceCollect: cartCustomer.value.resellerAdvanceCollect,
        resellerCommission: 0.0,
        rewardPoints: 0.0,
        shopId: null,
        source: domain.value,
        staffId: null,
        subscription: null,
        subscriptionFee: null,
        total: 0.0,
        validTill: null,
        vat: 0.0,
        vatAmount: 0.0,
        weight: 0.0,
      },
    }
  );
  try {
    const response = await mutate();
    if (
      response.data.selfStoreOrderCreateByGuest ||
      response.data.selfStoreOrderCreateByCustomer
    ) {
      if (subResell.value > subTotal.value) {
        cartCustomer.value.address = "";
        cartCustomer.value.deliveryTime = null;
        cartCustomer.value.discount = 0;
        cartCustomer.value.discountName = "";
        cartCustomer.value.formattedAddress = "";
        cartCustomer.value.gatewayText = "";
        cartCustomer.value.latitude = 0.0;
        cartCustomer.value.logisticsIsFree
          ? 0.0
          : (cartCustomer.value.logisticsCharge = 0.0);
        cartCustomer.value.logisticsExtraCharge = 0.0;
        cartCustomer.value.customLogisticsExtraCharge = "";
        cartCustomer.value.logisticsText = "";
        cartCustomer.value.resellerAdvanceCollect = 0.0;
        cartCustomer.value.longitude = 0.0;
        cartCustomer.value.name = "";
        cartCustomer.value.note = "";
        cartCustomer.value.phone = null;
        cartCustomer.value.productPrice = 0.0;
        cartCustomer.value.productTitle = "";
        cartCustomer.value.productImage = null;
      } else {
        cartCustomer.value.address = "";
        cartCustomer.value.deliveryTime = null;
        cartCustomer.value.discount = 0;
        cartCustomer.value.discountName = "";
        cartCustomer.value.gatewayText = "";
        cartCustomer.value.logisticsIsFree
          ? 0.0
          : (cartCustomer.value.logisticsCharge = 0.0);
        cartCustomer.value.logisticsExtraCharge = 0.0;
        cartCustomer.value.customLogisticsExtraCharge = "";
        cartCustomer.value.logisticsText = "";
        cartCustomer.value.resellerAdvanceCollect = 0.0;
        cartCustomer.value.name = "";
        cartCustomer.value.note = "";
        cartCustomer.value.phone = null;
        cartCustomer.value.productPrice = 0.0;
        cartCustomer.value.productTitle = "";
        cartCustomer.value.productImage = null;
      }
      addNotification(
        { title: "Order info", subTitle: "Successfully updated new data." },
        "success"
      );
      referenceId.value = uuidv4();
      taxId.value = null;
      setStep(1);
      setLoading(false);
      resetCart();
      if (me.value) {
        let order = response.data.selfStoreOrderCreateByCustomer;
        setOrderId(order.id);
        toAnalatic(order);
        router.push(`/checkout/success/`);
      } else {
        let order = response.data.selfStoreOrderCreateByGuest;
        setOrderId(order.id);
        toAnalatic(order);
        router.push(`/checkout/success/`);
      }
    }
  } catch (error) {
    addNotification({ title: "Order info", subTitle: error.message }, "error");
    setLoading(false);
  }
};
const payWithThirdParty = async () => {
  setLoading(true);
  let totalAmount = 0.0;
  if (selectedGateway.value.note == "delivery") {
    totalAmount =
      (cart.value.length > 0
        ? cart.value[0].productType == 7
          ? 0.0
          : cartCustomer.value.logisticsIsFree
          ? 0.0
          : cartCustomer.value.logisticsCharge
        : cartCustomer.value.logisticsIsFree
        ? 0.0
        : cartCustomer.value.logisticsCharge) +
      cartCustomer.value.logisticsExtraCharge;
  } else {
    totalAmount = total.value > resell.value ? total.value : resell.value;
  }

  const { mutate, loading, error } = useMutation(STORE_ORDER_PAYMENT_REQUEST, {
    variables: {
      siteId: site.value.id,
      gatewayId: selectedGateway.value.id,
      amount: totalAmount,
      callBack: `https://${domain.value}/checkout/`,
      cancelUrl: `https://${domain.value}/checkout/`,
      currency: site.value.currency,
      customerAddress: cartCustomer.value.address,
      customerEmail: " ",
      customerName: cartCustomer.value.name,
      customerPhone: cartCustomer.value.phone.toString(),
      emiDuration: 0,
      emiInterest: 0,
      failUrl: `https://${domain.value}/checkout/`,
      isCardTransaction: true,
      isCodPayment: false,
      isEmi: true,
      merchantId: 1,
      message: "init",
      optionA: "option A",
      optionB: "option B",
      optionC: "option C",
      optionD: "option D",
      optionE: "option E",
      otherUrl: `https://${domain.value}/checkout/`,
      payeeSource: selectedGateway.value.title,
      paymentId: referenceId.value,
      productInfo: "Product Name",
      referenceId: referenceId.value,
      shipAddress: cartCustomer.value.address,
      showRefundButton: true,
      successUrl: `https://${domain.value}/checkout/`,
      transactionSource: domain.value,
      transactionType: 1,
    },
  });
  try {
    const response = await mutate();
    setLoading(false);
    if (response.data.storeOrderPaymentRequest) {
      taxId.value = response.data.storeOrderPaymentRequest.transactionId;
      window.location.replace(response.data.storeOrderPaymentRequest.callBack);
    }
  } catch (error) {
    addNotification({ title: "Order info", subTitle: error.message }, "error");
    setLoading(false);
  }
};
const toAnalatic = (order) => {
  // facebook pixel track Purchase
  if (window.fbq) {
    let products = [];
    for (let i of order.lines) {
      var j = {
        id: i.productHid,
        quantity: i.quantity,
        item_price: i.price,
      };
      products.push(j);
    }
    window.fbq("track", "Purchase", {
      value: order.total,
      currency: order.currency,
      content_ids: products.map((el) => el.id),
      content_type: "product",
      contents: products,
      order_id: order.orderId,
      payment_method: "Cash",
      delivery_category: "home_delivery",
    });
  }
  // end facebook pixel track Purchase
  // google analytics track Purchase
  if (window.gtag) {
    let products = [];
    for (let i of order.lines) {
      var j = {
        item_id: i.productHid,
        item_name: i.productName,
        quantity: i.quantity,
        price: i.price,
      };
      products.push(j);
    }
    gtag("event", "purchase", {
      transaction_id: order.orderId,
      value: order.total,
      tax: 0.0,
      shipping: 0.0,
      currency: order.currency,
      coupon: "",
      items: products,
    });
  }
  // end google analytics track Purchase
  // google analytics track Purchase
  if (window.dataLayer) {
    let products = [];
    for (let i of order.lines) {
      var j = {
        item_id: i.productHid,
        item_name: i.productName,
        quantity: i.quantity,
        price: i.price,
      };
      products.push(j);
    }

    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: order.orderId,
        value: order.total,
        tax: 0.0,
        shipping: 0.0,
        currency: order.currency,
        coupon: "",
        items: products,
      },
      customer: {
        name: cartCustomer.value.name ? cartCustomer.value.name : null,
        phone: cartCustomer.value.phone ? cartCustomer.value.phone : null,
        address: cartCustomer.value.address ? cartCustomer.value.address : null,
      },
    });
  }
  // end google analytics track Purchase
};
onMounted(() => {
  setTimeout(() => {
    const status = router.currentRoute.value.query.status;
    if (status && status == "success" && taxId.value) {
      step.value = 3;
      const { onResult } = useQuery(PAY_TRANSACTION_DETAILS_PUBLIC, {
        transactionId: taxId.value,
      });
      onResult((queryResult) => {
        const tax = queryResult.data.payTransactionByTransactionIdPublic;
        if (tax.isCaptured) {
          isCaptured.value = tax.isCaptured;
          paymentErrorMessage.value = "";
          paid.value = tax.amount;
          makeOrder();
        } else {
          isCaptured.value = false;
          console.log(tax);
          paymentErrorMessage.value = tax.message;
        }
      });
    } else if (status && status == "error") {
      step.value = 3;
      isCaptured.value = false;
      paymentErrorMessage.value = "Someting error happend, contact with us.";
    }
  }, 1000);
});
</script>

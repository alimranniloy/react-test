<template>
  <div>
    <h3 class="text-base mb-3">{{ $t("checkout.pay") }}</h3>
    <!-- <button class="" @click="payWithThirdParty">Pay</button> -->
    <RadioGroup v-model="selectedGateway">
      <RadioGroupLabel class="sr-only">
        {{ $t("checkout.pay") }}
      </RadioGroupLabel>
      <div class="space-y-3 sm:space-y-5 rounded-md">
        <RadioGroupOption
          as="template"
          v-show="
            (gateway.gatewayType == 4 && gateway.note == 'full') ||
            [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
          "
          v-for="(gateway, gatewayIdx) in gateways"
          :key="gateway.title"
          :value="gateway"
          v-slot="{ checked, active }"
        >
          <div
            :class="[
              checked || (selectedGateway && selectedGateway.id == gateway.id)
                ? 'bg-[#23b47e1a] border-[#24b47e]'
                : 'border-gray-200',
              'relative rounded-md border p-2 md:p-3 flex items-center cursor-pointer focus:outline-none',
            ]"
          >
            <span
              :class="[
                checked || (selectedGateway && selectedGateway.id == gateway.id)
                  ? 'bg-[#24b47e] border-transparent'
                  : 'bg-white border',
                active ? '' : '',
                'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center',
              ]"
              aria-hidden="true"
            >
              <span class="rounded-full bg-white w-1.5 h-1.5" />
            </span>
            <div class="ml-3 flex justify-between w-full">
              <div class="flex flex-col justify-center">
                <RadioGroupLabel
                  as="span"
                  :class="[
                    checked ? '' : 'text-gray-900',
                    'block text-sm font-medium',
                  ]"
                  >{{ gateway.title }}</RadioGroupLabel
                >
                <RadioGroupDescription
                  as="p"
                  :class="[checked ? '' : 'text-gray-500', 'block text-xs']"
                  >{{ gateway.description
                  }}<span>
                    <!-- {{ $t("checkout.paymentFee") }} {{ gateway.fee }}% - -->
                    {{ $t("checkout.paymentFee") }}:
                    {{
                      site.isPublic ||
                      ![1, 2, 5, 6].includes(
                        cart.length > 0 ? cart[0].productType : true
                      ) ||
                      (customer && customer.isActive)
                        ? formatMoney(
                            gateway.note == "delivery" &&
                              gateway.gatewayType == 4
                              ? cartCustomer.logisticsCharge
                              : total,
                            site.currency
                          )
                        : "***"
                    }}</span
                  >
                </RadioGroupDescription>
              </div>
              <img
                v-lazy="gateway.logo"
                class="w-16 max-h-9 md:max-h-12 rounded-md"
              />
            </div>
          </div>
        </RadioGroupOption>
      </div>
    </RadioGroup>
  </div>
</template>
<script setup>
import { computed, watch, onMounted } from "vue";
import { useSiteStore } from "@/stores/site";
import { useCartStore } from "@/stores/cart";
import { useGatewayStore } from "@/stores/gateway";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from "@headlessui/vue";
const { cart, cartCustomer, selectedGateway } = storeToRefs(useCartStore());
const { setGateway } = useCartStore();
const { site } = storeToRefs(useSiteStore());
const { gateways } = storeToRefs(useGatewayStore());
const { getGateways } = useGatewayStore();
const { customer } = storeToRefs(useCustomerStore());
watch(selectedGateway, () => {
  cartCustomer.value.gatewayText = selectedGateway.value.title;
  if (selectedGateway.value.isFreeLogistics) {
    cartCustomer.value.logisticsIsFree = true;
  } else {
    cartCustomer.value.logisticsIsFree = false;
  }
});
const grand = computed(() => {
  return cart.value.reduce((total, obj) => total + obj.price * obj.qnt, 0);
});
const resell = computed(() => {
  return cart.value.reduce(
    (total, obj) => total + obj.resellPrice * obj.qnt,
    0
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
  let total =
    subResell.value > subTotal.total ||
    (customer.value && customer.value.isActive && customer.value.isReseller)
      ? resell.value
      : grand.value;

  return (
    total +
    (cart.value.length > 0
      ? cart.value[0].productType == 7
        ? 0.0
        : cartCustomer.value.logisticsIsFree
        ? 0.0
        : cartCustomer.value.logisticsCharge
      : cartCustomer.value.logisticsIsFree
      ? 0.0
      : cartCustomer.value.logisticsCharge) +
    totalLogisticsExtraCharge.value -
    cartCustomer.value.resellerAdvanceCollect
  );
});
watch(gateways, (newValue) => {
  if (selectedGateway.value == null && newValue.length > 0) {
    setGateway(newValue[0]);
    cartCustomer.value.gatewayText = selectedGateway.value.title;
  }
});
const toAnalytics = () => {
  // facebook pixel track AddToCart
  if (window.fbq) {
    window.fbq("track", "begin_checkout", {});
  }
  // end facebook pixel track AddToCart
  // google analytics track add_to_cart
  if (window.gtag) {
    gtag("event", "begin_checkout", {});
  }
  // end google analytics track add_to_cart
  // google analytics track view_item
  if (window.dataLayer) {
    let products = [];
    for (let i of cart.value) {
      var j = {
        item_id: i.hid,
        item_name: i.title,
        quantity: i.qnt,
        price: i.price,
        sku: i.sku,
      };
      products.push(j);
    }
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: "begin_checkout",
      user_data: {
        name: cartCustomer.value.name,
        phone: cartCustomer.value.phone,
        address: cartCustomer.value.address,
        customer_id:
          customer.value && customer.value.id ? customer.value.id : 0,
      },
      ecommerce: {
        value: total.value,
        tax: 0.0,
        shipping: 0.0,
        currency: site.value.currency,
        coupon: "",
        items: products,
      },
    });
  }
  // end google analytics track view_item
};
onMounted(() => {
  if (gateways.value.length == 0) {
    getGateways(site.value.id);
  }
});
</script>

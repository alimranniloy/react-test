<template>
  <main
    :class="
      isNative
        ? 'max-w-5xl mx-auto sm:px-4 pb-[50px] pt-12 sm:pt-16 md:pt-0 md:min-h-[60vh] bg-white'
        : ''
    "
  >
    <div class="flex justify-between p-4">
      <h3 class="sm:text-[20px] w-3/5">
        শপিং ব্যাগ ({{ cart.reduce((total, obj) => total + obj.qnt, 0) }}
        আইটেম)
      </h3>
      <h3 class="sm:text-[20px] w-2/5 text-right">
        {{ $t("checkout.total") }}
        {{
          formatMoney(
            cart.reduce((total, obj) => total + obj.price * obj.qnt, 0),
            "BDT"
          )
        }}
      </h3>
    </div>
    <div
      class="flex flex-col lg:flex-row gap-6 md:gap-10 rounded-xl"
      :class="isNative ? 'bg-white px-4 md:p-5 sm:rounded-2xl' : ''"
    >
      <div class="lg:w-3/5">
        <div v-show="step == 1">
          <Products />
        </div>
        <div v-show="step == 2">
          <Address />
        </div>
        <div v-if="step == 3">
          <Payment />
        </div>
      </div>
      <div class="lg:w-2/5 sticky">
        <div v-show="step == 3">
          <Coupon />
        </div>
        <Summary :isNative="isNative" />
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "Checkout",
};
</script>
<script setup>
import Summary from "@/components/checkout/Summary.vue";
import Address from "@/components/checkout/Address.vue";
import Payment from "@/components/checkout/Payment.vue";
import Products from "@/components/checkout/Products.vue";
import Coupon from "@/components/checkout/Coupon.vue";
import { onMounted } from "vue";
import { useCheckoutStore } from "@/stores/checkout";
import { useCartStore } from "@/stores/cart";
import { useSiteStore } from "@/stores/site";
import { useRouter } from "vue-router";
import { useMeStore } from "@/stores/me";
import { storeToRefs } from "pinia";
const { step } = storeToRefs(useCheckoutStore());
const { cart } = storeToRefs(useCartStore());
const { site } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const router = useRouter();

const props = defineProps({
  isNative: {
    type: Boolean,
    default: true,
  },
});

const toAnalytics = () => {
  // facebook pixel track AddToCart
  if (window.fbq) {
    window.fbq("track", "begin_checkout", {});
  }
  // end facebook pixel track AddToCart
  // google analytics track add_to_cart

  // if (window.gtag) {
  //   gtag("event", "begin_checkout", {});
  // }

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
      ecommerce: {
        value: cart.value.reduce(
          (total, obj) => total + obj.price * obj.qnt,
          0
        ),
        tax: 0.0,
        shipping: cartCustomer.value.logisticsCharge,
        currency: site.value.currency,
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
  // end google analytics track view_item
};
onMounted(() => {
  step.value = 1;
  if (site.value.siteInfo == "reseller" && me.value == null) {
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
  toAnalytics();
});
</script>

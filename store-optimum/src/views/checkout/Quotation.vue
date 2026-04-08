<template>
  <main class="max-w-screen-2xl mx-auto sm:px-4 pb-[50px] pt-[50px]">
    <div class="my-5 pb-40">
      <div class="flex justify-between px-4 sm:px-5">
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
        class="bg-white px-4 sm:p-5 sm:rounded-2xl flex flex-col lg:flex-row gap-10"
      >
        <div class="lg:w-3/5">
          <div v-show="step == 1 || step == 2 || step == 3">
            <Quotation />
            <Address />
          </div>
        </div>
        <div class="lg:w-2/5 sticky">
          <Summary />
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "Quotation",
};
</script>
<script setup>
import Summary from "@/components/checkout/Summary.vue";
import Address from "@/components/checkout/Address.vue";
import Quotation from "@/components/checkout/Quotation.vue";
import { onMounted } from "vue";
import { useCheckoutStore } from "@/stores/checkout";
import { useCartStore } from "@/stores/cart";
import { useSiteStore } from "@/stores/site";
import { useRouter } from "vue-router";
import { useMeStore } from "@/stores/me";
import { storeToRefs } from "pinia";
const { step } = storeToRefs(useCheckoutStore());
const { cart, cartCustomer } = storeToRefs(useCartStore());
const { site } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const router = useRouter();
onMounted(() => {
  if (site.value.siteInfo == "reseller" && me.value == null) {
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  } else if (
    site.value.siteInfo == "reseller" &&
    me.value &&
    me.value.phone == cartCustomer.value.phone
  ) {
    cartCustomer.value.address = "";
    cartCustomer.value.formattedAddress = "";
    cartCustomer.value.phone = null;
    cartCustomer.value.name = "";
  }
});
</script>

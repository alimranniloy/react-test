<template>
  <main class="max-w-screen-2xl mx-auto sm:px-4 pb-[50px] pt-[50px] sm:pt-0">
    <div
      class="bg-white pb-40 sm:pt-10"
    >
      <div
        class="flex w-full flex-col rounded-lg lg:min-h-[70vh] lg:flex-row lg:shadow-card xl:min-h-[830px]"
      >
        <SideBar />
        <main
          class="flex w-full flex-grow flex-col lg:flex-grow-0 lg:bg-light lg:py-8 lg:px-12 lg:dark:bg-dark-250 mb-12"
        >
          <OrderInvoice />
        </main>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "UserOrderInvoice",
};
</script>
<script setup>
import { defineAsyncComponent } from "vue";
const OrderInvoice = defineAsyncComponent(() =>
  import("@/components/user/OrderInvoice.vue")
);
const SideBar = defineAsyncComponent(() =>
  import("@/components/user/SideBar.vue")
);
</script>

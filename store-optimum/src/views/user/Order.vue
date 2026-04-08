<template>
  <main class="max-w-screen-2xl mx-auto sm:px-4 pb-[50px] pt-12 md:pt-0">
    <div class="bg-white pb-40 lg:pt-8 sm:rounded-xl sm:mt-4">
      <div
        class="flex w-full flex-col gap-5 lg:min-h-[70vh] lg:flex-row lg:shadow-card xl:min-h-[830px]"
      >
        <SideBar />
        <div
          class="flex w-full flex-grow flex-col lg:flex-grow-0 lg:bg-light px-4 lg:p-5 lg:dark:bg-dark-250 overflow-auto"
        >
          <OrderList />
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "UserOrder",
};
</script>
<script setup>
import { defineAsyncComponent } from "vue";
const OrderList = defineAsyncComponent(() =>
  import("@/components/user/OrderList.vue")
);
const SideBar = defineAsyncComponent(() =>
  import("@/components/user/SideBar.vue")
);
</script>

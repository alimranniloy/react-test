<template>
  <main class="max-w-screen-2xl mx-auto sm:px-4 pb-[50px] pt-12 md:pt-0">
    <div class="bg-white pb-40 lg:pt-8 sm:rounded-xl sm:mt-4">
      <div class="flex w-full flex-col gap-5 lg:min-h-[70vh] lg:flex-row lg:shadow-card xl:min-h-[830px]">
        <SideBar />
        <div v-if="customer"
          class="flex w-full flex-grow flex-col lg:flex-grow-0 lg:bg-light px-4 lg:p-5 lg:dark:bg-dark-250 overflow-auto">
          <div class="flex align-center space-between w-full mb-8">
            <div class="sm:flex-auto w-full">
              <h1 class="text-xl font-semibold text-gray-900">Setting</h1>
              <p class="mt-2 text-sm text-gray-700">
                Manage payments: receiveable, received, processing in your
                Reseller Dashboard.
              </p>
            </div>
          </div>
          <fieldset class="mb-0 grid gap-5 sm:grid-cols-3">
            <div class="relative rounded-md border border-gray-300 px-3 py-3 w-full">
              <label for="title"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900">Shop
                Name</label>
              <input v-model.lazy.trim="customer.title" placeholder="Enter your shop name" type="text" name="title"
                id="title"
                class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0" />
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon v-if="customer.title.length == 0" class="h-5 w-5 text-gray-400"
                  aria-hidden="true" />
                <CheckCircleIcon v-else class="h-5 w-5 text-gray-400 hidden" aria-hidden="true" />
              </div>
            </div>
            <div class="relative rounded-md border border-gray-300 px-3 py-3 w-full">
              <label for="paymentTitle"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900">Payment
                Title</label>
              <input v-model.lazy.trim="customer.paymentTitle" placeholder="Enter payment title" type="text"
                name="paymentTitle" id="paymentTitle"
                class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0" />
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon v-if="customer.paymentTitle.length == 0" class="h-5 w-5 text-gray-400"
                  aria-hidden="true" />
                <CheckCircleIcon v-else class="h-5 w-5 text-gray-400 hidden" aria-hidden="true" />
              </div>
            </div>
            <div class="relative rounded-md border border-gray-300 px-3 py-3 w-full">
              <label for="paymentNo"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900">Payment
                NO.</label>
              <input v-model.lazy.trim="customer.paymentNo" placeholder="Enter payment no" type="text" name="paymentNo"
                id="paymentNo"
                class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0" />
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon v-if="customer.paymentNo.length == 0" class="h-5 w-5 text-gray-400"
                  aria-hidden="true" />
                <CheckCircleIcon v-else class="h-5 w-5 text-gray-400 hidden" aria-hidden="true" />
              </div>
            </div>
            <div class="relative rounded-md border border-gray-300 px-3 py-3 w-full">
              <label for="paymentNo"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900">Refer
                Code</label>
              <input v-model.lazy.trim="customer.referCode" placeholder="Enter refer code" type="text" name="paymentNo"
                id="paymentNo"
                class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0" />
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon v-if="customer.paymentNo.length == 0" class="h-5 w-5 text-gray-400"
                  aria-hidden="true" />
                <CheckCircleIcon v-else class="h-5 w-5 text-gray-400 hidden" aria-hidden="true" />
              </div>
            </div>
          </fieldset>
          <div class="pt-5">
            <div class="flex justify-end">
              <button @click="update()" type="submit"
                class="bg-[--primary] text-white py-3 px-6 text-sm font-medium rounded-md shadow-sm">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "Setting",
};
</script>
<script setup>
import { cloneDeep } from "lodash";
import { computed, defineAsyncComponent } from "vue";
import {
  STORE_CUSTOMER_DETAILS,
  SELF_STORE_CUSTOMER_UPDATE,
} from "@/gql/customer";
import { useNotificationsStore } from "@/stores/notifications";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useMeStore } from "@/stores/me";
import { useCustomerStore } from "@/stores/customer";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
const { addNotification } = useNotificationsStore();
const SideBar = defineAsyncComponent(() =>
  import("@/components/user/SideBar.vue")
);
const { me } = storeToRefs(useMeStore());
const { customerId } = storeToRefs(useCustomerStore());

const { result } = useQuery(STORE_CUSTOMER_DETAILS, {
  id: customerId.value,
});
const customer = computed(() => cloneDeep(result.value?.storeCustomer) ?? null);
const update = async () => {
  const { mutate } = useMutation(SELF_STORE_CUSTOMER_UPDATE, {
    variables: {
      userId: me.value.id,
      customerId: customer.value.id,
      title: customer.value.title,
      paymentNo: customer.value.paymentNo,
      paymentTitle: customer.value.paymentTitle,
      referCode: customer.value.referCode,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfStoreCustomerUpdateByCustomer) {
      addNotification(
        { title: "Users info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
  } catch (error) {
    addNotification({ title: "Users info", subTitle: error.message }, "error");
  }
};
</script>

<template>
  <main class="max-w-screen-2xl mx-auto sm:px-4 pb-[50px] pt-[50px] sm:pt-0">
    <div
      class="bg-white pb-40 sm:pt-10"
    >
      <div
        class="flex w-full flex-col rounded-lg lg:min-h-[70vh] lg:flex-row lg:shadow-card xl:min-h-[630px]"
      >
        <SideBar />
        <main
          class="flex w-full flex-grow flex-col lg:flex-grow-0 lg:bg-light lg:py-8 lg:px-12 lg:dark:bg-dark-250"
        >
          <div class="flex justify-between">
            <span class="md:flex items-center text-sm"
              >status:
              <div class="bg-[--primary] text-white px-3 py-1 rounded-2xl ml-4">
                Not connected
              </div></span
            >
            <span class="md:flex items-center text-sm"
              >status:
              <div class="bg-[--primary] text-white px-3 py-1 rounded-2xl ml-4">
                Not connected
              </div></span
            >
          </div>
          <dl
              class="mt-5 grid grid-cols-2 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-4 md:divide-y-0 md:divide-x"
            >
              <div class="px-2 py-4 sm:p-4">
                <dt class="text-base font-normal text-gray-900">Name:</dt>
                <dd
                  class="mt-1 flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                  >
                  Bponi Demo
                  </div>
                </dd>
              </div>
              <div class="px-2 py-4 sm:p-4">
                <dt class="text-base font-normal text-gray-900">Payble:</dt>
                <dd
                  class="mt-1 flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                  >
                  ₹ 0
                  </div>
                </dd>
              </div>
              <div class="px-2 py-4 sm:p-4">
                <dt class="text-base font-normal text-gray-900">
                  Processing:
                </dt>
                <dd
                  class="mt-1 flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                  >
                    ₹0.00
                  </div>
                </dd>
              </div>
              <div class="px-2 py-4 sm:p-4">
                <dt class="text-base font-normal text-gray-900">
                  total:
                </dt>
                <dd
                  class="mt-1 flex items-baseline justify-between md:block lg:flex"
                >
                  <div
                    class="flex items-baseline text-0.5xl md:text-1xl font-semibold text-indigo-600"
                  >
                    ₹0.00
                  </div>
                </dd>
              </div>
            </dl>
          <p class="mt-5">Change connection</p>
          <div class="md:flex gap-3 mt-10">
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 mt-2 w-full"
            >
              <label
                for="name"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                >Connection Pricing</label
              >
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Bank/Msf account number"
                class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
              />
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <ExclamationCircleIcon
                  class="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
                <CheckCircleIcon
                  class="h-5 w-5 text-green-500 hidden"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div
              class="relative rounded-md px-3 py-3 mt-8 w-full"
            >
              <label
                for="name"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                >Connection Type</label
              >
              <div class="flex items-center gap-3">
                <input
                type="checkbox"
                name="name"
                id="name"
                placeholder="Bank/Msf account number"
                class="border p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
              />
              <span>to fixed</span>
              </div>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <ExclamationCircleIcon
                  class="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
                <CheckCircleIcon
                  class="h-5 w-5 text-green-500 hidden"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <div class="mt-5 flex justify-end">
            <button
              class="px-3 py-2 rounded bg-[--primary] text-white cursor-pointer hover:bg-yellow-400"
            >
              Save Change
            </button>
          </div>
        </main>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "UserStore",
};
</script>
<script setup>
import { defineAsyncComponent } from "vue";
const SideBar = defineAsyncComponent(() =>
  import("@/components/user/SideBar.vue")
);
</script>

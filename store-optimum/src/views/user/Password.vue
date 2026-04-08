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
          <div class="flex align-center space-between w-full">
            <div class="sm:flex-auto w-full">
              
      <h2 class="text-xl font-semibold text-gray-900">Password</h2>
      <p class="mt-2 text-sm text-gray-700">
        Manage Your Password Settings Here
      </p>
            </div>
          </div>
            <fieldset
              class="mb-6 mt-6 grid gap-5 pb-5 sm:grid-cols-2 md:pb-9 lg:mb-8"
            >
              <div
                class="relative rounded-md border border-gray-300 px-3 py-3 mt-2 w-full"
              >
                <label
                  for="password"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                  >Current password</label
                >
                <input
                  placeholder="Enter your current password"
                  type="password"
                  name="password"
                  id="password"
                  class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
                />
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <EyeIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <EyeSlashIcon
                    class="h-5 w-5 text-gray-400 hidden"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div
                class="relative rounded-md border border-gray-300 px-3 py-3 mt-2 w-full"
              >
                <label
                  for="newPassword"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                  >New password</label
                >
                <input
                  placeholder="Enter your password"
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
                />
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <EyeIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <EyeSlashIcon
                    class="h-5 w-5 text-gray-400 hidden"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div
                class="relative rounded-md border border-gray-300 px-3 py-3 mt-2 w-full"
              >
                <label
                  for="newPassword"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
                  >Confirm password</label
                >
                <input
                  placeholder="Enter your password again"
                  type="text"
                  name="newPassword"
                  id="newPassword"
                  class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
                />
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <EyeIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <EyeSlashIcon
                    class="h-5 w-5 text-gray-400 hidden"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </fieldset>
            <div class="flex items-center gap-4 pb-3">
              <button
                class="transition-fill-colors flex items-center justify-center gap-2 font-semibold duration-200 pointer-events-auto cursor-pointer opacity-100  rounded-md py-3 px-4 md:px-6 bg-transparent border border-light-500 dark:border-dark-600 text-dark dark:text-light hover:bg-gray-100 focus:bg-light-500 dark:focus:bg-dark-600 flex-1 lg:flex-none"
                type="reset"
              >
                Cancel</button
              ><button
                class="transition-fill-colors flex items-center justify-center gap-2 font-semibold duration-200 pointer-events-auto cursor-pointer opacity-100  rounded-md py-3 px-4 md:px-6 bg-[--primary] text-white focus:bg-brand-dark flex-1 lg:flex-none"
                type="submit"
              >
                Save change
              </button>
            </div>
          </div>
        </div>
      </div>
  </main>
</template>
<script>
export default {
  name: "UserPassword",
};
</script>
<script setup>
import { defineAsyncComponent } from "vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
const SideBar = defineAsyncComponent(() =>
  import("@/components/user/SideBar.vue")
);
</script>

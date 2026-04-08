
<template>
  <main class="mx-auto my-auto px-4 pb-[60px] pt-0 py-5">
    <div class="space-y-8">
      <div>
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          Need proper permissions
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          You don't have permission to access this page.
        </p>
      </div>
      <div class="pt-5">
        <div class="flex justify-end">
          <button
            @click="logOut()"
            type="button"
            class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2"
          >
            Log out
          </button>
          <button
            @click="refresh()"
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 ml-4"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useNotificationsStore } from "@/stores/notifications";
const { logOut } = useMeStore();
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { site } = storeToRefs(useSiteStore());
const refresh = () => {
  getStaffByUser(me.value.id, site.value.id);
  addNotification(
    { title: "Permission info", subTitle: "Successfully updated new data." },
    "success"
  );
};
</script>

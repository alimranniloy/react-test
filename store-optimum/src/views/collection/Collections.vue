<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div v-if="collections" class="max-w-screen-2xl mx-auto sm:px-4 flex pb-5">
      <div class="flex gap-5 w-full relative">
        <div
          class="w-full md:overflow-hidden md:mt-4 bg-white sm:rounded-xl min-h-[calc(100vh-94px)] md:min-h-[calc(100vh-99px)] lg:min-h-[calc(100vh-136px)]"
        >
          <div class="p-4 lg:p-10 md:rounded-xl">
            <!-- collections -->
            <h2 class="text-xl md:text-3xl font-bold mb-5 text-center">
              All Offers
            </h2>
            <div
              v-if="collections.length"
              class="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <router-link
                v-for="item in collections"
                :key="'collection_' + item.name"
                :to="`/collection/${item.slug}/${item.hid}/`"
                ><img
                  class="w-full h-full max-h-[150px] md:max-h-[250px] rounded border border-gray-100"
                  v-lazy="item.image"
                  alt=""
              /></router-link>
            </div>
            <div v-else class="flex justify-center items-center h-[300px]">
              <h2
                class="text-xl md:text-3xl font-semibold text-center text-gray-400"
              >
                No Offer Available
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex space-x-2 justify-center items-center bg-white h-[60vh]"
    >
      <div
        class="h-4 w-4 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"
      ></div>
      <div
        class="h-4 w-4 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"
      ></div>
      <div class="h-4 w-4 bg-gray-300 rounded-full animate-bounce"></div>
    </div>
  </main>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCollectionStore } from "@/stores/storeCollection";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const { site } = storeToRefs(useSiteStore());
const { collections } = storeToRefs(useCollectionStore());
const { getCollections } = useCollectionStore();
if (collections.value.length == 0) {
  getCollections(
    [
      site.value.id,
      ...site.value.parent
        .filter((item) => item.isActive)
        .map((item) => item.id),
    ],
    site.value.parent.filter((item) => item.isActive).length > 0
      ? site.value.id
      : null
  );
}
</script>

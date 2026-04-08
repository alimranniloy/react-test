<template>
  <div
    v-if="shops.edges && shops.edges.length > 0"
    class="py-4 px-4 md:rounded-xl relative bg-green-100"
  >
    <div id="firework-1" class="firework">
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
    </div>
    <div id="firework-2" class="firework">
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
      <div class="explosion"></div>
    </div>
    <div class="flex justify-between">
      <div></div>
      <div class="pb-4 text-center font-bold text-gray-800">Shop</div>
      <router-link
        :to="`/shops`"
        class="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-semibold"
      >
        <span>All</span>
        <ArrowRightIcon class="h-4 w-4"></ArrowRightIcon
      ></router-link>
    </div>
    <Flicking
      :key="'1'"
      class="md:block"
      :options="{
        align: 'prev',
        circular: true,
        circularFallback: 'bound',
        panelsPerView: isMobile ? 3 : 5,
      }"
    >
      <router-link
        class="w-full"
        :to="`/shop/${shop.node.slug}/${shop.node.hid}/`"
        v-for="shop in shops.edges"
        :key="'shop_' + shop.node.id"
      >
        <div
          :style="`background: linear-gradient(45deg, rgba(0, 0, 0, 0.365), transparent), url('${shop.node.logo}'); background-repeat: no-repeat; background-size: cover;`"
          class="bg-cover bg-center rounded-xl h-36 relative w-full mr-4"
        >
          <div class="absolute right-0 bottom-0">
            <div
              class="text-base font-bold px-3 py-2 rounded-tl-xl rounded-bl-xl bg-[#00000099] text-white flex"
            >
              <div class="mr-2"></div>
              <div class="text-xs">{{ shop.node.title }}</div>
            </div>
          </div>
        </div>
      </router-link>
    </Flicking>
  </div>
</template>
<script setup>
// import { getDistance } from "geolib";
import { ArrowRightIcon } from "@heroicons/vue/24/outline";
import { computed, ref, defineAsyncComponent } from "vue";
import { STORE_SHOPS } from "@/gql/shop";
import { useQuery } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
// import { useMeStore } from "@/stores/me";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const Flicking = defineAsyncComponent(() => import("@egjs/vue3-flicking"));
const { site, isMobile } = storeToRefs(useSiteStore());
// const { me } = storeToRefs(useMeStore());
const first = ref([1].includes(site.value.industry) ? 10 : 12);
const after = ref(null);
// query
const { result, fetchMore, loading, error, refetch } = useQuery(STORE_SHOPS, {
  siteId: site.value.id,
  isActive: true,
  first: first.value,
  after: after.value,
});
const shops = computed(() => result.value?.storeShops ?? { edges: [] });
// const loadMore = () => {
//   fetchMore({
//     variables: {
//       first: first.value,
//       after: shops.value.pageInfo.endCursor,
//     },
//     updateQuery: (previousResult, { fetchMoreResult }) => {
//       const previousEdges = previousResult.storeShops.edges;
//       const newEdges = fetchMoreResult.storeShops.edges;
//       const pageInfo = fetchMoreResult.storeShops.pageInfo;
//       return newEdges.length
//         ? {
//             storeShops: {
//               __typename: previousResult.storeShops.__typename,
//               edges: [...previousEdges, ...newEdges],
//               pageInfo,
//             },
//           }
//         : previousResult;
//     },
//   });
// };
// const getDistanceInMinutes = (
//   latitude,
//   longitude,
//   lowestSpeed,
//   heighestSpeed
// ) => {
//   let pointA = {
//     latitude: me.value ? me.value.latitude : 0.0,
//     longitude: me.value ? me.value.longitude : 0.0,
//   };
//   let pointB = { latitude: latitude, longitude: longitude };
//   let distanceInMeters = getDistance(pointA, pointB);
//   let lowestTimeInMinutes = distanceInMeters / (1000 / lowestSpeed);
//   let heighestTimeInMinutes = distanceInMeters / (1000 / heighestSpeed);
//   if (lowestTimeInMinutes > 60 * 24) {
//     return `${Math.round(lowestTimeInMinutes / (60 * 24))} - ${Math.round(
//       heighestTimeInMinutes / (60 * 24)
//     )} day`;
//   }
//   if (lowestTimeInMinutes > 60) {
//     return `${Math.round(lowestTimeInMinutes / 60)} - ${Math.round(
//       heighestTimeInMinutes / 60
//     )} hr`;
//   } else {
//     return `${Math.round(lowestTimeInMinutes)} - ${Math.round(
//       heighestTimeInMinutes
//     )} min`;
//   }
// };
</script>

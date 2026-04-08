<template>
  <router-link
    :to="`/shop/${shop.node.slug}/${shop.node.hid}/`"
    v-for="shop in shops.edges"
    :key="'resturant_' + shop.node.id"
  >
    <div
      class="bg-cover bg-center rounded-xl h-40 lg:h-40 relative"
      :style="{ backgroundImage: 'url(' + shop.node.logo + ')' }"
    >
      
      <div class="absolute right-0 bottom-0">
        <div
          class="text-base font-bold px-3 py-2 rounded-xl bg-[#00000099] text-white flex"
        >
          <div class="mr-2">
            <svg
              width="1em"
              height="1em"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="UiKitUiKitIcon_m UiKitUiKitIcon_root Corner_icon"
            >
              <path
                d="M13.935 3a1.732 1.732 0 1 0 0 3.465 1.732 1.732 0 0 0 0-3.465z"
                fill="#D2D0CC"
              ></path>
              <path
                d="M8.999 5.248H7.714c-.46 0-.873.28-1.044.707L5.08 9.93a1.125 1.125 0 0 0 .52 1.412l4.726 2.338 1.686-5.62.269-.902 1.418.901V6.935l-2.186-1.093a5.622 5.622 0 0 0-2.514-.594z"
                fill="#FFE033"
              ></path>
              <path
                d="M15.408 10.867s2.153 1.266 2.49 1.42c.308.141.65.42.445.784-.206.363-.717.293-1.128.11-.464-.208-1.99-.901-2.304-1.074-.268-.148-.368-.206-.466-.358-.204-.318-.6-.88-.6-.88l-.708 2.812s1.109 1.336 2.024 2.89l1.349 2.731c.289.49.833 1.223.313 1.512-.622.346-1.027.06-1.472-.52l-2.214-3.575c-.855-1.352-2.122-1.723-2.249-1.914-.284-.431-.269-1.79-.127-2.518.083-.424.334-1.677.579-2.819l-1.493 1.145s-.583 2.202-.645 2.506c-.076.368-.34.988-.594.936-.314-.066-.59-.287-.52-.813l.49-3.293c.079-.244.206-.415.409-.532l2.285-1.945c.27-.152.433-.314.877-.314h.845c.55 0 .828.226 1.212 1.097.408.924 1.202 2.612 1.202 2.612z"
                fill="#9E9B98"
              ></path>
              <path
                d="M10.382 14.243 9.826 16.8s-1.439 2.084-1.84 2.668c-.3.438-.526.972-.011 1.361.577.437.927-.067 1.227-.404.316-.403 1.024-1.33 1.816-2.33.21-.265.327-.489.416-.711.06-.15.996-2.745 1.14-3.142h-2.192z"
                fill="#D2D0CC"
              ></path>
              <path
                d="M15.204 9.408c-.213-.547-.575-1.395-.943-1.91-.231 1.038-.872 3.263-.595 3.817.24.48.976-.366 1.407-.933a1 1 0 0 0 .131-.974z"
                fill="#E3CA3F"
              ></path>
              <path
                d="m10.202 13.048 1.04-3.465 1.04-2.425c.23-.116.863-.5 1.417-.223s.874.994.66 1.955c-.23 1.04-.692 3.257-.692 3.811 0 .464.032.347.195.965.108.145.017.563-.163.577h-2.81c-1.125 0-1.033-.587-1.033-.587l.346-.608z"
                fill="#F8D830"
              ></path>
              <path
                d="M10.895 9.93c-.554 0-1.155-1.617-1.386-2.426.462-.23 1.594-.693 2.426-.693.831 0 .808 1.155.692 1.733-.346.461-1.178 1.385-1.732 1.385z"
                fill="#FFE033"
              ></path>
            </svg>
          </div>
          <div class="">
            <!-- {{
              getDistanceInMinutes(
                shop.node.latitude,
                shop.node.longitude,
                5,
                7
              )
            }} -->
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <h2 class="text-1xl font-semibold pt-1.5">{{ shop.node.title }}</h2>
    </div>
    <div class="flex text-sm">
      <span class="text-green-400 mr-1">
        <MapPinIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
      </span>
      <p>{{ shop.node.street }}</p>
    </div>
  </router-link>
</template>

<script setup>
import "v3-infinite-loading/lib/style.css";
import { getDistance } from "geolib";
import { MapPinIcon } from "@heroicons/vue/24/outline";
import { computed, ref, defineAsyncComponent } from "vue";
import { STORE_SHOPS } from "@/gql/shop";
import { useQuery } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const Flicking = defineAsyncComponent(() =>
  import("@egjs/vue3-flicking")
);
const { site } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());

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
const loadMore = () => {
  fetchMore({
    variables: {
      first: first.value,
      after: shops.value.pageInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.storeShops.edges;
      const newEdges = fetchMoreResult.storeShops.edges;
      const pageInfo = fetchMoreResult.storeShops.pageInfo;
      return newEdges.length
        ? {
            storeShops: {
              __typename: previousResult.storeShops.__typename,
              total: previousResult.storeShops.total,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
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

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
              <h1 class="text-xl font-semibold text-gray-900">Wishlist</h1>
              <p class="mt-2 text-sm text-gray-700">
                Manage payments: receiveable, received, processing in your
                Reseller Dashboard.
              </p>
            </div>
          </div>
          <div v-if="products.edges.length > 0" class="mx-auto mt-4 w-full">
            <div
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-2 mt-5 relative"
            >
              <div
                v-for="product in products.edges"
                :key="product.node.id"
                class="cursor-pointer bg-white rounded-2xl md:rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <ProductItem :product="product.node" />
              </div>
              <InfiniteLoading
                v-if="hasMore && isMobile"
                @infinite="loadMore"
              />
            </div>
            <div class="w-full mt-10">
              <button
                v-if="products.edges && products.edges.length > 0 && hasMore"
                @click="loadMore()"
                class="w-40 mx-auto bg-[--primary] text-white py-3 px-6 rounded-md flex items-center justify-center"
              >
                View More
              </button>
            </div>
          </div>
          <div v-else class="">There is no products in your wish list</div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: "UserWishlist",
};
</script>
<script setup>
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { STORE_CUSTOMER_FAVORITE_PRODUCTS } from "@/gql/product";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useCustomerStore } from "@/stores/customer";
import { useSearchStore } from "@/stores/search";
import { useQuery } from "@vue/apollo-composable";
import { useSiteStore } from "@/stores/site";
dayjs.extend(relativeTime);
const SideBar = defineAsyncComponent(() =>
  import("@/components/user/SideBar.vue")
);
const ProductItem = defineAsyncComponent(() =>
  import("@/components/ProductItem.vue")
);
const { customer } = storeToRefs(useCustomerStore());
const { search } = storeToRefs(useSearchStore());
const { site, isMobile } = storeToRefs(useSiteStore());

// customer parameter
const first = ref([1].includes(site.value.industry) ? 10 : 12);
const hasMore = ref(true);
// end parameter
// query
const { result, fetchMore, loading, error, refetch } = useQuery(
  STORE_CUSTOMER_FAVORITE_PRODUCTS,
  {
    customerId: customer.value.id,
    childId:
      site.value.parent.filter((item) => item.isActive).length > 0
        ? site.value.id
        : null,
    percentage:
      site.value.parent.filter((item) => item.isActive).length > 0
        ? site.value.parent
            .filter((item) => item.isActive)
            .map((el) => {
              return {
                site_id: el.id,
                percentage: el.percentage,
                is_fixed: el.isFixed,
                parent_id: el.parentId,
              };
            })
        : null,
    first: first.value,
    after: null,
  }
);
const products = computed(() => {
  return result.value?.storeCustomerFavoriteProducts ?? { edges: [] };
});
const after = computed(() => {
  return products.value && products.value.pageInfo
    ? products.value.pageInfo.endCursor
    : null;
});
const loadMore = async ($state) => {
  fetchMore({
    variables: {
      first: first.value,
      after: after.value,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.storeCustomerFavoriteProducts.edges;
      const newEdges = fetchMoreResult.storeCustomerFavoriteProducts.edges;
      const pageInfo = fetchMoreResult.storeCustomerFavoriteProducts.pageInfo;
      if (!fetchMoreResult || newEdges.length === 0) {
        $state ? $state.complete() : null;
        hasMore.value = false;
        return previousResult;
      }
      $state ? $state.loaded() : null;
      hasMore.value = true;
      return newEdges.length
        ? {
            storeCustomerFavoriteProducts: {
              __typename:
                previousResult.storeCustomerFavoriteProducts.__typename,
              total:
                previousResult.storeCustomerFavoriteProducts.total,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
watch(search, () => {
  if (search.value) {
    refetch({ search: search.value ? search.value : null });
  } else {
    refetch({ search: null });
  }
});
</script>

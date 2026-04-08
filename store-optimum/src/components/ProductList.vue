<template>
  <div
    class="mt-4 pb-8 md:pb-12 grid sm:grid-cols-3 gap-2 md:gap-3 relative md:rounded-xl"
    :class="[
      path == 'BrandDetails' ||
      path == 'CategoryDetails' ||
      path == 'ChildCategoryDetails' ||
      path == 'SubChildCategoryDetails' ||
      path == 'ProductFlash' ||
      path == 'ProductNew' ||
      path == 'AuthorDetails' ||
      path == 'PublisherDetails' ||
      path == 'CollectionDetails' ||
      path == 'ResturantDetails' ||
      path == 'ShopDetails' ||
      path == 'Products'
        ? 'md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        : 'md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 99].includes(
        site.industry
      )
        ? 'grid-cols-2'
        : [1].includes(site.industry)
        ? 'grid-cols-3'
        : 'grid-cols-1',
    ]"
  >
    <div
      v-for="product in products.edges"
      :key="'productList_' + product.node.id"
      class="flex"
    >
      <ProductItem :product="product.node" />
    </div>
  </div>
  <div v-if="hasMore && isMobile" class="mb-6">
    <InfiniteLoading
    :firstload="false"
    @infinite="loadMore"
    />
  </div>
  <div class="w-full px-4 pb-4 md:pb-0">
    <button
      v-if="products.edges.length >= first && hasMore"
      @click="loadMore()"
      class="w-40 mx-auto bg-[--primary] text-white py-2 px-4 rounded-md flex items-center justify-center"
    >
      More
    </button>
  </div>
  <div v-if="products.edges.length == 0">
    <h2 class="text-xl md:text-3xl font-semibold text-center text-gray-400">
      No Product Available
    </h2>
  </div>
</template>

<script setup>
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { STORE_PRODUCTS } from "@/gql/product";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSearchStore } from "@/stores/search";
import { useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useSiteStore } from "@/stores/site";
import { useCustomerStore } from "@/stores/customer";
dayjs.extend(relativeTime);
const ProductItem = defineAsyncComponent(() =>
  import("@/components/ProductItem.vue")
);
const router = useRouter();
const { search } = storeToRefs(useSearchStore());
const { site, isMobile } = storeToRefs(useSiteStore());
const { customer } = storeToRefs(useCustomerStore());
const props = defineProps({
  categoryId: {
    type: Number,
    required: false,
  },
  subCategoryId: {
    type: Number,
    required: false,
  },
  subSubCategoryId: {
    type: Number,
    required: false,
  },
  queryType: {
    type: String,
    required: false,
  },
  brandId: {
    type: Number,
    required: false,
  },
  collectionId: {
    type: Number,
    required: false,
  },
  campaignId: {
    type: Number,
    required: false,
  },
  shopId: {
    type: Number,
    required: false,
  },
  isFlash: {
    type: Boolean,
    required: false,
  },
  isNew: {
    type: Boolean,
    required: false,
  },
  plainSearch: {
    type: String,
    required: false,
  },
  first: {
    type: Number,
    required: false,
    default: 12,
  },
});
// customer parameter
const first = ref(props.first);
const hasMore = ref(true);
const limit = ref(512)
// end parameter
// query
const { result, fetchMore, loading, error, refetch } = useQuery(
  STORE_PRODUCTS,
  {
    siteId: [
      site.value.id,
      ...site.value.parent
        .filter((item) => item.isActive)
        .map((item) => item.id),
    ],
    categoryId: props.categoryId ? props.categoryId : null,
    subCategoryId: props.subCategoryId ? props.subCategoryId : null,
    subSubCategoryId: props.subSubCategoryId ? props.subSubCategoryId : null,
    brandId: props.brandId ? props.brandId : null,
    collectionId: props.collectionId ? props.collectionId : null,
    campaignId: props.campaignId ? props.campaignId : null,
    shopId: props.shopId ? props.shopId : null,
    isFlash: props.isFlash ? props.isFlash : null,
    isNew: props.isNew ? props.isNew : null,
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
    isReseller: site.value.siteInfo == 'reseller' ? true : (customer.value && customer.value.customerTypes.includes(2)) && customer.value.isReseller ? true : false,
    queryType: router.currentRoute.value.query["queryType"]
      ? router.currentRoute.value.query["queryType"] : props.queryType ? props.queryType
      : site.value.queryType,
    search: props.plainSearch ? props.plainSearch : null,
    first: first.value,
    after: null,
    limit: limit.value
  }
);
const products = computed(() => {
  return result.value?.storeProducts ?? { edges: [] };
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
      limit: limit.value
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.storeProducts.edges;
      const newEdges = fetchMoreResult.storeProducts.edges;
      const pageInfo = fetchMoreResult.storeProducts.pageInfo;
      if (!fetchMoreResult || newEdges.length === 0) {
        $state ? $state.complete() : null;
        hasMore.value = false;
        return previousResult;
      }
      $state ? $state.loaded() : null;
      hasMore.value = true;
      return newEdges.length
        ? {
            storeProducts: {
              __typename: previousResult.storeProducts.__typename,
              total: previousResult.storeProducts.total,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
watch(props, () => {
  hasMore.value = true;
  refetch({
    categoryId: props.categoryId ? props.categoryId : null,
    subCategoryId: props.subCategoryId ? props.subCategoryId : null,
    subSubCategoryId: props.subSubCategoryId ? props.subSubCategoryId : null,
    brandId: props.brandId ? props.brandId : null,
    collectionId: props.collectionId ? props.collectionId : null,
    campaignId: props.campaignId ? props.campaignId : null,
    isFlash: props.isFlash ? props.isFlash : null,
    isNew: props.isNew ? props.isNew : null,
    isReseller: site.value.siteInfo == 'reseller' ? true : (customer.value && customer.value.customerTypes.includes(2)) && customer.value.isReseller ? true : false,
    queryType: router.currentRoute.value.query["queryType"]
      ? router.currentRoute.value.query["queryType"] : props.queryType ? props.queryType
      : site.value.queryType,
    search: props.plainSearch ? props.plainSearch : null,
  });
});
watch(search, () => {
  hasMore.value = true;
  if (search.value) {
    refetch({ search: search.value ? search.value : null });
  } else {
    refetch({ search: null });
  }
});
const path = computed(() => router.currentRoute.value.name);

// const myClass = computed(() => {
//   if (
//     [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 99].includes(
//       site.value.industry
//     )
//   ) {
//     return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3";
//   } else if ([1].includes(site.value.industry)) {
//     return "grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4";
//   } else {
//     return "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 md:gap-3";
//   }
// });
</script>

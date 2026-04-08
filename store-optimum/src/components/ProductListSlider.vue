<template>
  <div v-if="products.edges && products.edges.length > 0" class="px-4 pt-2 sm:px-0 md:p-4 md:rounded-md relative mt-4"
    :class="title
        ? 'bg-white'
        : isFlash
          ? `bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-4 sm:px-4`
          : `bg-white`
      ">
      <!-- //___________ category cover for www.needs-deal.com __________// -->
      <div v-if="site.domain === 'www.needs-deal.com' && title">
        <img class="w-full rounded-md h-32 md:h-60 mb-2 md:mb-4 object-cover" :src="category?.cover" alt="category cover">
      </div>
    <div v-if="isFlash" id="firework-1" class="firework">
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
    <div v-else id="firework-2" class="firework">
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
    <div class="flex justify-between items-center mb-1 md:mb-4">
      <div v-if="title == null && isFlash" class="text-white font-semibold">
        {{ $t("nav.flashSale") }}
      </div>
      <div v-if="isFlash" class="flex items-end gap-3 text-white">
        <div class="grid grid-flow-col gap-5 text-center auto-cols-max items-center justify-center text-sm">
          <div class="flex flex-col">
            <span class="countdown font-mono text-sm">
              <span :style="'--value:' + dayjs(timeDiff).day()"></span>
            </span>
            days
          </div>
          <div class="flex flex-col">
            <span class="countdown font-mono text-sm">
              <span :style="'--value:' + dayjs(timeDiff).hour()"></span>
            </span>
            hours
          </div>
          <div class="flex flex-col">
            <span class="countdown font-mono text-sm">
              <span :style="'--value:' + dayjs(timeDiff).minute()"></span>
            </span>
            min
          </div>
          <div class="flex flex-col">
            <span class="countdown font-mono text-sm">
              <span :style="'--value:' + dayjs(timeDiff).second()"></span>
            </span>
            sec
          </div>
        </div>
      </div>
      <div v-else class="font-bold" :class="!title ? 'text-center text-gray-800' : site.domain === 'www.needs-deal.com'  ? 'text-left text-[--primary]' : 'text-left text-gray-800'">
        {{ title 
          ? (locale === 'en' ? title : translation) 
          : $t("content.newArrival") 
       }}       
      </div>
      <div v-if="title">
        <div v-if="site.domain === 'www.needs-deal.com'" class="flex gap-3">
          <router-link v-for="subCategory in subCategories.filter(a => a.categoryId === categoryId).slice(0, 3)" :to="`/sub-category/${subCategory.slug}/${subCategory.hid}/`" class="text-[--primary] hover:underline text-sm hidden md:block">{{ subCategory.title }}</router-link>
          <router-link class="flex items-center gap-1 text-[--primary] text-sm font-semibold"
            :to="`/category/${title}/${encodeId(categoryId)}/`">
            <span>{{ $t("content.seeMore") }}</span>
            <ArrowRightIcon class="h-4 w-4"></ArrowRightIcon>
          </router-link>
        </div>
        <router-link v-else class="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-semibold"
          :to="`/category/${title}/${encodeId(categoryId)}/`">
          <span>{{ $t("content.seeMore") }}</span>
          <ArrowRightIcon class="h-4 w-4"></ArrowRightIcon>
        </router-link>
      </div>
      <router-link v-else :to="`/product/${isFlash ? 'flash' : 'new'}`"
        class="flex items-center gap-1 text-sm font-semibold" :class="isFlash
            ? 'text-gray-100 hover:text-gray-200'
            : 'text-gray-600 hover:text-gray-900'
          ">
        <span :class="isFlash ? 'hidden sm:block' : ''">{{ $t("content.seeMore") }}</span>
        <ArrowRightIcon class="h-4 w-4"></ArrowRightIcon>
      </router-link>
    </div>
    <Flicking v-if="props.isFlash || props.isNew" :key="'5'" :options="{
      align: 'prev',
      circular: true,
      circularFallback: 'bound',
      panelsPerView: perView,
    }" :plugins="title
          ? []
          : products.edges && products.edges.length > 5
            ? sliderPlugin
            : []
        ">
      <div v-for="product in products.edges" :key="product.node.id" class="mx-1">
        <ProductItem :product="product.node" :className="[1].includes(site.industry) ? 'p-2' : ''" :isPop="false" />
      </div>
    </Flicking>
    <div v-else>
      <!-- <img
        v-if="!categoryCover.includes('default')"
        class="w-full h-[150px] md:h-64 object-cover pb-2 md:pb-4"
        v-lazy="categoryCover"
        alt="category cover"
      /> -->
      <div class="grid relative" :class="[myClass]">
        <div v-for="product in products.edges" :key="'productList_' + product.node.id" class="flex">
          <ProductItem :product="product.node" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AutoPlay } from "@egjs/flicking-plugins";
import "v3-infinite-loading/lib/style.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { STORE_PRODUCTS } from "@/gql/product";
import { computed, ref, watch, onMounted, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSearchStore } from "@/stores/search";
import { useQuery } from "@vue/apollo-composable";
import { useSiteStore } from "@/stores/site";
import { useCustomerStore } from "@/stores/customer";
import { useCategoryStore } from "@/stores/category";
import { useSubCategoryStore } from "@/stores/subCategory";
import { ArrowRightIcon } from "@heroicons/vue/24/outline";
import { useI18n } from "vue-i18n";
dayjs.extend(duration);
const ProductItem = defineAsyncComponent(() =>
  import("@/components/ProductItem.vue")
);
const Flicking = defineAsyncComponent(() => import("@egjs/vue3-flicking"));
const sliderPlugin = ref([
  new AutoPlay({ duration: 2000, direction: "NEXT", stopOnHover: true }),
]);
const { search } = storeToRefs(useSearchStore());
const { locale } = useI18n();
const { site, isMobile } = storeToRefs(useSiteStore());
const { customer } = storeToRefs(useCustomerStore());
const { categories } = storeToRefs(useCategoryStore());
const { getCategories } = useCategoryStore();
const { subCategories } = storeToRefs(useSubCategoryStore());
const { getSubCategories } = useSubCategoryStore();
if (categories.value.length == 0) {
  getCategories(
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
if (subCategories.value.length == 0) {
  getSubCategories(
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
const props = defineProps({
  categoryId: {
    type: Number,
    required: false,
  },
  categoryCover: {
    type: String,
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
  brandId: {
    type: Number,
    required: false,
  },
  shopId: {
    type: Number,
    required: false,
  },
  isNew: {
    type: Boolean,
    required: false,
  },
  isFlash: {
    type: Boolean,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  translation: {
    type: String,
    required: false,
  },
  first: {
    type: Number,
    required: false,
    default: 12,
  },
});
const perView = computed(() => {
  let result;

  if (isMobile.value) {
    if (
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 99].includes(
        site.value.industry
      )
    ) {
      result = 2;
    } else if ([1].includes(site.value.industry)) {
      result = 3;
    } else {
      result = 1;
    }
  } else {
    if (window.document.body.clientWidth < 768) {
      result = 3;
    } else if (window.document.body.clientWidth < 1024) {
      result = 4;
    } else if (window.document.body.clientWidth < 1280) {
      result = 5;
    } else {
      result = 6;
    }
  }
  return result;
});
const emit = defineEmits(["loadMore"]);
// countdwon
const now = ref(new Date());
const lastEvent = ref(new Date(site.value.lastEvent));
const timeDiff = computed(() => {
  if (lastEvent.value > now.value) {
    return dayjs
      .duration(dayjs(lastEvent.value).diff(now.value))
      .format("YYYY-MM-DD HH:mm:ss");
  } else {
    let today = dayjs().endOf("day");
    return dayjs
      .duration(dayjs(today).diff(dayjs(now.value)))
      .format("YYYY-MM-DD HH:mm:ss");
  }
});
const getNow = () => {
  now.value = dayjs().toISOString();
};
onMounted(() => {
  setInterval(getNow, 1000);
});
// countdwon
// customer parameter
const first = ref(props.first);
// end parameter
// query
const { result, refetch, loading } = useQuery(STORE_PRODUCTS, {
  siteId: [
    site.value.id,
    ...site.value.parent.filter((item) => item.isActive).map((item) => item.id),
  ],
  categoryId: props.categoryId ? props.categoryId : null,
  first: first.value,
  subCategoryId: props.subCategoryId ? props.subCategoryId : null,
  subSubCategoryId: props.subSubCategoryId ? props.subSubCategoryId : null,
  brandId: props.brandId ? props.brandId : null,
  shopId: props.shopId ? props.shopId : null,
  isFlash: props.isFlash ? props.isFlash : null,
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
  isNew: props.isNew ? props.isNew : null,
  queryType: site.value.queryType,
  first: first.value,
  after: null,
});
const products = computed(() => {
  return result.value?.storeProducts ?? { edges: [] };
});
const after = computed(() => {
  return products.value && products.value.pageInfo
    ? products.value.pageInfo.endCursor
    : null;
});
watch(props, () => {
  refetch({
    categoryId: props.categoryId ? props.categoryId : null,
    subCategoryId: props.subCategoryId ? props.subCategoryId : null,
    subSubCategoryId: props.subSubCategoryId ? props.subSubSubCategoryId : null,
    brandId: props.brandId ? props.brandId : null,
    isFlash: props.isFlash ? props.isFlash : null,
    isNew: props.isNew ? props.isNew : null,
  });
});
watch(search, () => {
  if (search.value) {
    refetch({ search: search.value ? search.value : null });
  } else {
    refetch({ search: null });
  }
});
watch(loading, () => {
  if (!loading.value) {
    emit("loadMore");
  }
});
const myClass = computed(() => {
  if (
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 99].includes(
      site.value.industry
    )
  ) {
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3";
  } else if ([1].includes(site.value.industry)) {
    return "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3";
  } else {
    return "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 md:gap-3";
  }
});

// const industries = ref([
//   { id: 1, title: "Groceries" },
//   { id: 2, title: "Fashion" },
//   { id: 3, title: "Electronics" },
//   { id: 4, title: "Furniture" },
//   { id: 5, title: "Handcrafts" },
//   { id: 6, title: "Jewelry" },
//   { id: 7, title: "Painting" },
//   { id: 8, title: "Photography" },
//   { id: 9, title: "Restaurants" },
//   { id: 10, title: "Beauty" },
//   { id: 17, title: "Medicine" },
//   { id: 11, title: "Food & drink" },
//   { id: 12, title: "Sports" },
//   { id: 13, title: "Toys" },
//   { id: 14, title: "Services" },
//   { id: 15, title: "Virtual services" },
//   { id: 16, title: "Course" },
//   { id: 17, title: "Restaurant" },
//   { id: 99, title: "Other" },
// ]);
const category = categories.value.find(item => item.id === props?.categoryId)
</script>

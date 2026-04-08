<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div class="max-w-screen-2xl mx-auto sm:px-4 flex pb-5">
      <div class="flex gap-5 w-full relative">
        <SideBar
          @onCategory="toggleCategory"
          @onSubCategory="toggleSubCategory"
          @onSubSubCategory="toggleSubSubCategory"
        ></SideBar>
        <div
          class="w-full md:overflow-hidden md:mt-4"
          :class="
            [1].includes(site.industry)
              ? 'md:w-9/12 md:max-w-[1120px]'
              : 'md:w-full'
          "
          v-if="shop"
        >
          <!--  hero start -->
          <div
            :style="`background: linear-gradient(45deg, rgba(0, 0, 0, 0.365), transparent), url('${shop.cover}'); background-repeat: no-repeat; background-size: cover;`"
            class="px-5 pb-16 md:pb-5 h-[300px] md:rounded-2xl md:mt-4 relative flex flex-col justify-end"
          >
            <h2 class="text-4xl text-white font-semibold">{{ shop.title }}</h2>
            <h6 class="text-xl text-white font-semibold">{{ shop.street }}</h6>
            <div class="flex gap-2 mt-4">
              <!-- <div class="bg-yellow-50 flex items-center rounded-xl px-3 py-2">
              <span>
                <HeartIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
              </span>
              <div class="leading-4 ml-2">
                <p class="font-semibold">
                  {{
                    getDistanceInMinutes(shop.latitude, shop.longitude, 5, 7)
                  }}
                </p>
                <span class="text-xs">min</span>
              </div>
            </div>
            <div class="bg-yellow-50 flex items-center rounded-xl px-3 py-1">
              <span>
                <StarIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </span>
              <div class="leading-4 ml-2">
                <p class="font-semibold">4.8</p>
                <span class="text-xs">200+</span>
              </div>
            </div>
            <div class="bg-yellow-50 flex items-center rounded-xl px-3 py-1">
              <span>
                <HeartIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
              </span>
            </div> -->
            </div>
            <div
              class="hidden bg-yellow-50 md:flex items-center h-10 w-10 justify-center rounded-full absolute top-5 right-5"
            >
              <span>
                <HeartIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
              </span>
            </div>
          </div>
          <!-- hero end -->
          <div class="md:hidden pt-3 px-4 rounded-2xl bg-white -mt-6 relative">
            <Flicking
              :key="'5'"
              :options="{
                align: 'prev',
                circular: true,
                circularFallback: 'bound',
              }"
            >
              <span
                @click="toggleCategory({ title: 'All', id: null })"
                class="rounded-2xl px-3 py-1 mr-2 text-center text-gray-700"
                :class="categoryId == null ? 'bg-gray-200' : ''"
              >
                All
              </span>
              <span
                class="rounded-2xl px-3 py-1 mr-2 text-gray-700 text-center"
              >
                Offers
              </span>
              <span
                @click="toggleCategory(category)"
                v-for="category in categories.filter((v) =>
                  shop.categories.includes(v.id)
                )"
                :key="category.id"
                class="whitespace-nowrap rounded-2xl px-3 py-1 mr-2 text-center text-gray-700"
                :class="categoryId == category.id ? 'bg-gray-200' : ''"
              >
                {{ category.title }}
              </span>
            </Flicking>
          </div>
          <!-- Products start -->
          <div
            class="my-2 px-4 md:px-0 flex items-center justify-between w-full"
          >
            <h2
              class="flex justify-between w-full font-bold text-md sm:text-1xl text-gray-600 items-center"
            >
              <span>{{
                subCategory.id ? subCategory.title : category.title
              }}</span>
              <router-link
                v-if="subCategory.id == null && category.id"
                :to="`/category/${category.title}/${category.hid}/`"
                class="text-sm text-gray-500 flex items-center rounded-2xl bg-gray-100 p-2 px-3 hover:bg-gray-200 cursor-pointer transition-all"
              >
                <span class="mr-1">All products</span>
                <ChevronRightIcon class="w-5 h-5"></ChevronRightIcon>
              </router-link>
              <router-link
                v-else-if="subCategory.id"
                :to="`/sub-category/${subCategory.title}/${subCategory.hid}/`"
                class="text-sm text-gray-500 flex items-center rounded-2xl bg-gray-100 p-2 px-3 hover:bg-gray-200 cursor-pointer transition-all"
              >
                <span class="mr-1">All products</span>
                <ChevronRightIcon class="w-5 h-5"></ChevronRightIcon>
              </router-link>
            </h2>
          </div>
          <ProductList
            :key="shop.id"
            :categoryId="categoryId"
            :subCategoryId="subCategoryId"
            :subSubCategoryId="subSubCategoryId"
            :shopId="shop.id"
          />
          <!-- Products end -->
        </div>
      </div>
      <nav
        v-if="navbarVisible"
        class="bg-white w-full py-2 px-3 md:hidden fixed top-0 z-10"
      >
        <div class="flex items-center justify-between">
          <router-link :to="`/`">
            <div
              class="text-base rounded-full h-8 w-10 bg-[#ffffff6b] flex items-center justify-center"
            >
              <ArrowLeftIcon class="h-5 w-5 text-gray-800" aria-hidden="true" />
            </div>
          </router-link>
          <router-link :to="`/`">
            {{ shop.title }}
          </router-link>
          <div class="flex">
            <div
              class="text-base rounded-full h-8 w-10 bg-[#ffffff6b] flex items-center justify-center"
            >
              <button
                type="button"
                style="
                  background-image: radial-gradient(
                      112.35% 230.36% at 112.35% 0,
                      #fc0 0,
                      #fb692b 12.51%,
                      #be40c0 34.51%,
                      rgba(80, 90, 221, 0) 82.73%
                    ),
                    radial-gradient(
                      100% 204.7% at 0 100%,
                      #48cce0 0,
                      #4395ee 26.3%,
                      #505add 56.69%
                    );
                "
                class="rounded-[10px] p-1 text-white focus:ring-offset-2"
              >
                <span class="sr-only">View notifications</span>
                <svg
                  class="w-6"
                  viewBox="0 0 24 24"
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g data-v-df4316fe="" fill="none">
                    <path data-v-df4316fe="" d="M0 0h24v24H0Z"></path>
                    <g
                      data-v-df4316fe=""
                      stroke-linecap="round"
                      stroke-width="1.5"
                      stroke="#fff"
                      fill="none"
                      stroke-linejoin="round"
                    >
                      <path
                        data-v-df4316fe=""
                        d="M21 8V5c0-1.105-.9-2-2-2h-3"
                      ></path>
                      <path
                        data-v-df4316fe=""
                        d="M8 3H5c-1.105 0-2 .895-2 2v3"
                      ></path>
                      <path
                        data-v-df4316fe=""
                        d="M3 16v3c0 1.1.895 2 2 2h3"
                      ></path>
                      <path
                        data-v-df4316fe=""
                        d="M16 21h3c1.1 0 2-.9 2-2v-3"
                      ></path>
                      <path data-v-df4316fe="" d="M3 12h18"></path>
                    </g>
                  </g>
                </svg>
              </button>
            </div>
            <div
              class="text-base ml-2 rounded-full h-8 w-10 bg-[#ffffff6b] flex items-center justify-center"
            >
              <HeartIcon
                class="h-5 w-5 text-[--primary]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <Flicking
          :key="'5'"
          :options="{
            align: 'prev',
            circular: true,
            circularFallback: 'bound',
          }"
        >
          <span
            @click="toggleCategory({ title: 'All', id: null })"
            class="rounded-2xl p-2 mr-2 text-center text-gray-700"
            :class="!true ? 'bg-gray-200' : ''"
          >
            All
          </span>
          <span class="rounded-2xl p-2 mr-2 text-gray-700 text-center">
            Offers
          </span>
          <span
            @click="toggleCategory(category)"
            v-for="category in categories.filter((v) =>
              shop.categories.includes(v.id)
            )"
            :key="category.id"
            class="whitespace-nowrap rounded-2xl p-2 mr-2 text-center text-gray-700"
            :class="categoryId == category.id ? 'bg-gray-200' : ''"
          >
            {{ category.title }}
          </span>
        </Flicking>
      </nav>
    </div>
  </main>
</template>
<script>
export default {
  name: "ResturantPreview",
};
</script>
<script setup>
import { useSliderStore } from "@/stores/slider";
import {
  ArrowLeftIcon,
  HeartIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import {
  computed,
  ref,
  watch,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
} from "vue";
import { STORE_SHOP_DETAILS_BY_HID } from "@/gql/shop";
import { useQuery } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCategoryStore } from "@/stores/category";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Flicking = defineAsyncComponent(() => import("@egjs/vue3-flicking"));
const SideBar = defineAsyncComponent(() => import("@/components/SideBar.vue"));
const ProductList = defineAsyncComponent(() =>
  import("@/components/ProductList.vue")
);
const router = useRouter();
const { sliders } = storeToRefs(useSliderStore());
const { site } = storeToRefs(useSiteStore());
const { categories } = storeToRefs(useCategoryStore());
const { getCategories } = useCategoryStore();
const { getSliders } = useSliderStore();
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
if (sliders.value.length == 0) {
  getSliders(
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
const category = ref({ title: "All products", id: null, hid: null });
const categoryId = computed(() => category.value.id);
const subCategory = ref({ title: "All products", id: null, hid: null });
const subCategoryId = computed(() => subCategory.value.id);
const subSubCategory = ref({ title: "All products", id: null, hid: null });
const subSubCategoryId = computed(() => subSubCategory.value.id);
const toggleCategory = (data) => {
  if (data.id == null) {
    category.value.title = "All products";
    category.value.id = null;
    category.value.hid = null;
  } else {
    toggleSubCategory({ id: null });
    toggleSubSubCategory({ id: null });
    category.value.title = data.title;
    category.value.id = data.id;
    category.value.hid = data.hid;
  }
};
const toggleSubCategory = (data) => {
  if (data.id == null) {
    subCategory.value.title = "All products";
    subCategory.value.id = null;
    subCategory.value.hid = null;
  } else {
    toggleSubCategory({ id: null });
    toggleSubSubCategory({ id: null });
    subCategory.value.title = data.title;
    subCategory.value.id = data.id;
    subCategory.value.hid = data.hid;
  }
};
const toggleSubSubCategory = (data) => {
  if (data.id == null) {
    subSubCategory.value.title = "All products";
    subSubCategory.value.id = null;
    subSubCategory.value.hid = null;
  } else {
    console.log(data);
    toggleCategory({ id: null });
    toggleSubCategory({ id: null });
    subSubCategory.value.title = data.title;
    subSubCategory.value.id = data.id;
    subSubCategory.value.hid = data.hid;
  }
};
const shop = ref(null);
if (
  router.currentRoute.value.params.id &&
  router.currentRoute.value.name == "ShopPreview"
) {
  const { onResult, loading, error, refetch } = useQuery(
    STORE_SHOP_DETAILS_BY_HID,
    {
      siteId: site.value.id,
      hid: router.currentRoute.value.params.id,
    }
  );
  onResult((queryResult) => {
    shop.value = queryResult.data.storeShopByHid;
  });
  watch(router.currentRoute, () => {
    if (
      router.currentRoute.value.params.id &&
      router.currentRoute.value.name == "ShopPreview"
    ) {
      refetch({
        siteId: site.value.id,
        hid: router.currentRoute.value.params.id,
      });
    }
  });
}

const scrollPosition = ref(0);
const navbarVisible = ref(false);
const handleScroll = () => {
  scrollPosition.value = window.scrollY;
};
// Watch for changes in the scroll position
watch(scrollPosition, (newScrollPosition) => {
  // Adjust the scroll threshold as needed
  if (newScrollPosition < 240) {
    navbarVisible.value = false;
  } else {
    navbarVisible.value = true;
  }
});

// Add event listener for the scroll event
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

// Remove the event listener when the component is unmounted
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

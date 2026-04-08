<template>
  <main class="sm:px-0 pb-[60px] pt-[50px] sm:pt-4">
    <div class="max-w-screen-2xl mx-auto sm:px-4 flex pb-5" id="app">
      <!-- sidebar end -->
      <main class="w-full overflow-hidden">
        <!--  hero start -->
        <Flicking
          :key="'5'"
          class="h-[150px] sm:h-[344px]"
          :options="{
            align: 'prev',
            circular: true,
            circularFallback: 'bound',
            panelsPerView: 1,
          }"
          :plugins="
            sliders.filter((v) => v.isPhone == isMobile).length > 1
              ? sliderPlugin
              : []
          "
          ><router-link
            :to="`${slider.url.trim()}`"
            v-for="slider in sliders.filter((v) => v.isPhone == isMobile)"
            :key="slider.id"
          >
            <img
              v-lazy="slider.cover"
              class="h-[150px] sm:h-[250px] md:rounded-xl relative w-full"
          /></router-link>
        </Flicking>
        <div class="px-4 md:px-0">
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-2 md:gap-y-4 md:gap-x-4 text-center w-full my-4 mb:my-4"
          >
            <router-link
              :to="
                item.isExternal
                  ? `/${item.url.trim()}`
                  : `/collection/${item.slug}/${item.hid}/`
              "
              v-for="item in collections
                .filter((v) => v.title == 'type_1')
                .slice(0, 4)"
              :key="item.id"
              class="bg-white px-2 py-2 flex justify-start items-center rounded-full border"
            >
              <img
                v-lazy="item.image"
                class="h-[30px] w-[30px] rounded-full object-cover mr-3 border-red-100"
              />
              <div class="text-md font-bold">{{ item.translation }}</div>
            </router-link>
          </div>
          <router-link
            :to="
              item.isExternal
                ? `/${item.url.trim()}`
                : `/collection/${item.slug}/${item.hid}/`
            "
            v-for="item in collections.filter((v) => v.title == 'type_2')"
            :key="item.id"
          >
            <img
              v-lazy="item.image"
              class="w-full h-[50px] sm:h-[100px] rounded-md md:rounded-xl relative my-4 mb:my-4 object-cover"
            />
          </router-link>
          <router-link
            :to="
              item.isExternal
                ? `/${item.url.trim()}`
                : `/collection/${item.slug}/${item.hid}/`
            "
            v-for="item in collections.filter((v) => v.title == 'type_3')"
            :key="item.id"
          >
            <img
              v-lazy="item.image"
              class="h-[150px] sm:h-[344px] rounded-md md:rounded-xl relative w-full my-4 mb:my-4 object-cover"
            />
          </router-link>
        </div>
        <marquee
          v-if="site.notice"
          class="white-bg sm:rounded sm:mt-4"
          direction="left"
          style="
            background-color:var(--primary);
            color: #fff;
            font-weight: 600;
            position: relative;
            padding: 5px;
          "
        >
          {{ site.notice }}
        </marquee>
        <div class="px-4 md:px-0">
          <h2
            class="text-center font-bold text-[--primary] text-xl md:text-2xl bg-white py-2 md:py-3 border rounded"
            v-if="collections.filter((v) => v.title == 'type_4').length > 0"
          >
            {{ collections.filter((v) => v.title == "type_4")[0].translation }}
          </h2>
          <div
            class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-y-2 gap-x-2 text-center w-full my-4 mb:my-4"
          >
            <router-link
              :to="
                item.isExternal
                  ? `/${item.url.trim()}`
                  : `/collection/${item.slug}/${item.hid}/`
              "
              v-for="item in collections
                .filter((v) => v.title == 'type_4')
                .slice(0, 4)"
              :key="item.id"
            >
              <img
                v-lazy="item.image"
                class="h-[200px] sm:h-[344px] mr-2 mb:mr-4 rounded-md md:rounded-xl relative w-full object-cover"
              />
            </router-link>
          </div>
          <router-link
            :to="
              item.isExternal
                ? `/${item.url.trim()}`
                : `/collection/${item.slug}/${item.hid}/`
            "
            v-for="item in collections.filter((v) => v.title == 'type_5')"
            :key="item.id"
          >
            <img
              v-lazy="item.image"
              class="h-[50px] sm:h-[100px] rounded-md md:rounded-xl relative w-full my-4 mb:my-4 object-cover"
            />
          </router-link>
          <h2
            class="text-center font-bold text-[--primary] text-xl md:text-2xl bg-white py-2 md:py-3 border rounded"
            v-if="categories.length > 0"
          >
            Shop by category
          </h2>
          <div
            class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-y-2 gap-x-2 text-center w-full my-4 mb:my-4"
          >
            <router-link
              :to="
                item.isExternal
                  ? `/${item.url.trim()}`
                  : `/collection/${item.slug}/${item.hid}/`
              "
              v-for="item in collections.filter((v) => v.title == 'type_8')"
              :key="item.id"
            >
              <img
                v-lazy="item.image"
                class="h-[200px] sm:h-[344px] rounded-md md:rounded-md relative w-full object-cover"
              />
            </router-link>
          </div>
          <router-link
            :to="
              item.isExternal
                ? `/${item.url.trim()}`
                : `/collection/${item.slug}/${item.hid}/`
            "
            v-for="item in collections.filter((v) => v.title == 'type_6')"
            :key="item.id"
          >
            <img
              v-lazy="item.image"
              class="h-[50px] sm:h-[100px] rounded-md md:rounded-xl relative w-full my-4 mb:my-4 object-cover"
            />
          </router-link>
          <!--  hero start -->
          <div
            class="grid grid-cols-4 md:grid-cols-4 xl:grid-cols-4 gap-y-2 gap-x-4 text-center w-full my-4 mb:my-4"
          >
            <router-link
              :to="
                item.isExternal
                  ? `/${item.url.trim()}`
                  : `/collection/${item.slug}/${item.hid}/`
              "
              v-for="item in collections.filter((v) => v.title == 'type_7')"
              :key="item.id"
              class="text-center flex justify-center"
            >
              <img
                v-lazy="item.image"
                class="h-[70px] sm:h-[200px] w-[70px] sm:w-[200px] border-2 border-red-500 px-2 rounded-full md:rounded-full object-cover"
              />
            </router-link>
          </div>
          <h2
            class="text-center font-bold text-[--primary] text-xl md:text-2xl bg-white py-2 md:py-3 border rounded"
            v-if="subCategories.length > 0"
          >
            Shop by sub category
          </h2>
          <div
            class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-y-2 gap-x-2 text-center w-full my-4 mb:my-4"
          >
            <router-link
              :to="
                item.isExternal
                  ? `/${item.url.trim()}`
                  : `/collection/${item.slug}/${item.hid}/`
              "
              v-for="item in collections.filter((v) => v.title == 'type_9')"
              :key="item.id"
            >
              <img
                v-lazy="item.image"
                class="h-[200px] sm:h-[344px] rounded-md md:rounded-md relative w-full object-cover"
              />
            </router-link>
          </div>
          <h2
            class="text-center font-bold text-[--primary] text-xl md:text-2xl bg-white py-2 md:py-3 border rounded"
            v-if="categories.length > 0"
          >
            Shop by collection
          </h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4 text-center w-full my-4 mb:my-4"
          >
            <router-link
              :to="
                item.isExternal
                  ? `/${item.url.trim()}`
                  : `/collection/${item.slug}/${item.hid}/`
              "
              v-for="item in collections.filter((v) => v.title == 'type_10')"
              :key="item.id"
            >
              <img
                v-lazy="item.image"
                class="h-[150px] sm:h-[344px] rounded-md md:rounded-xs w-full object-cover"
              />
            </router-link>
          </div>
        </div>
      </main>
    </div>
  </main>
  <!-- navbar end -->
  <router-link :to="`/checkout/`" class="fixed top-[50%] right-0 z-40">
    <div
      class="bg-[--primary] px-2 py-1 md:px-3 md:py-2 rounded-l-lg text-white shadow-md"
    >
      <div class="text-center flex justify-center items-center">
        <ShoppingBagIcon
          class="w-5 h-5 mr-2 text-white group-hover:text-blue-600"
          aria-hidden="true"
        />
      </div>
      <div class="">
        <div class="font-semibold text-xs md:text-sm mt-1">
          {{ cart.length }} items
        </div>
      </div>
      <div
        class="font-bold text-xs md:text-sm text-gray-500 rounded-md mt-2 px-1 py-1 text-center mb-2 bg-white"
      >
        {{
          site.isPublic || (customer && customer.isActive)
            ? formatMoney(
                cart.reduce((total, obj) => total + obj.price * obj.qnt, 0),
                "BDT"
              )
            : "***"
        }}
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ShoppingBagIcon } from "@heroicons/vue/24/outline";
import { AutoPlay } from "@egjs/flicking-plugins";
const Flicking = defineAsyncComponent(() =>
  import("@egjs/vue3-flicking")
);
import { ref, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCategoryStore } from "@/stores/category";
import { useSliderStore } from "@/stores/slider";
import { useCollectionStore } from "@/stores/storeCollection";
import { useCartStore } from "@/stores/cart";
import { useSubCategoryStore } from "@/stores/subCategory";
const sliderPlugin = ref([
  new AutoPlay({ duration: 2000, direction: "NEXT", stopOnHover: true }),
]);
const { site, isMobile } = storeToRefs(useSiteStore());
const { categories } = storeToRefs(useCategoryStore());
const { sliders } = storeToRefs(useSliderStore());
const { collections } = storeToRefs(useCollectionStore());
const { getCategories } = useCategoryStore();
const { subCategories } = storeToRefs(useSubCategoryStore());
const { getSubCategories } = useSubCategoryStore();
const { getSliders } = useSliderStore();
const { getCollections } = useCollectionStore();
const { cart } = storeToRefs(useCartStore());
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
// if (collections.value.length == 0) {
getCollections(
  [
    site.value.id,
    ...site.value.parent.filter((item) => item.isActive).map((item) => item.id),
  ],
  site.value.parent.filter((item) => item.isActive).length > 0
    ? site.value.id
    : null
);
// }
</script>

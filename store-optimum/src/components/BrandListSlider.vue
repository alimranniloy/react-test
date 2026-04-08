<template>
  <div
    v-if="brands && brands.length > 3"
    class="py-4 px-4 md:rounded-xl relative bg-[--success]"
  >
    <!-- <div id="firework-1" class="firework">
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
    </div> -->
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
    <div class="pb-4 flex justify-between">
      <div></div>
      <div class="text-center font-bold text-white">{{$t("nav.brand")}}</div>
      <router-link
        :to="`/brands`"
        class="flex items-center gap-1 text-gray-100 hover:text-gray-300 text-sm font-semibold"
      >
        <span>{{ $t("content.seeMore") }}</span>
        <ArrowRightIcon class="h-4 w-4"></ArrowRightIcon
      ></router-link>
    </div>
    <Flicking
      :key="'5'"
      :options="{
        align: 'prev',
        circular: true,
        circularFallback: 'bound',
        panelsPerView: perView,
      }"
      :plugins="brands && brands.length > 5 ? brandPlugin : []"
    >
      <div
        v-for="brand in brands"
        :key="brand.id"
        class="cursor-pointer bg-white rounded-2xl overflow-hidden flex flex-col justify-between mx-1"
      >
        <div class="bg-[#f8f7f5]">
          <router-link
            :to="`/brand/${brand.slug}/${brand.hid}/`"
            class="overflow-hidden"
          >
            <div class="p-2 relative">
              <img
                v-lazy="brand.image"
                alt="Product Image"
                class="object-cover w-full h-[100px] rounded-xl"
              />
            </div>
            <!-- <div class="pb-3 flex items-center justify-center">
              <h2 class="text-center text-sm font-regular text-[#21201f]">
                {{ locale == "en" ? brand.title : brand.translation }}
              </h2>
            </div> -->
          </router-link>
        </div>
      </div>
    </Flicking>
  </div>
</template>

<script setup>
import { AutoPlay } from "@egjs/flicking-plugins";
import { computed, ref, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useBrandStore } from "@/stores/brand";
import { ArrowRightIcon } from "@heroicons/vue/24/outline";
const Flicking = defineAsyncComponent(() => import("@egjs/vue3-flicking"));
const brandPlugin = ref([
  new AutoPlay({ duration: 2000, direction: "NEXT", stopOnHover: true }),
]);
const { site } = storeToRefs(useSiteStore());
const { brands } = storeToRefs(useBrandStore());
const { getBrands } = useBrandStore();
if (brands.value.length == 0) {
  getBrands(
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
const perView = computed(() => {
  let result;
  if (window.document.body.clientWidth < 640) {
    return (result = 3);
  } else if (window.document.body.clientWidth < 768) {
    return (result = 4);
  } else if (window.document.body.clientWidth < 1024) {
    return (result = 5);
  } else if (window.document.body.clientWidth < 1280) {
    return (result = 6);
  } else {
    return (result = 7);
  }
});
</script>

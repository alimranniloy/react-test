<template>
  <main class="sm:px-0 pb-[60px] pt-16 md:pt-10">
    <div class="max-w-screen-2xl mx-auto sm:px-4 flex pb-5 bg-white rounded-lg">
      <div
        class="w-full md:overflow-hidden md:mt-4"
        :class="
          [1].includes(site.industry)
            ? 'md:w-9/12 md:max-w-[1120px]'
            : 'md:w-full'
        "
        v-if="page"
      >
        <div class="max-w-6xl mx-auto px-4 py-8 pb-4 bg-white md:rounded-xl">
          <h2 class="font-bold text-xl sm:text-xl text-gray-600 text-center">
            {{ page.title }}
          </h2>
          <div class="mt-5">
            <Editor
              ref="pageDescription"
              :editorId="'page_' + page.id"
              :html="page.html"
              :key="page.id"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- modal -->
  </main>
</template>
<script>
export default {
  name: "PageDetails",
};
</script>
<script setup>
import { useRouter } from "vue-router";
import { ref, watch, defineAsyncComponent } from "vue";
import { SITE_PAGE_BY_SLUG } from "@/gql/page";
import { useQuery } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const Editor = defineAsyncComponent(() => import("@/components/Editor.vue"));
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
const page = ref(null);
if (
  router.currentRoute.value.params.slug &&
  router.currentRoute.value.name == "PageDetails"
) {
  const { onResult, loading, error, refetch } = useQuery(SITE_PAGE_BY_SLUG, {
    siteId: site.value.id,
    slug: router.currentRoute.value.params.slug,
  });
  onResult((queryResult) => {
    page.value = queryResult.data.sitePageBySlug;
  });
  watch(router.currentRoute, () => {
    if (
      router.currentRoute.value.params.slug &&
      router.currentRoute.value.name == "PageDetails"
    ) {
      refetch({
        siteId: site.value.id,
        slug: router.currentRoute.value.params.slug,
      });
    }
  });
}
</script>

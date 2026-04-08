<script setup>
import { onMounted, ref, computed, defineAsyncComponent, inject } from "vue";
import * as t from "@rekajs/types";
import { useRouter } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { SITE_PAGE_PREVIEW_BY_SLUG } from "@/gql/page";

const router = useRouter();
const reka = inject("reka");

// Default empty schema fallback
const defaultCode = {
  id: "8XiNJfu17xIyZv72eLrGp",
  type: "State",
  program: {
    id: "xJlB9rThOjPCJIoNbNgfP",
    meta: {},
    type: "Program",
    globals: [],
    components: [
      {
        id: "2qZpj1rxpdYtxJrTUNF7L",
        meta: {},
        name: "App",
        type: "RekaComponent",
        props: [],
        state: [],
        template: {
          id: "RSZCZ69SdTB6WsF8ArT22",
          if: null,
          tag: "div",
          each: null,
          meta: {},
          type: "TagTemplate",
          props: {
            className: {
              id: "6Dc6vkQSZwkVn9E2XiCEU",
              meta: {},
              type: "Literal",
              value: "w-full min-h-screen flex items-center justify-center bg-gray-50",
            },
          },
          children: [],
          classList: null,
        },
      },
    ],
  },
  extensions: {},
};

const code = ref(defaultCode);
let loaded = false;

const load = async () => {
  if (loaded) return;
  loaded = true;
  try {
    const schema = t.Schema.fromJSON(code.value);
    reka.value.load(schema);
    reka.value.createFrame({
      id: "App",
      component: { name: "App" },
    });
  } catch (err) {
    console.error("[site-app/Page] Failed to load schema:", err);
  }
};

const Preview = defineAsyncComponent(() => import("@/views/Preview.vue"));

onMounted(() => {
  if (process.env.NODE_ENV === "production") {
    // In production the server injects the page schema into the page-specific
    // <script type="application/json"> tag
    const scriptTag = document.querySelector("script[type='application/json']");
    if (scriptTag && scriptTag.textContent.trim()) {
      try {
        const parsed = JSON.parse(scriptTag.textContent.trim());
        if (parsed && parsed.type === "State") {
          code.value = parsed;
        }
      } catch (e) {
        console.warn("[site-app/Page] Could not parse schema from script tag:", e);
      }
    }
    load();
  } else {
    // Development: get page schema by slug from GraphQL
    const slug = router.currentRoute.value.params.slug || "success";
    const { onResult } = useQuery(SITE_PAGE_PREVIEW_BY_SLUG, {
      siteId: 13789,
      slug: slug,
    });
    onResult((queryResult) => {
      if (queryResult.data?.sitePageBySlug?.schema) {
        code.value = queryResult.data.sitePageBySlug.schema;
      }
      load();
    });
  }
});
</script>

<template>
  <Preview v-for="frame in reka.frames" :key="frame.id" />
</template>

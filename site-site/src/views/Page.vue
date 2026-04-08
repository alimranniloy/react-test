<script setup>
import { onMounted, ref, computed, defineAsyncComponent, inject } from "vue";
import * as t from "@rekajs/types";
import { useRouter } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { SITE_PAGE_PREVIEW_BY_SLUG } from "@/gql/page";
const router = useRouter();
const reka = inject("reka");
const code = ref({
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
        state: [
        ],
        template: {
          id: "RSZCZ69SdTB6WsF8ArT22",
          if: null,
          tag: "div",
          each: null,
          meta: {},
          type: "TagTemplate",
          props: {
            style: {
              id: "OeZxd8WNAISVuyVYj2TWX",
              meta: {},
              type: "ObjectExpression",
              properties: {
                backgroundImage: {
                  id: "dkIeNxdpL1N3G6qKbX0v0",
                  meta: {},
                  type: "Literal",
                  value:
                    "linear-gradient(180deg, #FFB7B7 0%, #727272 100%), radial-gradient(60.91% 100% at 50% 0%, #FFD1D1 0%, #260000 100%), linear-gradient(127.43deg, #00FFFF 0%, #FFFFFF 100%), radial-gradient(100.22% 100% at 70.57% 0%, #FF0000 0%, #00FFE0 100%), linear-gradient(64.82deg, #DBFF00 0%, #3300FF 100%)",
                },
                backgroundBlendMode: {
                  id: "BkCMa0oHNVQFHOZDHOhjk",
                  meta: {},
                  type: "Literal",
                  value: "screen, overlay, color-burn, color-dodge, normal",
                },
              },
            },
            className: {
              id: "6Dc6vkQSZwkVn9E2XiCEU",
              meta: {},
              type: "Literal",
              value:
                "text-neutral-800 w-full h-full flex flex-col justify-center",
            },
          },
          children: [
          ],
          classList: null,
        },
      },
    ],
  },
  extensions: {},
});
const schema = computed(() => {
  return t.Schema.fromJSON(code.value);
});
const Preview = defineAsyncComponent(() => import("@/views/Preview.vue"));
const load = async () => {
  reka.value.load(schema.value);

  reka.value.createFrame({
    id: "App",
    component: {
      name: "App",
    },
  });
};
onMounted(() => {
  if (process.env.NODE_ENV === "production") {
    const scriptTag = document.querySelector("script[type='application/json']");
    if (scriptTag) {
      const jsonData = scriptTag.textContent; // Get the JSON content
      code.value = JSON.parse(jsonData); // Parse it into a JavaScript object
      load();
    }
  } else {
    const { onResult, loading, error } = useQuery(SITE_PAGE_PREVIEW_BY_SLUG, {
      siteId: 13789,
      slug: 'success',
    });
    onResult((queryResult) => {
      if (queryResult.data) {
        code.value = queryResult.data.sitePageBySlug.schema;
        load();
      }
    });
  }
});
</script>
<template>
  <Preview v-for="frame in reka.frames" :key="frame.id" />
</template>

<script setup>
import { onMounted, ref, computed, defineAsyncComponent, inject } from "vue";
import * as t from "@rekajs/types";
import { useQuery } from "@vue/apollo-composable";
import { SITE } from "@/gql/site";

const reka = inject("reka");

// Default empty schema — used as fallback if nothing loads
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
  if (loaded) return; // prevent double-loading
  loaded = true;
  try {
    const schema = t.Schema.fromJSON(code.value);
    reka.value.load(schema);
    reka.value.createFrame({
      id: "App",
      component: { name: "App" },
    });
  } catch (err) {
    console.error("[site-app] Failed to load schema:", err);
  }
};

const Preview = defineAsyncComponent(() => import("@/views/Preview.vue"));

onMounted(() => {
  if (process.env.NODE_ENV === "production") {
    // Production: schema is injected by the server into the first
    // <script type="application/json"> tag in the HTML
    const scriptTag = document.querySelector("script[type='application/json']");
    if (scriptTag && scriptTag.textContent.trim()) {
      try {
        const parsed = JSON.parse(scriptTag.textContent.trim());
        if (parsed && parsed.type === "State") {
          code.value = parsed;
        }
      } catch (e) {
        console.warn("[site-app] Could not parse schema from script tag:", e);
      }
    }
    load();
  } else {
    // Development: fetch from GraphQL
    const { onResult } = useQuery(SITE, {
      domain: window.location.host || "www.holygiftpage.com.bd",
    });
    onResult((queryResult) => {
      if (queryResult.data?.site?.schema) {
        code.value = queryResult.data.site.schema;
      }
      load();
    });
  }
});
</script>

<template>
  <Preview v-for="frame in reka.frames" :key="frame.id" />
</template>

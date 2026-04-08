<template>
  <div class="h-[56px] py-2 px-4 border-b">
    <div class="flex flex-1 items-center">
      <div class="flex flex-1 items-center">
        <router-link :to="`/`" class="inline-flex ">{{ isFull ? 'Bponi Site' : 'Open Editor'}}
        </router-link><button v-if="isFull" @click="toggleFull()"
          class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-non hover:bg-purple-200 text-xs py-2.5 px-2.5 [&amp;>svg]:w-6 [&amp;>svg]:h-6">
          <ArrowLongLeftIcon class="h-6 w-6 text-black" />
        </button>
      </div>
      <div class="site-layout-header-toolbar">
        <div class="flex items-center gap-2.5 max-sm:hidden">
          <span v-if="isFull"><button :disabled="!reka.canUndo()" @click="reka.undo()"
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-non hover:bg-purple-200 text-xs py-2.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4">
              <ArrowUturnLeftIcon class="h-4 w-4 text-neutral-600" />
            </button></span><span v-if="isFull"><button :disabled="!reka.canRedo()" @click="reka.redo()"
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-non hover:bg-purple-200 text-xs py-2.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4">
              <ArrowUturnRightIcon class="h-4 w-4 text-neutral-600" />
            </button></span>
          <div class="ml-2 flex gap-1">
            <button @click="toggleFull()"
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-non hover:bg-purple-200 text-xs py-2.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4">
              <ArrowsPointingOutIcon v-if="!isFull" class="h-4 w-4 text-neutral-600" />
              <ArrowsPointingInIcon v-else class="h-4 w-4 text-neutral-600" />
            </button>
            <button v-if="isFull" @click="isEditor ? (isEditor = false) : (isEditor = true)"
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none hover:bg-purple-200 text-xs py-2.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4">
              <CodeBracketIcon class="h-4 w-4 text-neutral-600" />
            </button>
          </div>
          <span v-if="isFull">
            <button v-if="page == 'site'" @click="saveSite()"
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-purple-100 text-purple-600 hover:bg-purple-200 text-xs py-2.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4">
              Save {{ page }}</button><button v-else-if="page == 'product'" @click="saveProduct()"
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-purple-100 text-purple-600 hover:bg-purple-200 text-xs py-2.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4">
              Save {{ page }}
            </button><button v-else-if="page == 'page'" @click="savePage()"
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-purple-100 text-purple-600 hover:bg-purple-200 text-xs py-2.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4">
              Save {{ page }}
            </button></span><span v-if="isFull"><button @click="togglePreview()"
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none border border-solid border-outline hover:bg-primary/10 hover:text-primary hover:border-transparent shadow-sm text-xs py-2.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4"
              :class="isPreview ? 'bg-purple-100 text-purple-600 ' : ''">
              <EyeSlashIcon v-if="isPreview" class="h-4 w-4 text-neutral-600" />
              <EyeIcon v-else class="h-4 w-4 text-neutral-600" />
            </button></span><span v-if="isFull"><a :href="`https://${site.domain}/${page == 'page' ? slug : ''}`"
              target="_blank"
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none border border-solid border-outline hover:bg-primary/10 hover:text-primary hover:border-transparent shadow-sm text-xs py-2.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4">
              <ArrowTopRightOnSquareIcon class="h-4 w-4 text-neutral-600" />
            </a></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject } from "vue";
import { storeToRefs } from "pinia";
import {
  EyeIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  CodeBracketIcon, ArrowLongLeftIcon,
  EyeSlashIcon, ArrowTopRightOnSquareIcon
} from "@heroicons/vue/24/outline";
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { cloneDeep } from "lodash";
import { SELF_STORE_PRODUCT_UPDATE } from "@/gql/storeProduct";
import { SELF_SITE_PAGE_UPDATE } from "@/gql/page";
import { SELF_SITE_UPDATE } from "@/gql/site";
import { usePageStore } from "@/stores/page";
import { useProductStore } from "@/stores/product";
import { useEditorStore } from "@/stores/editor";
import { useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "@/stores/notifications";
import * as t from "@rekajs/types";
import { useRouter } from "vue-router";
const router = useRouter();
const reka = inject("reka");
const { setLoading } = useSiteStore();
const { site } = storeToRefs(useSiteStore());
const { frameId, isEditor } = storeToRefs(useEditorStore());
const { me } = storeToRefs(useMeStore());
const { pageId, page: sitePage } = storeToRefs(usePageStore());
const { productId, product } = storeToRefs(useProductStore());
const { addNotification } = useNotificationsStore();
const isFull = ref(false);
const isPreview = ref(false);
const props = defineProps({
  page: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(["onFull", "onEditor", "onPreview"]);
const toggleFull = () => {
  isFull.value = !isFull.value;
  emit("onFull", isFull.value);
};
const togglePreview = () => {
  isPreview.value = !isPreview.value;
  emit("onPreview", isPreview.value);
};
const saveSite = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_SITE_UPDATE, {
    variables: {
      userId: me.value.id,
      siteId: site.value.id,
      desktopTheme: "app",
      schema: reka.value.toJSON(),
      siteInfo: "site",
      siteType: "site",
      theme: "app",
      isTheme: false,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfSiteUpdate) {
      // try {
      //   for (let frame of reka.value.frames) {
      //     reka.value.removeFrame(frame)
      //   }
      //   await reka.value.load(
      //     t.Schema.fromJSON(cloneDeep(response.data.selfSiteUpdate.schema))
      //   );
      //   for (let component of reka.value.state.program.components) {
      //     let existingFrame = reka.value.frames.find(
      //       (a) => a.id == component.name
      //     );
      //     if (existingFrame == undefined || existingFrame == null) {
      //       try {
      //         await reka.value.createFrame({
      //           id: component.name,
      //           name: component.name,
      //           component: component,
      //         });
      //       } catch (error) { }
      //     }
      //   }
      //   if (reka.value.frames[0]) {
      //     frameId.value = reka.value.frames[0].id;
      //   }
      // } catch (error) { }

      addNotification(
        { title: "Site info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "Page info", subTitle: error.message }, "error");
  }
};

const savePage = async () => {
  setLoading(true);
  console.log(sitePage)
  const { mutate, loading, error } = useMutation(SELF_SITE_PAGE_UPDATE, {
    variables: {
      userId: me.value.id,
      siteId: sitePage.value.siteId,
      id: pageId.value,
      schema: reka.value.toJSON(),
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfSitePageUpdate) {
      addNotification(
        { title: "Page info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "Page info", subTitle: error.message }, "error");
  }
};

const saveProduct = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_STORE_PRODUCT_UPDATE, {
    variables: {
      userId: me.value.id,
      siteId: product.value.siteId,
      id: productId.value,
      schema: reka.value.toJSON(),
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfStoreProductUpdate) {
      addNotification(
        { title: "Product info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "Page info", subTitle: error.message }, "error");
  }
}
</script>

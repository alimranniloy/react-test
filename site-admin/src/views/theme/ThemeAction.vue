<template>
  <main class="px-4 pb-[60px] pt-0">
    <div
      class="flex flex-col items-end justify-between p-2 pr-4 bg-white sm:flex-row sm:items-center border-x border-t rounded-t-md">
      <div class="hidden xl:block">
        <button @click="width = '23%'" type="button" class="px-4 py-2 text-xs text-gray-600 focus:outline-none"
          :class="width == '23%' ? 'bg-green-50 rounded-xl' : ''">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" width="100%" height="18px">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          xs</button><button @click="width = '43%'" type="button"
          class="px-4 py-2 text-xs text-gray-600 focus:outline-none"
          :class="width == '43%' ? 'bg-green-50 rounded-xl' : ''">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" width="100%" height="18px">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          sm</button><button @click="width = '52%'" type="button"
          class="px-4 py-2 text-xs text-gray-600 focus:outline-none"
          :class="width == '52%' ? 'bg-green-50 rounded-xl' : ''">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" width="100%" height="18px">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          md</button><button @click="width = '69%'" type="button"
          class="px-4 py-2 text-xs text-gray-600 focus:outline-none"
          :class="width == '69%' ? 'bg-green-50 rounded-xl' : ''">
          <svg class="text-2xl" xmlns="http://www.w3.org/2000/svg" width="100%" height="18px"
            preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9H4V7ZM2 19h20"></path>
          </svg>
          lg</button><button @click="width = '86%'" type="button"
          class="px-4 py-2 text-xs text-gray-600 focus:outline-none"
          :class="width == '86%' ? 'bg-green-50 rounded-xl' : ''">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" width="100%" height="18px">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
            </path>
          </svg>
          xl
        </button>
      </div>
      <div class="flex space-x-4 ml-auto">
        <router-link :to="`/theme/`"
          class="flex items-center px-3 py-2 space-x-2 text-gray-600  duration-300 transform border rounded-lg hover:bg-gray-100:bg-gray-700 focus:outline-none">
          <ArrowLeftIcon class="w-5 h-5"></ArrowLeftIcon>
          <span class="inline">Back</span>
        </router-link>
        <a target="_blank" :href="`https://${theme.hostname}.store.bponi.com`"
          class="flex items-center px-3 py-2 space-x-2 text-gray-600  duration-300 transform border rounded-lg hover:bg-gray-100:bg-gray-700 focus:outline-none">
          <LinkIcon class="w-5 h-5"></LinkIcon>
          <span class="inline">Full Preview</span>
        </a><button @click="clone()"
          class="flex items-center px-3 py-2 space-x-2 text-white  duration-300 transform border rounded-lg hover:bg-gray-100:bg-gray-700 bg-blue-500 focus:outline-none">
          <BookmarkIcon class="w-5 h-5"></BookmarkIcon>
          <span class="inline">Clone</span>
        </button>
      </div>
    </div>
    <div :key="width" class="flex flex-col flex-1 h-full">
      <div
        class="overflow-hidden relative z-0 flex bg-white border rounded-x-md rounded-b-md max-auto items-center justify-center">
        <iframe id="viewer" title="Viewer" style="--iframe-scale: 1" :style="{ width: width }" class=" h-[85vh] "
          :src="`https://${theme.hostname}.store.bponi.com`"></iframe>
      </div>
    </div>
  </main>
</template>
<script setup>
import { cloneDeep } from "lodash";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { SITE_SCHEMA_DETAILS, SELF_SITE_CREATE } from "@/gql/site";
import { useRouter } from "vue-router";
import { useNotificationsStore } from "@/stores/notifications";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { useThemeStore } from "@/stores/theme";
import { ArrowLeftIcon, BookmarkIcon, LinkIcon } from "@heroicons/vue/24/outline";
const { addNotification } = useNotificationsStore();
const { setLoading, setSite } = useSiteStore();
const router = useRouter();
const { me } = storeToRefs(useMeStore());
const { theme } = storeToRefs(useThemeStore());
const width = ref('100%');
const username = computed(() => {
  const randomNumber = Math.floor(Math.random() * (999999 - 10000 + 1)) + 1000;
  return (
    theme.value.hostname
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "") + randomNumber
  );
});
const create = async () => {
  const { onResult } = useQuery(SITE_SCHEMA_DETAILS, {
    id: theme.value.id,
  });
  onResult(async  (queryResult) => {
    if (queryResult.data) {

      let site = cloneDeep(queryResult.data.siteById);
      const { mutate } = useMutation(SELF_SITE_CREATE, {
        variables: {
          userId: me.value.id,
          address: '',
          country: 50,
          currency: theme.value.currency,
          desktopTheme: 'site',
          domain: username.value + ".site.bponi.com",
          email: me.value.email,
          guide: {},
          note: '',
          hostname: username.value
            .toLowerCase()
            .trim()
            .replace(/[^a-zA-Z0-9]/g, ""),
          industry: theme.value.industry,
          latitude: 0.0,
          longitude: 0.0,
          referCode: 'c',
          siteInfo: 'site',
          siteType: 'site',
          theme: 'app',
          schema: site.schema,
          phone: me.value.phone,
          title: theme.value.title + ' - Clone',
        },
      });
      try {
        const response = await mutate();
        if (response.data.selfSiteCreate) {
          router.push(`/`);
        }
        setLoading(false);
      } catch (error) {
        addNotification({ title: "Site info", subTitle: error.message }, "error");
      }
    }
  });

};

const clone = () => {
  create();
}
</script>

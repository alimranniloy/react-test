<template>
  <main 
    class="px-4 pb-[60px] pt-0"
  >
    <div class="space-y-8">
      <div>
        <h3 class="text-lg font-medium leading-6 text-gray-900">Page</h3>
        <p class="mt-1 text-sm text-gray-500">
          This information will be displayed publicly so be careful what you
          share.
        </p>
        <div
          v-if="actionType == 'ToolPageUpdate'"
          class="mt-4 mb-4 grid max-w-3xl grid-cols-1 gap-6 sm:px-0 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3"
        >
          <div class="space-y-6 lg:col-span-3 lg:col-start-1">
            <!-- Tabs -->
            <div class="lg:block">
              <div class="border-b border-gray-200">
                <nav class="overflow-x-auto -mb-px flex space-x-8">
                  <div
                    @click="toggleTab(tab.name)"
                    v-for="tab in tabs"
                    :key="tab.name"
                    :class="[
                      selectedTab == tab.name
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer active:cursor-wait',
                    ]"
                  >
                    {{ tab.name }}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="pageId && selectedTab == 'Overview'"
        class="mt-4 divide-y divide-gray-200"
      >
        <Editor :page="'page'" :schema="schema"></Editor>
      </div>
      <div v-else-if="selectedTab == 'General'">
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
            >
              <label
                for="title"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                >Title</label
              >
              <input
                v-model="title"
                type="text"
                name="title"
                id="title"
                autocomplete="off"
                class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                placeholder="Enter title"
              />
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <ExclamationCircleIcon
                  v-if="title.length < 3"
                  class="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
                <CheckCircleIcon
                  v-else
                  class="h-5 w-5 text-green-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div class="sm:col-span-3">
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
            >
              <label
                for="slug"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                >URL</label
              >
              <input
                v-model="slug"
                type="text"
                name="slug"
                id="slug"
                autocomplete="off"
                class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                placeholder="Enter url"
              />
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <ExclamationCircleIcon
                  v-if="slug.length < 3"
                  class="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
                <CheckCircleIcon
                  v-else
                  class="h-5 w-5 text-green-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div class="sm:col-span-6">
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
            >
              <label
                for="description"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                >Description</label
              >
              <textarea
                v-model.lazy.trim="description"
                type="text"
                name="description"
                id="description"
                autocomplete="off"
                rows="3"
                class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                placeholder="Enter short description"
              />
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <ExclamationCircleIcon
                  v-if="description.length < 3"
                  class="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
                <CheckCircleIcon
                  v-else
                  class="h-5 w-5 text-green-500"
                  aria-hidden="true"
                />
              </div>

              <p class="mt-2 text-sm text-gray-500">Write a few sentences.</p>
            </div>
          </div>
        </div>
        <div class="pt-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Status</h3>
          <p class="mt-1 text-sm text-gray-500">
            The details used to determine your category behaviour around the
            web.
          </p>
        </div>
        <div class="mt-2">
          <fieldset>
            <div class="mt-4 space-y-4">
              <div class="relative flex items-start">
                <div class="flex h-5 items-center">
                  <input
                    v-model="isActive"
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="isActive" class="font-medium text-gray-700"
                    >Active</label
                  >
                  <p class="text-gray-500">User can view and filter tools.</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div class="pt-5">
          <div class="flex justify-end">
            <router-link
              :to="`/tool/page`"
              type="button"
              class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2"
              >Cancel</router-link
            >
            <button
              v-if="
                actionType == 'ToolPageUpdate' 
              "
              @click="update()"
              type="submit"
              class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2"
            >
              Update</button
            ><button
              @click="create()"
              type="submit"
              class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2"
            >
              Save
            </button>
            <button
              v-if="
                actionType == 'ToolPageUpdate' 
              "
              @click="
                toggleAlert(
                  'Delete Page!',
                  'Are you sure you want to delete your page? All of your data will be permanently removed from our servers forever. This action cannot be undone.',
                  'error'
                )
              "
              type="submit"
              class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <Alert
      v-if="showAlert"
      :message="alertMessage"
      @confirmed="remove"
      @canceled="onCanceled"
    ></Alert>
  </main>
</template>
<script setup>
import Editor from "@/views/editor/Editor.vue";
import {
  SELF_SITE_PAGE_CREATE,
  SELF_SITE_PAGE_UPDATE,
  SELF_SITE_PAGE_DELETE,
  SITE_PAGE_PREVIEW,
} from "@/gql/page";
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import { computed, ref, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { usePageStore } from "@/stores/page";
import { useNotificationsStore } from "@/stores/notifications";
import Alert from "@/components/Alert.vue";
import { cloneDeep } from "lodash";
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
const { setLoading } = useSiteStore();
const { me } = storeToRefs(useMeStore());
const { pageId } = storeToRefs(usePageStore());
const { addNotification } = useNotificationsStore();
const { getPage, setPageId } = usePageStore();

const alertMessage = ref({});
const showAlert = ref(false);

const page = ref(null);
const description = ref("");
const html = ref({});
const index = ref("");
const isActive = ref(true);
const isExcludedFromSitemap = ref(true);
const isFooterHidden = ref(true);
const isNavHidden = ref(true);
const metaDescription = ref("");
const metaKeywords = ref("");
const metaTitle = ref("");
const schema = ref({});
const slug = ref("");
const title = ref("");

const actionType = computed(() => router.currentRoute.value.name);
if (actionType.value == "ToolPageUpdate" && pageId.value) {
  const { onResult, loading, error } = useQuery(SITE_PAGE_PREVIEW, {
    siteId: site.value.id,
    id: pageId.value,
  });
  onResult((queryResult) => {
    page.value = cloneDeep(queryResult.data.sitePage);
    console.log(page.value)
    description.value = page.value.description;
    isActive.value = page.value.isActive;
    isExcludedFromSitemap.value = page.value.isExcludedFromSitemap;
    isFooterHidden.value = page.value.isFooterHidden;
    isNavHidden.value = page.value.isNavHidden;
    metaDescription.value = page.value.metaDescription;
    metaKeywords.value = page.value.metaKeywords;
    metaTitle.value = page.value.metaTitle;
    schema.value = page.value.schema;
    html.value = page.value.html;
    slug.value = page.value.slug;
    title.value = page.value.title;
  });
}

const create = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_SITE_PAGE_CREATE, {
    variables: {
      userId: me.value.id,
      siteId: site.value.id,
      description: description.value,
      html: html.value,
      index: index.value,
      isActive: isActive.value,
      isExcludedFromSitemap: isExcludedFromSitemap.value,
      isFooterHidden: isFooterHidden.value,
      isNavHidden: isNavHidden.value,
      metaDescription: metaDescription.value,
      metaKeywords: metaKeywords.value,
      metaTitle: metaTitle.value,
      schema: schema.value,
      slug: slug.value,
      title: title.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfSitePageCreate) {
      addNotification(
        { title: "Page info", subTitle: "Successfully updated new data." },
        "success"
      );
      setPageId(response.data.selfSitePageCreate.id);
      router.push(`/site/update/`);
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "Page info", subTitle: error.message }, "error");
  }
};
const update = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_SITE_PAGE_UPDATE, {
    variables: {
      userId: me.value.id,
      siteId: site.value.id,
      id: pageId.value,
      description: description.value,
      html: html.value,
      index: index.value,
      isActive: isActive.value,
      isExcludedFromSitemap: isExcludedFromSitemap.value,
      isFooterHidden: isFooterHidden.value,
      isNavHidden: isNavHidden.value,
      metaDescription: metaDescription.value,
      metaKeywords: metaKeywords.value,
      metaTitle: metaTitle.value,
      schema: schema.value,
      slug: slug.value,
      title: title.value,
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
const remove = async () => {
  const { mutate, loading, error } = useMutation(SELF_SITE_PAGE_DELETE, {
    variables: {
      userId: me.value.id,
      siteId: site.value.id,
      id: pageId.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfSitePageDelete) {
      addNotification(
        { title: "Page info", subTitle: "Successfully updated new data." },
        "success"
      );
      router.push(`/site/update/`);
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "Page info", subTitle: error.message }, "error");
    setLoading(false);
  }
};
const selectedTab = ref("General");
const tabs = [ { name: "General" },{ name: "Overview" },];
const toggleTab = (name) => {
  selectedTab.value = name;
};

const toggleAlert = (title, message, type) => {
  alertMessage.value = {
    title: title,
    message: message,
    type: type,
  };
  showAlert.value = true;
};

const onCanceled = () => {
  showAlert.value = false;
};
</script>

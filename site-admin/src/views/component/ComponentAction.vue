<template>
  <main class="px-4 pb-[60px] pt-0">
    <div class="space-y-8">
      <div>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Component</h3>
          <button v-if="id" @click="close()"
            class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2 flex items-center justify-between">
            Close
            <ChevronUpIcon class="w-6 h-6 ml-2" />
          </button>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          This information will be displayed publicly so be careful what you
          share.
        </p>
      </div>
      <div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label for="title"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Title</label>
              <input v-model="title" type="text" name="title" id="title" autocomplete="off"
                class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                placeholder="Enter title" />
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon v-if="title.length < 3" class="h-5 w-5 text-red-500" aria-hidden="true" />
                <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div class="sm:col-span-2">
            <Listbox as="div" class="relative" v-model="selectedCategory">
              <ListboxLabel
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900 z-10">
                Category</ListboxLabel>
              <div class="relative">
                <ListboxButton
                  class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-3 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
                  <span class="flex items-center">
                    <span class="block truncate">{{
                      selectedCategory.title
                      }}</span>
                  </span>
                  <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>

                <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                  leave-to-class="opacity-0">
                  <ListboxOptions
                    class="absolute z-40 mt-1 max-h-56 w-full overflow-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <ListboxOption as="template"
                      v-for="category in componentCategories.sort((a, b) => a.priority - b.priority)" :key="category.id"
                      :value="category" v-slot="{ active, selected }">
                      <li :class="[
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                      ]">
                        <div class="flex items-center">
                          <span :class="[
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate',
                          ]">{{ category.title }}</span>
                        </div>

                        <span v-if="selected" :class="[
                          active ? 'text-white' : 'text-indigo-600',
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                        ]">
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>
          <div class="sm:col-span-1">
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label for="priority"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Priority</label>
              <input v-model.number="priority" type="number" name="priority" id="priority" autocomplete="off"
                class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                placeholder="Enter priority" />
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon v-if="priority == 0" class="h-5 w-5 text-red-500" aria-hidden="true" />
                <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div class="sm:col-span-6">
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label for="componentData"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Component
                Data</label>
              <textarea v-model="componentData" type="text" name="componentData" id="componentData" autocomplete="off"
                class="block w-full min-h-[400px] border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                placeholder="Enter componentData" />
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon v-if="componentData.length < 3" class="h-5 w-5 text-red-500"
                  aria-hidden="true" />
                <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div class="sm:col-span-6">
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label for="description"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Image</label>
              <file-pond class="bg-white pt-4 px-2" :files="files" @onAdded="onAdded" />
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
                  <input v-model="isActive" id="isActive" name="isActive" type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                </div>
                <div class="ml-3 text-sm">
                  <label for="isActive" class="font-medium text-gray-700">Active</label>
                  <p class="text-gray-500">
                    User can view and filter products.
                  </p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div class="pt-5">
          <div class="flex justify-end">
            <router-link @click="close()" :to="`/component`" type="button"
              class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2">Cancel</router-link>
            <button v-if="
                actionType == 'ComponentUpdate'" @click="update()" type="submit"
              class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2">
              Update</button><button v-else @click="create()" type="submit"
              class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2">
              Save
            </button>
            <button v-if="
                actionType == 'ComponentUpdate'
              " @click="
                toggleAlert(
                  'Delete Component!',
                  'Are you sure you want to delete your component? All of your data will be permanently removed from our servers forever. This action cannot be undone.',
                  'error'
                )
              " type="submit"
              class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <Alert v-if="showAlert" :message="alertMessage" @confirmed="remove" @canceled="onCanceled"></Alert>
  </main>
</template>
<script setup>
import {
  SELF_SITE_COMPONENT_CREATE,
  SELF_SITE_COMPONENT_UPDATE,
  SELF_SITE_COMPONENT_DELETE,
  SITE_COMPONENT,
} from "@/gql/site";
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronUpDownIcon, ChevronUpIcon
} from "@heroicons/vue/24/outline";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { computed, ref, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMeStore } from "@/stores/me";
import { useComponentStore } from "@/stores/component";
import { useNotificationsStore } from "@/stores/notifications";
const { addNotification } = useNotificationsStore();
const FilePond = defineAsyncComponent(() =>
  import("@/components/FilePond.vue")
);
const Alert = defineAsyncComponent(() =>
  import("@/components/Alert.vue")
);
const router = useRouter();
const { componentId, components, componentCategories } = storeToRefs(useComponentStore());
const { getComponents, getComponentCategories } = useComponentStore();
const { me } = storeToRefs(useMeStore());

if (componentCategories.value.length == 0) {
  getComponentCategories();
}
const selectedCategory = ref({
  title: "Category",
  id: null,
});
const categoryId = ref(1);
const component = ref("");
const componentData = ref({});
const description = ref("");
const image = ref(null);
const isActive = ref(true);
const priority = ref(0);
const settings = ref({});
const slug = ref("");
const title = ref("");

const files = ref([]);
const alertMessage = ref({});
const showAlert = ref(false);

const props = defineProps({
  id: {
    type: Number,
    required: false,
  },
});
const actionType = computed(() =>
  props.id ? "ComponentUpdate" : router.currentRoute.value.name
);
if (actionType.value == "ComponentUpdate" && componentId.value) {
  const { onResult, loading, error } = useQuery(SITE_COMPONENT, {
    id: props.id ? props.id : componentId.value,
  });
  onResult((queryResult) => {
    let item = queryResult.data.siteComponent;
    categoryId.value = item.categoryId;
    component.value = item.component;
    componentData.value = JSON.stringify(item.componentData);
    description.value = item.description;
    image.value = null;
    isActive.value = item.isActive;
    priority.value = item.priority;
    slug.value = item.slug;
    title.value = item.title;
    files.value = [item.image];
    // 
    let found = componentCategories.value.find(c => c.id == item.categoryId);
    if (found) {
      selectedCategory.value = found;
    }
  });
}

const onAdded = (file) => {
  if (
    files.value.length > 0 &&
    files.value[0].split("/")[files.value[0].split("/").length - 1] == file.name
  ) {
    image.value = null;
  } else {
    const maxSizeInBytes = 3 * 1024 * 1024; // Specify the maximum file size in bytes (e.g., 10MB)
    if (file && file.size <= maxSizeInBytes && files.value[0] != file.name) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        image.value = file;
      };
    } else {
      addNotification(
        {
          title: "Product info",
          subTitle: "File size exceeds the maximum (3 MB) allowed limit.",
        },
        "error"
      );
    }
  }
};

const create = async () => {
  const { mutate, loading, error } = useMutation(SELF_SITE_COMPONENT_CREATE, {
    variables: {
      userId: me.value.id,
      categoryId: selectedCategory.value.id ? selectedCategory.value.id : categoryId.value,
      component: component.value,
      componentData: JSON.parse(componentData.value),
      description: description.value,
      image: image.value,
      isActive: isActive.value,
      priority: priority.value,
      settings: settings.value,
      slug: slug.value,
      title: title.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfSiteComponentCreate) {
      addNotification(
        { title: "Component info", subTitle: "Successfully updated new data." },
        "success"
      );
      componentId.value = response.data.selfSiteComponentCreate.id;
      router.push(`/component/update/`);
    }
  } catch (error) {
    addNotification({ title: "Component info", subTitle: error.message }, "error");
  }
};
const update = async () => {
  const { mutate, loading, error } = useMutation(SELF_SITE_COMPONENT_UPDATE, {
    variables: {
      userId: me.value.id,
      componentId: componentId.value,
      categoryId: selectedCategory.value.id ? selectedCategory.value.id : categoryId.value,
      component: component.value,
      componentData: JSON.parse(componentData.value),
      description: description.value,
      image: image.value,
      isActive: isActive.value,
      priority: priority.value,
      settings: settings.value,
      slug: slug.value,
      title: title.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfSiteComponentUpdate) {
      addNotification(
        { title: "Component info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
  } catch (error) {
    addNotification({ title: "Component info", subTitle: error.message }, "error");
  }
};
const remove = async () => {
  const { mutate, loading, error } = useMutation(SELF_SITE_COMPONENT_DELETE, {
    variables: {
      userId: me.value.id,
      componentId: componentId.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfSiteComponentDelete) {
      addNotification(
        { title: "Component info", subTitle: "Successfully updated new data." },
        "success"
      );
      router.push(`/component/`);
    }
  } catch (error) {
    addNotification({ title: "Component info", subTitle: error.message }, "error");
  }
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
onMounted(() => {
  if (props.id) {
    componentId.value = props.id;
  }
});
const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};
</script>

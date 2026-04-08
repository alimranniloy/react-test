<template>
  <section class="-mx-4">
    <div class="py-2 pb-4 px-4 h-full">
      <div v-for="(item, index) in values" :key="index">
        <div v-if="item['id'] == 'src' && templateTitle == 'img' && item.value instanceof t.Literal"
          class="mb-4 border rounded-md p-3">
          <div class="flex w-full text-center mb-4 rounded-md overflow-hidden">
            <div v-for="item in tabs" :key="item.id" @click="selectedTab = item.title"
              class="px-3 py-2 text-xs cursor-pointer w-full" :class="item.title === selectedTab
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50'
                ">
              {{ item.title }}
            </div>
          </div>
          <div v-show="selectedTab === 'Images'">
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 h-[200px] overflow-auto">
              <div @click="update(item, file.node.url)" v-for="file in files.edges" :key="file.node.id" :class="file.node.id == selectedImage
                ? 'border-[2px] border-blue-500'
                : 'border-[2px] border-white'
                " class="cursor-pointer">
                <img class="object-cover object-center w-full h-10 max-w-full" v-lazy="file.node.url"
                  alt="gallery-photo" />
              </div>
            </div>
            <div v-if="selectedImage" class="flex gap-3 mt-3 w-full text-center">
              <div @click="remove(selectedImage)"
                class="px-3 py-1 text-xs cursor-pointer w-full bg-red-500 text-white rounded-md">
                delete
              </div>
              <div @click="create()" class="px-3 py-1 text-xs cursor-pointer w-full bg-blue-500 text-white rounded-md">
                upload
              </div>
            </div>
          </div>
          <div v-show="selectedTab === 'New Image'">
            <div
              class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label for="file"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">File</label>
              <file-pond class="bg-white pt-4 px-2" :files="uploadedFiles" :code="''" :isQr="false" :isBarcode="false"
                :accepted="'image/*, video/*, application/pdf'" @onAdded="onAdded" />
            </div>
            <div v-if="obj" class="flex gap-3 mt-3 w-full text-center">
              <div @click="uploadedFiles = []"
                class="px-3 py-1 text-xs cursor-pointer w-full bg-gray-50 border text-black rounded-md">
                cancel
              </div>
              <div @click="create()" class="px-3 py-1 text-xs cursor-pointer w-full bg-blue-500 text-white rounded-md">
                upload
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="item.value instanceof t.Literal"
          class="relative rounded-md border border-gray-300 px-3 py-3 mb-4 ">
          <label for="description"
            class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
            {{ startCase(JSON.stringify(item["id"])?.replace(/[0-9]/g, "")) }}
          </label>
          <textarea :value="item['value']['value']" @keyup="update(item, $event.target.value)
            " type="text" name="description" id="description" autocomplete="off" rows="2"
            class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
            :placeholder="valuePlaceholder" />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import * as t from "@rekajs/types";
import { ref, inject, computed, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { startCase } from "lodash";
import {
  FILE_FILES,
  SELF_FILE_FILE_CREATE,
  SELF_FILE_FILE_DELETE,
} from "@/gql/file";
import { storeToRefs } from "pinia";
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { useEditorStore } from "@/stores/editor";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "@/stores/notifications";
import { useFileStore } from "@/stores/file";
const { templateId } = storeToRefs(useEditorStore());
const FilePond = defineAsyncComponent(() =>
  import("@/components/FilePond.vue")
);
const reka = inject("reka");
const tabs = [
  { id: 1, title: "Images" },
  { id: 2, title: "New Image" },
];
const selectedTab = ref("Images");
const { me } = storeToRefs(useMeStore());
const { setLoading } = useSiteStore();
const { addNotification } = useNotificationsStore();
const { getFile, setFileId } = useFileStore();
const template = computed(() => {
  return reka.value.getNodeFromId(templateId.value);
});
const templateTitle = computed(() => {
  if (template.value == null) {
    return "Template";
  } else if (template.value instanceof t.ComponentTemplate) {
    return template.value.component.name;
  } else if (template.value instanceof t.TagTemplate) {
    return template.value.tag;
  } else if (template.value instanceof t.SlotTemplate) {
    return "Slot";
  } else {
    return "Template";
  }
});
const emit = defineEmits(["onChange"]);
const update = (item, data) => {
  emit("onChange", item.id, t.literal({
    value: data,
  }));

}
const title = ref("");
const url = ref(null);
const mimeType = ref("");
const obj = ref(null);
const size = ref(0);
const uploadedFiles = ref([]);
const selectedImage = ref(null);
const props = defineProps({
  addingNewField: {
    type: Boolean,
    required: true,
  },
  emptyValuesText: {
    type: String,
    required: true,
  },
  allowPropBinding: {
    type: Boolean,
    required: true,
  },
  values: {
    type: Array,
    required: true,
  },
  idPlaceholder: {
    type: String,
    required: true,
  },
  valuePlaceholder: {
    type: String,
    required: true,
  },
});

const { result, refetch } = useQuery(FILE_FILES, {
  userId: me.value.id,
  first: 15,
  after: null,
});

const files = computed(() => result.value?.fileFiles ?? { edges: [] });
const onAdded = async (file) => {
  size.value = file.size;
  if (
    uploadedFiles.value.length > 0 &&
    uploadedFiles.value[0].split("/")[
    uploadedFiles.value[0].split("/").length - 1
    ] == file.name
  ) {
    obj.value = null;
  } else {
    if (isImage(file.name)) {
      const maxSizeInBytes = 500 * 1024 * 1024; // Specify the maximum file size in bytes (e.g., 10MB)
      if (
        file &&
        file.size <= maxSizeInBytes &&
        uploadedFiles.value[0] != file.name
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          obj.value = file;
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
      url.value = file.name;
    } else {
      const filename = file.type.includes("video")
        ? "video/" +
        rndStr(15) +
        "." +
        file.name.split(".")[file.name.split(".").length - 1]
        : "file/" +
        rndStr(15) +
        "." +
        file.name.split(".")[file.name.split(".").length - 1];

      await uploadByS3(filename, file);
      url.value = filename;
    }
  }
};

const create = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_FILE_FILE_CREATE, {
    variables: {
      userId: me.value.id,
      file: obj.value,
      mimeType: mimeType.value,
      size: size.value,
      title: title.value,
      url: url.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfFileFileCreate) {
      selectedTab.value = "Images";
      refetch();
      addNotification(
        { title: "File info", subTitle: "Successfully updated new data." },
        "success"
      );
      setFileId(response.data.selfFileFileCreate.id);
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "File info", subTitle: error.message }, "error");
  }
};
const remove = async (imageId) => {
  const { mutate, loading, error } = useMutation(SELF_FILE_FILE_DELETE, {
    variables: {
      userId: me.value.id,
      id: imageId,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfFileFileDelete) {
      refetch();
      addNotification(
        { title: "File info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "File info", subTitle: error.message }, "error");
    setLoading(false);
  }
};

const isImage = (filename) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"]; // Add more extensions if needed
  const fileExtension = filename.split(".").pop().toLowerCase();
  return imageExtensions.includes(`.${fileExtension}`);
};
</script>

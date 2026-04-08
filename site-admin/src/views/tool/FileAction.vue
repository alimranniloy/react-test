<template>
  <main
   
    class="px-4 pb-[60px] pt-0 md:pt-0 sm:pb-4"
  >
    <div class="space-y-8">
      <div v-if="!isBulk">
        <h3 class="text-lg font-medium leading-6 text-gray-900">File</h3>
        <p class="mt-1 text-sm text-gray-500">
          This information will be displayed publicly so be careful what you
          share.
        </p>
        <div
          v-if="actionType == 'ToolFileUpdate'"
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
      <div v-show="selectedTab == 'Overview'">
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-6">
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

          <div class="sm:col-span-6">
            <div
              v-if="progress > 0"
              class="w-full bg-gray-200 rounded-full dark:bg-gray-700 my-3"
            >
              <div
                class="bg-green-400 text-xs font-medium text-gray-100 text-center p-1 leading-none rounded-full"
                :style="`width: ${progress}%`"
              >
                {{ progress }}% - {{ formatBytes(uploaded) }}
              </div>
            </div>
            <div
              v-if="
                actionType == 'ToolFileUpdate' &&
                fileFile &&
                (fileFile.url.includes('.mp4') ||
                  fileFile.url.includes('.m3u8'))
              "
              class="mt-2 mb-4 rounded-xl sm:col-span-6"
            >
              <video
                ref="videoPlayer"
                class="w-full rounded-xl"
                data-plyr-config="plyrConfig"
                :poster="video.img"
              ></video>
              <div class="p-2 mt-2 bg-green-400 text-white">
                {{ video.title }}
              </div>
            </div>
            <div
              v-else
              class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
            >
              <label
                for="file"
                class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                >File</label
              >
              <file-pond
                class="bg-white pt-4 px-2"
                :files="files"
                :code="''"
                :isQr="false"
                :isBarcode="false"
                :accepted="'image/*, video/*, application/pdf'"
                @onAdded="onAdded"
              />
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <ExclamationCircleIcon
                  v-if="url == ''"
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
        </div>
        <div class="pt-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Status</h3>
          <p class="mt-1 text-sm text-gray-500">
            The details used to determine your category behaviour around the
            web.
          </p>
        </div>
        <div class="pt-5">
          <div class="flex justify-end">
            <!-- <button
              v-if="
                actionType == 'ToolFileUpdate' &&
                fileFile &&
                fileFile.url.includes('.mp4')
              "
              @click="createHls()"
              type="submit"
              class="mr-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2"
            >
              HLS
            </button> -->
            <router-link
              :to="`/tool/file`"
              type="button"
              class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2"
              >Cancel</router-link
            >
            <button
              v-if="
                actionType == 'ToolFileUpdate' 
              "
              @click="update()"
              type="submit"
              class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2"
            >
              Update</button
            ><button
              v-else
              @click="create()"
              type="submit"
              class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2"
            >
              Save
            </button>
            <button
              v-if="
                actionType == 'ToolFileUpdate' 
              "
              @click="
                toggleAlert(
                  'Delete File!',
                  'Are you sure you want to delete your file? All of your data will be permanently removed from our servers forever. This action cannot be undone.',
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
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css"; // Import Plyr styles
import { UAParser } from "ua-parser-js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { XhrHttpHandler } from "@aws-sdk/xhr-http-handler";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";

import {
  SELF_FILE_FILE_CREATE,
  SELF_FILE_FILE_UPDATE,
  SELF_FILE_FILE_DELETE,
  FILE_FILE_PREVIEW,
  SELF_HOME_GCP_TOKEN_CREATE,
  SELF_FILE_FILE_CREATE_URL,
  SELF_FILE_FILE_VIDEO_MP4_TO_M3U8,
} from "@/gql/file";
const FilePond = defineAsyncComponent(() =>
  import("@/components/FilePond.vue")
);
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import { computed, ref, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useFileStore } from "@/stores/file";
import { useNotificationsStore } from "@/stores/notifications";
const Editor = defineAsyncComponent(() =>
  import("@/components/Editor.vue")
);
const Alert = defineAsyncComponent(() =>
  import("@/components/Alert.vue")
);
import { cloneDeep } from "lodash";
const router = useRouter();
const { site, dok, doak, doe } = storeToRefs(useSiteStore());
const { setLoading } = useSiteStore();
const { me } = storeToRefs(useMeStore());
const { fileId } = storeToRefs(useFileStore());
const { addNotification } = useNotificationsStore();
const { getFile, setFileId } = useFileStore();

const props = defineProps({
  isBulk: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const alertMessage = ref({});
const showAlert = ref(false);

const progress = ref(0);
const uploaded = ref(0);

const title = ref("");
const url = ref(null);
const mimeType = ref("");
const obj = ref(null);
const size = ref(0);

const fileFile = ref(null);
const files = ref([]);
const token = ref(null);

const actionType = computed(() => router.currentRoute.value.name);
if (actionType.value == "ToolFileUpdate" && fileId.value) {
  const { onResult, loading, error } = useQuery(FILE_FILE_PREVIEW, {
    userId: me.value.id,
    id: fileId.value,
  });
  onResult((queryResult) => {
    fileFile.value = cloneDeep(queryResult.data.fileFile);
    title.value = fileFile.value.title;
    size.value = fileFile.value.size;
    files.value = [fileFile.value.url.replace("bponi/bponi", "bponi")];
    //url.value = file.url.replace('bponi/bponi', 'bponi');
    if (
      fileFile.value.url.includes(".mp4") ||
      fileFile.value.url.includes(".m3u8")
    ) {
      selectVideo(fileFile.value);
    }
  });
}

const rndStr = (len) => {
  let text = "";
  let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < len; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
};
const onAdded = async (file) => {
  size.value = file.size;
  if (
    files.value.length > 0 &&
    files.value[0].split("/")[files.value[0].split("/").length - 1] == file.name
  ) {
    obj.value = null;
  } else {
    if (isImage(file.name)) {
      const maxSizeInBytes = 500 * 1024 * 1024; // Specify the maximum file size in bytes (e.g., 10MB)
      if (file && file.size <= maxSizeInBytes && files.value[0] != file.name) {
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
      addNotification(
        { title: "File info", subTitle: "Successfully updated new data." },
        "success"
      );
      setFileId(response.data.selfFileFileCreate.id);
      router.push(`/tool/file/update/`);
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "File info", subTitle: error.message }, "error");
  }
};
const update = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_FILE_FILE_UPDATE, {
    variables: {
      userId: me.value.id,
      id: fileId.value,
      file: obj.value,
      mimeType: mimeType.value,
      size: size.value,
      title: title.value,
      url: url.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfFileFileUpdate) {
      addNotification(
        { title: "File info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "File info", subTitle: error.message }, "error");
  }
};
const remove = async () => {
  const { mutate, loading, error } = useMutation(SELF_FILE_FILE_DELETE, {
    variables: {
      userId: me.value.id,
      id: fileId.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfFileFileDelete) {
      addNotification(
        { title: "File info", subTitle: "Successfully updated new data." },
        "success"
      );
      router.push(`/tool/file/`);
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "File info", subTitle: error.message }, "error");
    setLoading(false);
  }
};

const createHls = async () => {
  //setLoading(true);
  const { mutate, loading, error } = useMutation(
    SELF_FILE_FILE_VIDEO_MP4_TO_M3U8,
    {
      variables: {
        userId: me.value.id,
        input: fileFile.value.url,
      },
    }
  );
  try {
    const response = await mutate();
    if (response.data.selfFileFileVideoMp4ToM3U8) {
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
const selectedTab = ref("Overview");
const tabs = [{ name: "Overview" }];
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
onMounted(async () => {
  // const parser = new UAParser();
  // console.log(parser.getResult());
  // const { mutate, loading, error } = useMutation(SELF_HOME_GCP_TOKEN_CREATE, {
  //   variables: {
  //     userId: me.value.id,
  //     scope: "https://www.googleapis.com/auth/devstorage.full_control",
  //   },
  // });
  // try {
  //   const response = await mutate();
  //   if (response.data.selfHomeGcpTokenCreate) {
  //     token.value = response.data.selfHomeGcpTokenCreate;
  //   }
  // } catch (error) {
  //   token.value = null;
  // }
});
const formatBytes = (bytes) => {
  if (bytes < 1024) {
    return bytes.toFixed(2) + " B";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
};

const uploadByS3 = async (filename, file) => {
  // const bucketName = "bponi";
  // const contentType = file.type;
  // const s3Client = new S3Client({
  //   endpoint: "https://sgp1.digitaloceanspaces.com",
  //   forcePathStyle: false,
  //   region: "sgp1",
  //   credentials: {
  //     accessKeyId: dok.value,
  //     secretAccessKey: doak.value,
  //   },
  //   requestHandler: new XhrHttpHandler({}),
  // });
  // const params = {
  //   Bucket: bucketName,
  //   Key: "bponi/" + filename,
  //   Body: file,
  //   ACL: "public-read",
  //   ContentType: contentType,
  //   Metadata: {
  //     "Access-Control-Allow-Origin": "*",
  //   },
  // };
  // const upload = new Upload({
  //   client: s3Client,
  //   params: params,
  // });
  // upload.on("httpUploadProgress", (event) => {
  //   const p = (event.loaded / event.total) * 100;
  //   progress.value = Math.round(p);
  //   uploaded.value = event.loaded;
  // });
  // await upload.done();

  const { mutate, loading, error } = useMutation(SELF_FILE_FILE_CREATE_URL, {
    variables: {
      userId: me.value.id,
      filename: filename,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfFileFileCreateUrl) {
      // Upload at URL
      let url = response.data.selfFileFileCreateUrl;
      await axios.put(url, file, {
        headers: {
          "x-amz-acl": "public-read",
          "x-amz-meta-access-control-allow-origin": "*",
          "Content-Type": file.type,
        },
        onUploadProgress: (e) => {
          //  Show progress
          progress.value = Math.round((e.loaded * 100) / e.total);
          uploaded.value = e.loaded;
        },
      });
    }
  } catch (error) {
    token.value = null;
  }
};

const uploadByGcs = async (filename, file) => {
  const reader = new FileReader();
  const bucketName = "bponi";
  reader.addEventListener("load", async (event) => {
    const bytes = event.target.result;

    const xhr = new XMLHttpRequest();
    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${filename}`;

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const p = (event.loaded / event.total) * 100;
        progress.value = Math.round(p);
        uploaded.value = event.loaded;
      }
    };

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          if (result.mediaLink) {
            addNotification(
              {
                title: "File info",
                subTitle: "Successfully updated new data.",
              },
              "success"
            );
            url.value = filename;
            obj.value = null;
            create();
          } else {
            addNotification(
              { title: "File info", subTitle: "Failed to upload." },
              "error"
            );
          }
        } else {
          addNotification(
            { title: "File info", subTitle: "Failed to upload." },
            "error"
          );
        }
      }
    };
    xhr.open("POST", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("Authorization", token.value);
    xhr.send(new Blob([bytes], { type: contentType }));
  });

  reader.readAsArrayBuffer(file);
};
const isImage = (filename) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"]; // Add more extensions if needed
  const fileExtension = filename.split(".").pop().toLowerCase();
  return imageExtensions.includes(`.${fileExtension}`);
};

const videoPlayer = ref(null); // Replace with your preferred video ID

// Plyr configuration
const plyrConfig = ref({
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "mute",
    "volume",
    "settings",
    "fullscreen",
  ],
  settings: ["quality", "speed", "loop"],
});
const video = ref({
  id: 0,
  title: "Select video",
  subTitle: "",
  src: "//vjs.zencdn.net/v/oceans.mp4",
  img: "//vjs.zencdn.net/v/oceans.png",
  file: "",
});
const selectVideo = (item) => {
  if (item.isFree || true) {
    video.value = {
      id: item.id,
      title: item.title,
      subTitle: item.subTitle,
      src: item.url,
      img: item.image,
      file: item.file,
    };
    initializePlyr(video.value);
  }
};
const initializePlyr = (item) => {
  setTimeout(() => {
    if (!videoPlayer.value) return;
    if (Hls.isSupported() && item.src.includes(".m3u8")) {
      const player = new Plyr(videoPlayer.value, plyrConfig.value);
      const hls = new Hls({
        xhrSetup: function (xhr, url) {
          if (url === "https://file.bponi.com/drm/timestamp") {
            xhr.setRequestHeader("X-TOKEN", site.value.hostname);
          }
        },
      });
      hls.loadSource(item.src);
      hls.attachMedia(videoPlayer.value);
      window.hls = hls;
    } else {
      videoPlayer.value.src = item.src;
      const player = new Plyr(videoPlayer.value, plyrConfig.value);
    }
  }, 100);
};
</script>

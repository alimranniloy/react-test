<template>
  <div class="editorx_body">
    <div :id="props.editorId" />
    <!-- <button v-if="!readOnly" class="codex-btn" @click="invokeSave">Save</button> -->
  </div>
</template>
<script setup>
import { useQuery, useMutation } from "@vue/apollo-composable";
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { SELF_FILE_FILE_CREATE } from "@/gql/file";
import { storeToRefs } from "pinia";
import { useMeStore } from "@/stores/me";
import ToggleBlock from "editorjs-toggle-block";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import Paragraph from "@editorjs/paragraph";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Checklist from "@editorjs/checklist";
import Marker from "@editorjs/marker";
import Warning from "@editorjs/warning";
import RawTool from "@editorjs/raw";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import Delimiter from "@editorjs/delimiter";
import ImageTool from "@editorjs/image";
import AttachesTool from "@editorjs/attaches";
const { me } = storeToRefs(useMeStore());

// end parameter

const props = defineProps({
  initialized: {
    type: Array,
    default: () => {},
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  editorId: {
    type: String,
    required: true,
    default: "editorId",
  },
});

const editorInstance = ref(null);
const interval = ref(null);
const initData = ref({
  time: 1554508385558,
  blocks: props.initialized,
  version: "2.26.5",
});
const url = ref("");

const emit = defineEmits(["onSave"]);
const invokeSave = () => {
  editorInstance.value.save().then((data) => {
    emit("onSave", data);
  });
};

const destroyEditor = () => {
  if (editorInstance.value) {
    editorInstance.value = null;
  }
};
onBeforeUnmount(() => {
  destroyEditor();
});
onMounted(() => {
  editorInstance.value = new EditorJS({
    holder: props.editorId,
    readOnly: props.readOnly,
    placeholder: "Let`s write an awesome story!",
    tools: {
      header: {
        class: Header,
        config: {
          placeholder: "Enter a header",
          levels: [2, 3, 4],
          defaultLevel: 3,
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      code: {
        class: CodeTool,
      },
      paragraph: {
        class: Paragraph,
      },
      embed: {
        class: Embed,
        config: {
          services: {
            youtube: true,
            coub: true,
            imgur: true,
          },
        },
      },
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
        },
      },
      checklist: {
        class: Checklist,
      },
      Marker: {
        class: Marker,
        shortcut: "CMD+SHIFT+M",
      },
      warning: {
        class: Warning,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+W",
        config: {
          titlePlaceholder: "Title",
          messagePlaceholder: "Message",
        },
      },
      raw: RawTool,
      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+O",
        config: {
          quotePlaceholder: "Enter a quote",
          captionPlaceholder: "Quote's author",
        },
      },
      inlineCode: {
        class: InlineCode,
        shortcut: "CMD+SHIFT+M",
      },
      delimiter: Delimiter,
      image: {
        class: ImageTool,
        config: {
          /**
           * Custom uploader
           */
          uploader: {
            /**
             * Upload file to the server and return an uploaded image data
             * @param {File} file - file selected from the device or pasted by drag-n-drop
             * @return {Promise.<{success, file: {url}}>}
             */
            async uploadByFile(file) {
              const delay = (ms) => new Promise((res) => setTimeout(res, ms));
              let title = file.name; // Get the file name (including extension)
              let mimeType = title.split(".").pop(); // Get the file extension
              let size = file.size;
              // your own uploading logic here
              const { mutate, loading, error } = useMutation(
                SELF_FILE_FILE_CREATE,
                {
                  variables: {
                    userId: me.value.id,
                    mimeType: mimeType,
                    file: file,
                    size: size,
                    title: title,
                    url: "",
                  },
                }
              );
              try {
                const response = await mutate();
                if (response.data.selfFileFileCreate) {
                  url.value = response.data.selfFileFileCreate.url;
                }
              } catch (error) {}

              await delay(3000);
              var result = new Promise(function (resolve, reject) {
                resolve({
                  success: 1,
                  file: {
                    url: url.value,
                  },
                });
              });
              return result;
            },

            /**
             * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
             * @param {string} url - pasted image URL
             * @return {Promise.<{success, file: {url}}>}
             */
            uploadByUrl(url) {
              // your ajax request for uploading
              var result = new Promise(function (resolve, reject) {
                resolve({
                  success: 1,
                  file: {
                    url: url,
                  },
                });
              });
              return result;
            },
          },
        },
      },
      attaches: {
        class: AttachesTool,
        config: {
          /**
           * Custom uploader
           */
          uploader: {
            /**
             * Upload file to the server and return an uploaded image data
             * @param {File} file - file selected from the device or pasted by drag-n-drop
             * @return {Promise.<{success, file: {url}}>}
             */
            async uploadByFile(file) {
              const delay = (ms) => new Promise((res) => setTimeout(res, ms));
              let title = file.name; // Get the file name (including extension)
              let mimeType = title.split(".").pop(); // Get the file extension
              let size = file.size;
              // your own uploading logic here
              const { mutate, loading, error } = useMutation(
                SELF_FILE_FILE_CREATE,
                {
                  variables: {
                    userId: me.value.id,
                    mimeType: mimeType,
                    file: file,
                    size: size,
                    title: title,
                    url: "",
                  },
                }
              );
              try {
                const response = await mutate();
                if (response.data.selfFileFileCreate) {
                  url.value = response.data.selfFileFileCreate.url;
                }
              } catch (error) {}
              await delay(3000);

              return {
                success: 1,
                file: {
                  url: url.value,
                  size: size,
                  name: "that.title",
                  extension: mimeType,
                },
                title: "that.title",
              };
            },
          },
        },
      },
      toggle: {
        class: ToggleBlock,
        inlineToolbar: true,
      },
    },
    data: initData.value,
    onReady: function () {
      interval.value = setInterval(() => {
        if (editorInstance.value && !props.readOnly) {
          invokeSave();
        }
      }, 3000);
    },
    onChange: function () {},
  });
});
</script>

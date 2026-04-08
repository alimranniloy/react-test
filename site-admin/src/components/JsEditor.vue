<template>
  <div class="editorx_body">
    <div id="codex-editor" />
    <button v-if="!readOnly" class="codex-btn" @click="invokeSave">Save</button>
  </div>
</template>
<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import LinkTool from "@editorjs/link";
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
export default {
  props: {
    initialized: {
      type: Array,
      default: () => {},
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      initData: {
        time: 1554508385558,
        blocks: this.initialized,
        version: "2.12.3",
      },
      interval: null,
    };
  },
  methods: {
    invokeSave() {
      window.editor.save().then((savedData) => {
        this.$emit("savedData", savedData);
      });
    },
    initEditor: function () {
      window.editor = new EditorJS({
        holder: "codex-editor",
        readOnly: this.readOnly,
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
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "https://api.bponi.com/fetchUrl", // Your backend endpoint for url data fetching,
            },
          },
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
                uploadByFile(file) {
                  // your own uploading logic here
                  return uploadByFileGql(file);
                },

                /**
                 * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
                 * @param {string} url - pasted image URL
                 * @return {Promise.<{success, file: {url}}>}
                 */
                uploadByUrl(url) {
                  // your ajax request for uploading
                  return MyAjax.upload(file).then(() => {
                    return {
                      success: 1,
                      file: {
                        url: "https://codex.so/upload/redactor_images/o_e48549d1855c7fc1807308dd14990126.jpg",
                        // any other image data you want to store, such as width, height, color, extension, etc
                      },
                    };
                  });
                },
              },
            },
          },
        },
        data: this.initData,
        onReady: function () {
          console.log("ready");
        },
        onChange: function () {},
      });
    },

    uploadByFileGql() {
      return {
        success: 1,
        file: {
          url: "https://codex.so/upload/redactor_images/o_80beea670e49f04931ce9e3b2122ac70.jpg",
          // any other image data you want to store, such as width, height, color, extension, etc
        },
      };
    },
  },
  mounted() {
    this.initEditor();
  },
  created() {
    // hide pre loader
    this.interval = setInterval(() => {
      if (window.editor && !this.readOnly) {
        this.invokeSave();
      }
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
<style>
.codex-editor-overlay {
  display: none;
}
</style>
<style lang="css" scoped >
.editorx_body {
  width: 100%;
  border: 2px solid #f1f3f5;
  box-sizing: border-box;
  min-height: 200px;
  background: #fff;
  border-radius: 4px;
  padding: 15px 24px;
  font-size: 16px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.ce-block--focused {
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 0.5438550420168067) 35%,
    rgba(0, 212, 255, 1) 100%
  );
}
.codex-btn {
  background-color: #fff;
  border: 2px solid #f1f3f5;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 65px;
  font-size: 15px;
  cursor: pointer;
}
</style>

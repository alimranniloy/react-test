<template>
  <div class="editorx_body">
    <div :id="props.editorId" />
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
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
// end parameter
const props = defineProps({
  html: {
    type: Object,
    required: true,
    default: {},
  },
  readOnly: {
    type: Boolean,
    default: true,
  },
  editorId: {
    type: String,
    required: true,
    default: "editorId",
  },
});
const editorInstance = ref(null);
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
    tools: {
      header: Header,
      list: List,
      code: CodeTool,
      paragraph: Paragraph,
      embed: Embed,
      table: Table,
      checklist: Checklist,
      Marker: Marker,
      warning: Warning,
      raw: RawTool,
      quote: Quote,
      inlineCode: InlineCode,
      delimiter: Delimiter,
      image: ImageTool,
      attaches: AttachesTool,
      toggle: ToggleBlock,
    },
    data: props.html,
    onReady: function () {},
    onChange: function () {},
  });
});
</script>

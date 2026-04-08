<template>

  <vue-draggable-resizable :drag-handle="'.dragEdit'" class-name="absolute bottom-10 right-10 " style="z-index: 99999;"
    @mouseenter="mode = 'code'" @mouseleave="mode = 'render'" :w="800" :h="600">
    <div
      class="dragEdit sticky top-0 px-3 py-1 bg-gray-100 text-gray-600 flex gap-2 border-b-2 text-center items-center justify-between">
      <div class="flex text-center items-center gap-2">
        <span @click="isEditor = false" class="w-3 h-3 rounded-full bg-red-400 cursor-pointer"></span>
        <span @click="toggleEditor()" class="w-3 h-3 rounded-full bg-yellow-400 cursor-pointer"></span>
        <span class="w-3 h-3 rounded-full bg-green-400"></span>
      </div>
      {{ isTyping ? editorStatus : "Editor" }}
      <div class="flex text-center items-center gap-2">
        <label class="inline-flex items-center cursor-pointer">
          <span class="mx-3 text-sm font-medium text-gray-900 dark:text-gray-300">Auto</span>
          <input type="checkbox" v-model="isAuto" class="sr-only peer">
          <div
            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
          </div>
        </label>
        <button @click="isHtml = !isHtml"
          class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none hover:bg-purple-200 text-xs py-1.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4"
          :class="isHtml
            ? 'border-transparent bg-purple-400 text-white'
            : 'border bg-transparent text-gray-700'
            ">
          HTML
        </button><button v-if="isHtml" @click="convert()"
          class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none hover:bg-purple-200 text-xs py-1.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4"
          :class="1 != 1
            ? 'border-transparent bg-purple-400 text-white'
            : 'border bg-transparent text-gray-700'
            ">
          Convert
        </button>
        <button v-if="!isHtml" @click="isJson = !isJson"
          class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none hover:bg-purple-200 text-xs py-1.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4"
          :class="isJson
            ? 'border-transparent bg-purple-400 text-white'
            : 'border bg-transparent text-gray-700'
            ">
          JSON
        </button>
        <button @click="refreshCode()"
          class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none hover:bg-purple-200 text-xs py-1.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4">
          <ArrowPathIcon class="h-4 w-4 text-neutral-600" />
        </button>
        <button v-if="!isAuto" @click="toggleChangeCode()"
          class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none hover:bg-purple-200 text-xs py-1.5 px-2.5 [&amp;>svg]:w-4 [&amp;>svg]:h-4">
          Save
        </button>
      </div>
    </div>
    <div v-if="errorMessage" class="bg-white px-3 py-2 rounded-xl absolute top-12 right-4 z-10">
      {{ errorMessage }}
    </div>
    <div class="shadow-lg border rounded-md w-full h-full text-sm" :class="isJson ? 'flex gap-2' : ''">
      <MonacoEditor v-if="isJson" theme="vs-dark" language="json" v-model:value="jsonCode"></MonacoEditor>
      <MonacoEditor v-else-if="isHtml" :options="options" theme="vs-dark" language="html" v-model:value="htmlCode">
      </MonacoEditor>
      <MonacoEditor v-else :options="options" theme="vs-dark" language="javascript" v-model:value="rawCode"
        @change="changeCode"></MonacoEditor>
    </div>
  </vue-draggable-resizable>
</template>
<script setup>
import { debounce } from "lodash";
import { ref, inject, watch, onMounted, computed } from "vue";
import { Parser } from "@rekajs/parser";
import * as t from "@rekajs/types";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
const emit = defineEmits(["onEditor"]);
const { mode, componentId, isEditor, isAuto } = storeToRefs(useEditorStore());
import MonacoEditor from "monaco-editor-vue3";
import { ArrowPathIcon, ReceiptRefundIcon } from "@heroicons/vue/24/outline";
const options = {
  colorDecorators: true,
  lineHeight: 24,
  tabSize: 2,
  automaticLayout: true
};
const reka = inject("reka");
const rawCode = ref("{}");
const jsonCode = ref({});
const htmlCode = ref("{}");
const isJson = ref(false);
const isHtml = ref(false);

const component = computed(() => {
  return reka.value.getNodeFromId(componentId.value);
});
const editorStatus = ref("Saving");
const isTyping = ref(false);
const changeCode = () => {
  if (isAuto.value) {
    isTyping.value = true;
    editorStatus.value = "Saving";
    syncCodeToState();
  }
};
const toggleChangeCode = () => {
  isTyping.value = true;
  editorStatus.value = "Saving";
  syncCodeToState();
};
const refreshCode = () => {
  if (component.value instanceof t.RekaComponent) {
    rawCode.value = Parser.stringify(component.value);
    jsonCode.value = JSON.stringify(component.value, null, 2);
  } else {
    rawCode.value = Parser.stringify(reka.value.program);
    jsonCode.value = JSON.stringify(reka.value.toJSON(), null, 2);
  }
};
const errorMessage = ref("");
const syncCodeToState = debounce(() => {
  try {
    if (mode.value == "code") {
      const data = Parser.parseProgram(rawCode.value);
      if (component.value instanceof t.RekaComponent) {
        reka.value.change(() => {
          diffAST(reka.value.program, data, "merge");
        });
      } else {
        reka.value.change(() => {
          diffAST(reka.value.program, data, "update");
        });
      }
    }
    editorStatus.value = "Saved";
    errorMessage.value = "";
  } catch (error) {
    editorStatus.value = "Error";
    errorMessage.value = error;
  }
}, 200);

const diffASTArrayTypes = (program, newProgram, getTarget, isEqual) => {
  const currentComponents = getTarget(program);
  const newComponents = getTarget(newProgram);

  const componentsToInsert = [];
  newComponents.forEach((newComponent, i) => {
    const existingComponent = currentComponents.find((oldComponent) =>
      isEqual(oldComponent, newComponent)
    );

    if (!existingComponent) {
      componentsToInsert.push([newComponent, i]);
      return;
    }

    t.merge(existingComponent, newComponent);
  });

  componentsToInsert.forEach(([component, index], i) => {
    currentComponents.splice(index + i, 0, component);
  });

  currentComponents
    .filter(
      (oldComponent) =>
        !newComponents.find((newComponent) =>
          isEqual(oldComponent, newComponent)
        )
    )
    .forEach((component) => {
      currentComponents.splice(currentComponents.indexOf(component), 1);
    });
};
const mergeASTArrayTypes = (
  program,
  newProgram,
  getTarget,
  isEqual,
  mergeFn
) => {
  const currentComponents = getTarget(program);
  const newComponents = getTarget(newProgram);

  newComponents.forEach((newComponent, i) => {
    const existingComponent = currentComponents.find((oldComponent) =>
      isEqual(oldComponent, newComponent)
    );

    if (!existingComponent) {
      // If the component doesn't exist, add it to the end
      currentComponents.push(newComponent);
      return;
    }

    mergeFn(existingComponent, newComponent);
  });
};
const diffAST = (program, newProgram, action) => {
  if (action == "merge") {
    // Diff Globals
    mergeASTArrayTypes(
      program,
      newProgram,
      (program) => program.globals,
      (a, b) => a.name === b.name,
      t.merge
    );
    // Diff components
    mergeASTArrayTypes(
      program,
      newProgram,
      (program) => program.components,
      (a, b) => a.name === b.name,
      t.merge
    );
  } else {
    // Diff Globals
    diffASTArrayTypes(
      program,
      newProgram,
      (program) => program.globals,
      (a, b) => a.name === b.name
    );
    // Diff components
    diffASTArrayTypes(
      program,
      newProgram,
      (program) => program.components,
      (a, b) => a.name === b.name
    );
  }
};
const toggleEditor = () => {
  emit("onEditor", false);
};
onMounted(() => {
  if (component.value instanceof t.RekaComponent) {
    rawCode.value = Parser.stringify(component.value);
    jsonCode.value = JSON.stringify(component.value, null, 2);
  } else {
    rawCode.value = Parser.stringify(reka.value.program);
    jsonCode.value = JSON.stringify(reka.value.toJSON(), null, 2);
  }
});


const convertToJSX = (htmlString) => {


  // Helper function to convert attributes
  function convertAttributes(attrs) {
    return Object.fromEntries(
      Array.from(attrs)
        .filter((attr) => {
          // Filter out non-HTML attributes
          return (
            !attr.name.startsWith("@") &&
            !attr.name.startsWith(":") &&
            !attr.name.startsWith("x-") &&
            !attr.name.startsWith("fill-") &&
            !attr.name.startsWith("aria-") &&
            !attr.name.startsWith("clip-") &&
            attr.name !== "style"
          );
        })
        .map((attr) => {
          let name = attr.name;
          let value = attr.value;

          // Convert class to className
          if (name === "class") name = "className";

          // Convert kebab-case to camelCase for attributes
          name = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

          // Wrap all attribute values in curly braces
          value = `{"${value}"}`;

          return [name, value];
        })
    );
  }

  // Parse HTML string using the browser's DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Recursive function to convert nodes
  const convertNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.trim()
        ? `<text value={"${node.textContent.trim()}"}/>`
        : "";
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      const attrs = convertAttributes(node.attributes);
      const children = Array.from(node.childNodes)
        .map(convertNode)
        .filter(Boolean)
        .join("\n");

      const attrString = Object.entries(attrs)
        .map(([key, value]) => `${key}=${value}`)
        .join(" ");

      return `<${tagName} ${attrString}>${children ? `\n${children}\n` : ""
        }</${tagName}>`;
    }

    return "";
  }

  // Convert the body content
  const convertedJSX = convertNode(doc.body.firstChild);

  return convertedJSX;
}
const convert = () => {

  htmlCode.value = convertToJSX(htmlCode.value);
}
</script>

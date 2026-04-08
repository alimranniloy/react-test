<script setup>
import {
  onMounted,
  ref,
  computed,
  defineAsyncComponent,
  inject,
  onUnmounted,
} from "vue";
import {
  EXTERNAL_IDENTIFIER_PREFIX_SYMBOL,
  getIdentifierFromStr,
} from '@rekajs/parser';
import { storeToRefs } from "pinia";
import * as t from "@rekajs/types";
import { Parser } from "@rekajs/parser";
import { DndProvider } from "vue3-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEditorStore } from "@/stores/editor";
import NewComponent from "@/views/editor/component/NewComponent.vue";
const { isEditor, componentId, isNewComponent, isOnComponent } = storeToRefs(useEditorStore());
const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  page: {
    type: String,
    required: true,
  },
});
const reka = inject("reka");
const NavBar = defineAsyncComponent(() => import("@/views/editor/NavBar.vue"));
const Preview = defineAsyncComponent(() =>
  import("@/views/editor/Preview.vue")
);
const CodeEditor = defineAsyncComponent(() =>
  import("@/views/editor/CodeEditor.vue")
);
const Components = defineAsyncComponent(() =>
  import("@/views/editor/Components.vue")
);
const Template = defineAsyncComponent(() =>
  import("@/views/editor/template/Template.vue")
);
const Live = defineAsyncComponent(() =>
  import("@/views/editor/preview/Live.vue")
);
const isFull = ref(false);
const isPreview = ref(true);
const dummy = () => {
  const programFromJSON = t.Schema.fromJSON({
    extensions: {},
    id: "osNh2WufpFyqQgcswZiO7",
    program: {
      components: [
        {
          id: "b5U6Rk7hg2Y15Ob11kTPJ",
          meta: {},
          name: "App",
          props: [],
          state: [],
          template: {
            children: [
              {
                children: [],
                classList: null,
                component: {
                  external: false,
                  id: "hMG3PcUjqNPu0MmRP1EZ2",
                  meta: {},
                  name: "Header",
                  type: "Identifier",
                },
                each: null,
                id: "dlqX8iJFe5WDSd2oCFvRc",
                if: null,
                meta: {},
                props: {},
                type: "ComponentTemplate",
              },
            ],
            classList: null,
            each: null,
            id: "6Hgh2dR3aVLigpvjFeNQ2",
            if: null,
            meta: {},
            props: {},
            tag: "div",
            type: "TagTemplate",
          },
          type: "RekaComponent",
        },
        {
          id: "9cPIR6NXBXCJPh3CYOI86",
          meta: {},
          name: "Header",
          props: [],
          state: [],
          template: {
            children: [
              {
                children: [],
                classList: null,
                each: null,
                id: "9RZhbgar7C6bxaAFV9tN7",
                if: null,
                meta: {},
                props: {
                  value: {
                    id: "XEphXMPt3D1GaVYxawkvm",
                    meta: {},
                    type: "Literal",
                    value: "Header",
                  },
                },
                tag: "text",
                type: "TagTemplate",
              },
            ],
            classList: null,
            each: null,
            id: "gzISP1ZbpAkbSvM1jskDO",
            if: null,
            meta: {},
            props: {
              className: {
                id: "rzUaxdgJhCA9lmi9e6Vpr",
                meta: {},
                type: "Literal",
                value: "px-4 py-4 bg-red-100",
              },
            },
            tag: "div",
            type: "TagTemplate",
          },
          type: "RekaComponent",
        },
      ],
      globals: [],
      id: "xJlB9rThOjPCJIoNbNgfP",
      meta: {},
      type: "Program",
    },
    type: "State",
  });
  try {
    reka.value.load(programFromJSON);
    for (let component of reka.value.state.program.components) {
      reka.value.change(() => {
        const existingFrame = component
          ? reka.value.frames.find((frame) => frame.id === component.name)
          : null;

        if (existingFrame == undefined || existingFrame == null) {
          try {
            reka.value.createFrame({
              id: component.name,
              name: component.name,
              component: component,
            });
          } catch (error) { }
        }
      });
    }
  } catch (error) {
    console.log('error');
  }
}
const load = () => {
  if (JSON.stringify(props.schema) != JSON.stringify({})) {
    try {
      reka.value.load(t.Schema.fromJSON(props.schema));
      for (let component of reka.value.state.program.components) {
        let existingFrame = reka.value.frames.find((a) => a.id == component.name);
        if (!existingFrame) {
          try {
            reka.value.createFrame({
              id: component.name,
              name: component.name,
              component: component,
            });
          } catch (error) {
            let index = 1;
            let newName = `${component.name}${index}`;

            while (reka.value.frames.find((a) => a.id == newName)) {
              index++;
              newName = `${component.name}${index}`;
            }
            try {
              reka.value.createFrame({
                id: newName,
                name: newName,
                component: component,
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  } else {
    dummy();
  }

};
const addComponent = (data) => {
  if (data instanceof t.Component) {
    const name = data.name + (reka.value.program.components.filter((a) => a.name === data.name).length > 0 ? reka.value.program.components.filter((a) => a.name === data.name).length : '');
    data.name = name;
    reka.value.change(() => {
      reka.value.program.components.push(data);
      const d = t.componentTemplate({
        component: getIdentifierFromStr(data.name),
        props: [],
        children: [],
      });
      if (reka.value.program.components.find((a) => a.name == 'App')) {
        reka.value.program.components.find((a) => a.name == 'App').template.children.push(d);
      }
    });
    isNewComponent.value = false;
  }
}
onMounted(() => {
  for (let frame of reka.value.frames) {
    reka.value.removeFrame(frame)
  }
  load();
});
onUnmounted(() => {
  for (let frame of reka.value.frames) {
    reka.value.removeFrame(frame)
  }
});
</script>
<template>
  <Teleport to="body" v-if="reka" :disabled="!isFull">
    <DndProvider :backend="HTML5Backend">
      <div :class="isFull
          ? 'fixed h-screen overflow-hidden top-0 w-full left-0 right-0 z-[9999] bg-white'
          : ''
        ">
        <NavBar :page="page" @onFull="(isFull = !isFull, isPreview = !isPreview)" @onEditor="isEditor = !isEditor"
          @onPreview="isPreview = !isPreview" />
        <div v-if="!isPreview" class="flex h-screen">
          <div @mouseover="isOnComponent = true" @mouseleave="isOnComponent = false" v-if="isFull"
            class="min-w-[281px] overflow-y-auto border-r max-w-[300px] no-scrollbar">
            <Components />
          </div>
          <div class="flex-1 relative h-full" :class="isFull ? '8/12' : 'w-full'">
            <div class="overflow-auto g-full">
              <Preview :key="isFull" :isFull="isFull" />
            </div>
            <div :id="componentId" :key="componentId" v-if="isEditor">
              <CodeEditor />
            </div>
          </div>
          <div v-if="isFull" class="w-2/12 overflow-auto no-scrollbar border-l max-w-[300px]">
            <Template />
          </div>
        </div>
        <div class="h-screen overflow-auto" v-else>
          <Live />
        </div>
      </div>
    </DndProvider>
  </Teleport>

  <NewComponent @add="addComponent" v-show="isNewComponent"></NewComponent>
</template>

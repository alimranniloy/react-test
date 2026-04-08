<template>
  <div class="relative flex-1">
    <div class="flex px-5 py-1.5 flex-col border-b border-solid border-outline setting-section last:border-none">
      <div class="flex relative items-center cursor-pointer mt-2 mb-1">
        <header class="flex flex-1 items-center">
          <span class="text-slate-800 text-sm font-medium flex items-center">Template</span><button
            class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-gray-500 hover:bg-black/5 hover:text-neutral-900 text-xs py-1.5 px-1.5 rounded-md [&amp;>svg]:w-3 [&amp;>svg]:h-3 ml-1">
            <ChevronDownIcon class="h-4 w-4"></ChevronDownIcon>
          </button>
        </header>
      </div>
      <section class="-mx-4">
        <RenderTemplate :component="component" />
      </section>
    </div>
  </div>
</template>

<script setup>
import * as t from "@rekajs/types";
import {
  ref,
  watch,
  onMounted,
  h,
  inject,
  computed,
  defineComponent,
  defineAsyncComponent,
} from "vue";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
import { BackspaceIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";

const { } = useEditorStore();
const { templateId, isNewComponent, componentId } = storeToRefs(
  useEditorStore()
);
const reka = inject("reka");
const component = computed(() => {
  return reka.value.getNodeFromId(componentId.value);
});
const activeTemplate = computed(() => {
  return reka.value.getNodeFromId(templateId.value);
});
const Dropdown = defineAsyncComponent(() =>
  import("@/views/editor/template/Dropdown.vue")
);
const AddTemplateButton = defineComponent({
  props: {
    target: t.Template,
  },
  setup(props) {
    const option = ref(null);

    const setOption = (value) => {
      option.value = value;
      isNewComponent.value = true;
    };

    return () =>
      h("div", [
        h(
          Dropdown,
          {
            onSelect: (data) => {
              setOption(data);
            },
            items: [
              {
                title: "Add Before",
                value: "before",
              },
              {
                title: "Add After",
                value: "after",
              },
              {
                title: "Add child",
                value: "child",
              },
            ],
          },
          () => [
            h("span", [
              h("div", { content: "Add new template" }, [
                h("button", [h("div")]),
              ]),
            ]),
          ]
        ),
      ]);
  },
});

const getTemplateName = (template) => {
  if (template instanceof t.TagTemplate) {
    return template.tag;
  }

  if (template instanceof t.ComponentTemplate) {
    return template.component.name;
  }

  if (template instanceof t.SlotTemplate) {
    return `<slot />`;
  }

  throw new Error();
};

const RenderTemplateNode = defineComponent({
  props: {
    templateId: String,
    depth: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const depth = ref(props.depth || 0);
    const template = computed(() =>
      reka.value.getNodeFromId(props.templateId, t.Template)
    );

    if (!template.value) {
      return null;
    }
    return () =>
      h("div", { class: "" }, [
        h(
          "div",
          {
            class: [
              "px-4 py-1 cursor-pointer rounded-l-md rounded-r-full my-1 hover:bg-gray-100 ",
              activeTemplate.value &&
                activeTemplate.value.id == template.value.id
                ? "bg-purple-100"
                : "",
            ],
            onClick: () => {
              if (template.value instanceof t.ComponentTemplate) {
                console.log(template.value, template.value.component.id)
                componentId.value = template.value.component.id;
              } else {
                templateId.value = template.value.id;
              }
            },
          },
          [
            h(
              "div",
              {
                class: "flex flex-1 gap-2 items-center",
                style: { marginLeft: `${depth.value * 10}px` },
              },
              [
                h(
                  "div",
                  {
                    class: "text-xs w-full",
                  },
                  getTemplateName(template.value)
                ),
                h("div", { class: "flex items-center" }, [
                  h(AddTemplateButton, { target: template.value }),
                  h(
                    "div",
                    { class: "flex items-center", content: "Remove template" },
                    [
                      h(
                        BackspaceIcon,
                        {
                          class: "h-3 w-3 ml-2",
                          onClick: (e) => {
                            e.stopPropagation();
                            reka.value.change(() => {
                              const parent = reka.value.getParentNode(
                                template.value,
                                t.Template
                              );
                              if (!parent) {
                                return;
                              }
                              if (
                                !(parent instanceof t.SlottableTemplate)
                              ) {
                                return;
                              }

                              reka.value.change(() => {
                                parent.children.splice(
                                  parent.children.indexOf(template.value),
                                  1
                                );
                              });
                            });
                          },
                        },
                        () => [h("div")]
                      ),
                    ]
                  ),
                ]),
              ]
            ),
          ]
        ),
        t.is(template.value, t.SlottableTemplate) &&
        template.value.children.map((child) =>
          h(RenderTemplateNode, {
            key: child.id,
            templateId: child.id,
            depth: depth.value + 1,
          })
        ),
      ]);
  },
});

const RenderTemplate = defineComponent({
  props: {
    component: {
      type: t.RekaComponent,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(
        "div",
        {
          class: "px-2",
        },
        [
          props.component.template &&
          h(RenderTemplateNode, { templateId: props.component.template.id }),
        ]
      );
  },
});
</script>

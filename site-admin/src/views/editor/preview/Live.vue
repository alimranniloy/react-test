<template>
  <RenderView v-if="frame" :key="version" :view="frame.view" />

</template>

<script setup>
import { debounce } from "lodash";
import * as t from "@rekajs/types";
import { ref, inject, computed, defineComponent, h, onMounted } from "vue";
// Inject the reka instance
const reka = inject("reka");
const frame = computed(() => {
  return reka.value.frames[0];
});
// Define the RenderView component
const RenderTagView = (view) => {
  const { tag, props, children = [] } = view;
  switch (tag) {
    case "text":
      return h("span", {}, props.value);
    case "img":
      return h("img", {
        style: props.style,
        src: props.src,
        class: props.className,
        alt: props.alt || "",
        width: props.width || 500,
        height: props.height || 500,
      });
    case "svg":
      return h("svg", {
        fill: "currentColor",
        style: props.style,
        class: props.className,
        width: props.width || 500,
        height: props.height || 500,
      }, children.length
        ? children.map((child) => h(RenderView, { view: child, key: child.id }))
        : null);
    default:
      return h(
        tag,
        { ...props },
        children.length
          ? children.map((child) => h(RenderView, { view: child, key: child.id }))
          : null
      );
  }
};

const RekaComponentView = (currentView) => {
  return currentView.render.map((r) => h(RenderView, { view: r, key: r.id }));
};

const ExternalComponentView = (currentView) => {
  return currentView.component.render(currentView.props);
};


const ErrorSystemView = (currentView) => {
  return h("div", {}, "Something went wrong.", h("br"), currentView.error);
};

const FragmentView = (currentView) => {
  return currentView.children.map((child) => h(RenderView, { view: child, key: child.id }));
};

const RenderView = defineComponent({
  props: {
    view: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const renderComponent = computed(() => {
      if (props.view instanceof t.TagView) {
        return () => RenderTagView(props.view);
      } else if (props.view instanceof t.RekaComponentView) {
        return () => RekaComponentView(props.view);
      } else if (props.view instanceof t.ExternalComponentView) {
        return () => ExternalComponentView(props.view);
      } else if (props.view instanceof t.FrameView ||
        props.view instanceof t.SlotView || props.view instanceof t.FragmentView) {
        return () => FragmentView(props.view);
      } else if (props.view instanceof t.ErrorSystemView) {
        return () => ErrorSystemView(props.view);
      }
      return () => h('div', {}, `Rendering:`);
    });

    return renderComponent.value;
  },
});

const version = ref(1);
const throttledVersion = debounce(() => {
  version.value += 1;
}, 100);
onMounted(() => {
  reka.value.listenToChangeset((a) => {
    throttledVersion();
  })
})
</script>

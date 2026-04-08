<template>
  <div v-if="reka" class="bg-white h-full transition flex-1">
    <div v-if="isFull" class="relative flex flex-col h-full">
      <div class="flex items-center px-4 py-2.5 border-b border-solid border-outline w-full relative z-30 h-[51px]">
        <div class="flex gap-2 flex-1 items-center">
          <span class="text-slate-700">{{ frame ? frame.id : "" }}</span>
          <Listbox v-if="frames.length > 0" v-model="selectedFrame">
            <div class="relative mt-1">
              <ListboxButton
                class="inline-flex text-left overflow-hidden text-ellipsis whitespace-nowrap items-center rounded-md px-3 py-1.5 text-xs gap-2 text-gray-600 border border-solid border-outline pointer shadow-sm hover:bg-gray-100 ml-2">
                <span>{{ frame ? frame.id : "" }}</span>
                <ChevronDownIcon class="h-3 w-3 text-gray-600" />
              </ListboxButton>

              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  <ListboxOption v-slot="{ active, selected }" v-for="item in frames" :key="item.value"
                    :value="item.value" as="template">
                    <li :class="[
                        active
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-gray-900',
                        'relative cursor-default select-none py-2 px-4',
                      ]">
                      <span :class="[
                          selected ? 'font-medium' : 'font-normal',
                          'block truncate',
                        ]">{{ item.title }}</span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>

          <div class="flex items-center">
            <button @click="isOpen = !isOpen"
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-primary hover:bg-primary-100 text-xs py-1.5 px-1.5 rounded-md [&amp;>svg]:w-3 [&amp;>svg]:h-3">
              Add Frame
            </button>
          </div>
        </div>
        <span class="text-xs mr-3 text-slate-500">Preview size</span>
        <div class="flex items-center">
          <div class="group flex-1 relative border border-solid border-outline flex items-center rounded-md shadow-sm">
            <input placeholder="100%" size="3"
              class="bg-transparent outline-none shadow-none py-1.5 px-3 text-black/80 transition border-none relative w-full text-xs"
              value="100%" />
          </div>
          <XMarkIcon class="h-3 w-3 text-gray-600 mx-2" />
          <div class="group flex-1 relative border border-solid border-outline flex items-center rounded-md shadow-sm">
            <input placeholder="100%" size="5"
              class="bg-transparent outline-none shadow-none py-1.5 px-3 text-black/80 transition border-none relative w-full text-xs"
              value="100%" />
          </div>
        </div>
      </div>
    </div>
    <div class="relative flex flex-1 h-full min-h-0">
      <div
        class="render-frame-container w-full h-full overflow-hidden flex flex-1 items-center bg-canvas transition-all ease-all duration-800">
        <div class="w-full h-full render-frame-root">
          <div class="w-full h-full relative flex flex-col justify-center min-h-full max-h-full origin-[0px_0px]">
            <div class="w-full h-screen overflow-hidden rounded-none flex justify-center bg-gray-100">
              <div class="container m-8">
                <div class="w-full min-h-[70vh] max-h-[85vh] right-0 left-0 rounded-md z-30 overflow-auto">
                  <div
                    class="dragPreview sticky top-0 z-[99999] px-3 py-2 bg-white text-gray-600 flex gap-2 border-b-2 text-center items-center justify-between">
                    <div class="flex text-center items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-red-400 cursor-pointer"></span>
                      <span class="w-3 h-3 rounded-full bg-yellow-400 cursor-pointer"></span>
                      <span class="w-3 h-3 rounded-full bg-green-400"></span>
                    </div>
                    Editor
                    <div class="flex text-center items-center gap-2">
                      <ComputerDesktopIcon @click="deviceType = 'max-w-full'"
                        :class="deviceType == 'max-w-full' ? 'bg-blue-100' : ''"
                        class="h-8 w-8 hover:bg-blue-100 p-2 rounded-md" />
                      <DeviceTabletIcon @click="deviceType = 'max-w-lg'"
                        :class="deviceType == 'max-w-lg' ? 'bg-blue-100' : ''"
                        class="h-8 w-8 hover:bg-blue-100 p-2 rounded-md" />
                      <DevicePhoneMobileIcon @click="deviceType = 'max-w-md'"
                        :class="deviceType == 'max-w-md' ? 'bg-blue-100' : ''"
                        class="h-8 w-8 hover:bg-blue-100 p-2 rounded-md" />
                    </div>
                  </div>
                  <div class="m-auto overflow-auto flex justify-center  items-center pt-6" :class="deviceType"
                    :key="deviceType">
                    <div ref="renderFrame" class="block w-full bg-white">
                      <Render v-if="frame && frame.view instanceof t.View" :view="frame.view" :key="frame.view.id" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-[9999]">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Create frame
              </DialogTitle>
              <div class="mt-4">
                <div class="relative rounded-md border border-gray-300 px-3 py-3 mb-4 shadow-sm">
                  <label for="name"
                    class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Name</label><input
                    v-model="name" type="text" name="name" id="name" autocomplete="off" rows="3"
                    class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                    placeholder="Value" />
                </div>
                <!-- <div class="relative rounded-md border border-gray-300 px-3 py-3 mb-4 shadow-sm">
                  <label for="name"
                    class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Props</label><input
                    v-model="name" type="text" name="name" id="name" autocomplete="off" rows="3"
                    class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                    placeholder="Value" />
                </div> -->
              </div>
              <div class="mt-4 flex gap-4">
                <button type="button"
                  class="inline-flex [&>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-purple-100 text-purple-600 hover:bg-purple-200 text-xs py-2.5 px-2.5 [&>svg]:w-4 [&>svg]:h-4"
                  @click="closeModal()">
                  Close
                </button>
                <button type="button"
                  class="w-full inline-flex [&>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-blue-500 text-white hover:bg-blue-300 text-xs py-2.5 px-2.5 [&>svg]:w-4 [&>svg]:h-4"
                  @click="createFrame()">
                  Save
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import {
  ChevronDownIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import {
  defineAsyncComponent,
  h,
  computed,
  watch,
  ref,
  inject,
  onMounted,
  onUnmounted,
} from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
import { useMeStore } from "@/stores/me";
import { useNotificationsStore } from "@/stores/notifications";
import * as t from "@rekajs/types";
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { componentId, frameId} = storeToRefs(useEditorStore());
const reka = inject("reka");
const Render = defineAsyncComponent(() => import("@/views/editor/Render.vue"));
const props = defineProps({
  isFull: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const component = computed(() => {
  return reka.value.getNodeFromId(componentId.value);
});
const selectedFrame = ref(null);
const frame = computed(() => {
  if (selectedFrame.value) {
    return reka.value.frames.find((a) => a.id == selectedFrame.value)
      ? reka.value.frames.find((a) => a.id == selectedFrame.value)
      : reka.value.frames[0];
  } else if (frameId.value) {
    return reka.value.frames.find((a) => a.id == frameId.value)
      ? reka.value.frames.find((a) => a.id == frameId.value)
      : reka.value.frames[0];
  }
  else {
    return reka.value.frames[0];
  }
});
const frames = computed(() => {
  const items = component.value
    ? reka.value.frames.filter((a) => a.componentName === component.value.name)
    : [];
  return items.map((frame) => ({
    value: frame.id,
    title: frame.id,
  }));
});
watch(component, () => {
  if (frames.value.length > 0) {
    selectedFrame.value = frames.value[0].title;
  }
});
const isOpen = ref(false);
const deviceType = ref('max-w-full');
const closeModal = () => {
  isOpen.value = false;
};
const name = ref("");
const createFrame = () => {
  reka.value.change(() => {
    const existingFrame = name.value
      ? reka.value.frames.find((frame) => frame.id === name.value)
      : null;

    console.log(component.value)
    if (existingFrame == undefined || existingFrame == null) {
      try {
        reka.value.createFrame({
          id: name.value,
          componentName: component.value.name,
          component: component.value,
        });
      } catch (error) {
        console.log(error);
      }
    }
  });
  closeModal();
};
</script>

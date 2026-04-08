import { defineStore } from "pinia";
import SecureLS from "secure-ls";
const ls = new SecureLS({
  encryptionNamespace: 'site-admin'
});
export const useEditorStore = defineStore("editor_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    mode: "render",
    isNewComponent: false,
    componentId: null,
    templateId: null,
    frameId: null,
    editor: null,
    version: 0,
    isEditor: false,
    isOnComponent: false,
    isAuto: false,
    position: "down",
    positionId: null,
    selectedComponentIds: [],
    pinnedComponentCategoryIds: [],
    savedComponentFilters: [],
  }),
  getters: {},
  actions: {
    async setMode(mode) {
      this.mode = mode;
    },
    async setSetNewComponent(isNewComponent) {
      this.isNewComponent = isNewComponent;
    },
  },
  persist: {
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key),
    },
  },
});

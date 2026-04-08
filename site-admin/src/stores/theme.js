import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
const ls = new SecureLS({
  encryptionNamespace: "site-admin",
});
export const useThemeStore = defineStore("theme_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    themeId: null,
    theme: null,
  }),
  getters: {},
  actions: {
    async setThemeId(themeId) {
      this.themeId = themeId;
    },
    async setTheme(theme) {
      this.theme = theme;
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

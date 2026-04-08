import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
const ls = new SecureLS({
  encryptionNamespace: 'site-admin'
});
export const useSearchStore = defineStore("search_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    search: null,
    searchs: [],
  }),
  getters: {},
  actions: {
    async setSearch(search) {
      this.search = search;
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

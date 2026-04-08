import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useShareStore = defineStore(
  "share_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      share: null,
    }),
    getters: {},
    actions: {
      setShare(share) {
        this.share = share;
      },
    },
    persist: {
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    },
  }
);

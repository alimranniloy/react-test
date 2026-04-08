import { defineStore } from "pinia";

import SecureLS from "secure-ls";
const ls = new SecureLS({
  encryptionNamespace: "store-dropy",
});
export const useRecentStore = defineStore(
  "recent_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      recentProducts: [],
    }),
    actions: {
      addProduct(product) {
        if (!this.recentProducts.find((p) => p.id === product.id)) {
          this.recentProducts.push(product);
        }
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

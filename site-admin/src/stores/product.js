import { defineStore } from "pinia";
import SecureLS from "secure-ls";
const ls = new SecureLS({
  encryptionNamespace: "product-admin",
});
export const useProductStore = defineStore("product_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    productId: null,
    product: null,
  }),
  getters: {},
  actions: {
    async setProductId(id) {
      this.productId = id;
    },
    async setProduct(product) {
      this.product = product;
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

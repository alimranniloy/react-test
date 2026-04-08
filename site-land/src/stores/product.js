import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import {
  STORE_PRODUCTS,
  STORE_PRODUCT_DETAILS,
  STORE_PRODUCT_BY_HID,
} from "@/gql/product";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useProductStore = defineStore("product_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    productId: null,
    product: null,
    products: [],
  }),
  getters: {},
  actions: {
    async setProductId(productId) {
      this.productId = productId;
    },
    async getProducts(siteId) {
      const { onResult, loading, error } = useQuery(STORE_PRODUCTS, {
        siteId: [siteId],
      });
      onResult((queryResult) => {
        this.products = queryResult.data?.storeProducts.edges.map((a) => a.node);
      });
    },
    async getProduct(id) {
      const { onResult, loading, error } = useQuery(STORE_PRODUCT_DETAILS, {
        id: id,
      });
      onResult((queryResult) => {
        this.product = queryResult.data.storeProduct;
      });
    },
    async getProductByHid(hid) {
      const { onResult, loading, error } = useQuery(STORE_PRODUCT_BY_HID, {
        hid: hid,
      });
      onResult((queryResult) => {
        console.log(queryResult);
        this.product = queryResult.data.storeProductByHid;
      });
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

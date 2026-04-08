import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { STORE_BRANDS, STORE_BRAND_DETAILS } from "@/gql/brand";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useBrandStore = defineStore("brand_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    brandId: null,
    brand: null,
    brands: [],
  }),
  getters: {},
  actions: {
    async setBrandId(brandId) {
      this.brandId = brandId;
    },
    async getBrand(id) {
      const { onResult, loading, error } = useQuery(STORE_BRAND_DETAILS, {
        id: id,
      });
      onResult((queryResult) => {
        this.brand = queryResult.data.storeBrand;
      });
    },
    async getBrands(siteId, childId) {
      const { onResult, loading, error } = useQuery(STORE_BRANDS, {
        siteId: siteId,
        childId: childId,
        first: 2048,
      });
      onResult((queryResult) => {
        if (queryResult.data.storeBrands) {
          this.brands = queryResult.data.storeBrands.edges
            .map((v) => v.node)
            .filter((v) => v.isActive === true).sort((a, b) => a.priority - b.priority);
        }
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

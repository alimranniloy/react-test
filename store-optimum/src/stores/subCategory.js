import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import {
  STORE_SUB_CATEGORIES,
  STORE_SUB_CATEGORY_DETAILS,
} from "@/gql/subCategory";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useSubCategoryStore = defineStore(
  "subCategory_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      subCategoryId: null,
      subCategory: null,
      subCategories: [],
    }),
    getters: {},
    actions: {
      async setSubCategoryId(subCategoryId) {
        this.subCategoryId = subCategoryId;
      },
      async geSubtCategory(id) {
        const { onResult, loading, error } = useQuery(
          STORE_SUB_CATEGORY_DETAILS,
          {
            id: id,
          }
        );
        onResult((queryResult) => {
          this.subCategory = queryResult.data.storeCategory;
        });
      },
      async getSubCategories(siteId, childId) {
        const { onResult, loading, error } = useQuery(STORE_SUB_CATEGORIES, {
          siteId: siteId,
          childId: childId,
          first: 2048,
        });
        onResult((queryResult) => {
          if (queryResult.data.storeSubCategories) {
            this.subCategories = queryResult.data.storeSubCategories.edges
              .map((v) => v.node)
              .filter((v) => v.isActive === true)
              .sort((a, b) => a.priority - b.priority);
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
  }
);

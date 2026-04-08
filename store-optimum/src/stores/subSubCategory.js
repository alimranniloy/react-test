import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import {
  STORE_SUB_SUB_CATEGORIES,
  STORE_SUB_SUB_CATEGORY_DETAILS,
} from "@/gql/subSubCategory";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useSubSubCategoryStore = defineStore(
  "subSubCategory_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      subSubCategoryId: null,
      subSubCategory: null,
      subSubCategories: [],
    }),
    getters: {},
    actions: {
      async setSubSubCategoryId(subSubCategoryId) {
        this.subSubCategoryId = subSubCategoryId;
      },
      async geSubSubtCategory(id) {
        const { onResult, loading, error } = useQuery(
          STORE_SUB_SUB_CATEGORY_DETAILS,
          {
            id: id,
          }
        );
        onResult((queryResult) => {
          this.subSubCategory = queryResult.data.storeSubSubCategory;
        });
      },
      async getSubSubCategories(siteId, childId) {
        const { onResult, loading, error } = useQuery(
          STORE_SUB_SUB_CATEGORIES,
          {
            siteId: siteId,
            childId: childId,
            first: 2048,
          }
        );
        onResult((queryResult) => {
          if (queryResult.data.storeSubSubCategories) {
            this.subSubCategories = queryResult.data.storeSubSubCategories.edges
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

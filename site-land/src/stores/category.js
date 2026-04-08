import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { STORE_CATEGORIES, STORE_CATEGORY_DETAILS } from "@/gql/category";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useCategoryStore = defineStore("category_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    categoryId: null,
    category: null,
    categories: [],
  }),
  getters: {},
  actions: {
    async setCategoryId(categoryId) {
      this.categoryId = categoryId;
    },
    async getCategory(id) {
      const { onResult, loading, error } = useQuery(STORE_CATEGORY_DETAILS, {
        id: id,
      });
      onResult((queryResult) => {
        this.category = queryResult.data.storeCategory;
      });
    },
    async getCategories(siteId, childId) {
      const { onResult, loading, error } = useQuery(STORE_CATEGORIES, {
        siteId: siteId,
        childId: childId,
        first: 2048,
      });
      onResult((queryResult) => {
        if (queryResult.data.storeCategories) {
          this.categories = queryResult.data.storeCategories.edges
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
});

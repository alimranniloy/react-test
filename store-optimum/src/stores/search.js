import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { STORE_PRODUCT_SEARCHS } from "@/gql/product";
import { useQuery, useMutation } from "@vue/apollo-composable";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useSearchStore = defineStore(
  "search_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      search: null,
      searchs: [],
    }),
    getters: {},
    actions: {
      async setSearch(search) {
        this.search = search;
      },
      async getSearchs(siteId, childId) {
        const { onResult, loading, error } = useQuery(STORE_PRODUCT_SEARCHS, {
          siteId: siteId,
          childId: childId,
          isActive: true,
          first: 2048,
        });
        onResult((queryResult) => {
          if (queryResult.data.storeProducts) {
            this.searchs = queryResult.data.storeProducts.edges.map(
              (v) => v.node
            );
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

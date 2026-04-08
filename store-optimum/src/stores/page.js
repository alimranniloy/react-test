import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { SITE_PAGES, SITE_PAGE_DETAILS } from "@/gql/page";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const usePageStore = defineStore(
  "page_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      pageId: null,
      page: null,
      pages: [],
    }),
    getters: {},
    actions: {
      async setPageId(pageId) {
        this.pageId = pageId;
      },
      async getPage(id) {
        const { onResult, loading, error } = useQuery(SITE_PAGE_DETAILS, {
          id: id,
        });
        onResult((queryResult) => {
          this.page = queryResult.data.storePage;
        });
      },
      async getPages(siteId, childId) {
        const { onResult, loading, error } = useQuery(SITE_PAGES, {
          siteId: siteId,
          first: 2048,
        });
        onResult((queryResult) => {
          if (queryResult.data.sitePages) {
            this.pages = queryResult.data.sitePages.edges
              .map((v) => v.node)
              .filter((v) => v.isActive === true)
              .sort((a, b) => a.title - b.title);
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

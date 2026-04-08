
import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from './notifications'
import {
  SITE_PAGES, SITE_PAGE_PREVIEW
} from "@/gql/page";
const ls = new SecureLS({
  encryptionNamespace: 'site-admin'
});
export const usePageStore = defineStore("page_" + import.meta.env.VITE_VERSION, {
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
      const { onResult, loading, error } = useQuery(SITE_PAGE_PREVIEW, {
        id: id,
      })
      onResult(queryResult => {
        this.page = queryResult.data.sitePage;
      });
    },
    async getPages(siteId) {
      const { onResult, loading, error } = useQuery(SITE_PAGES, {
        siteId: siteId,
        first: 2048
      })
      onResult(queryResult => {
        this.pages = queryResult.data.sitePages;
      });
    },
  },
  persist: {
    storage: {
      getItem: key => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: key => ls.remove(key)
    },
  },
});

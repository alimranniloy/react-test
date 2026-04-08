import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { SITE } from "@/gql/site";
const ls = new SecureLS({
  encryptionNamespace: "site-app",
});
export const useSiteStore = defineStore(
  "site_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      site: null,
      isMobile: false,
      loading: false,
      referCode: "6",
      sideBar: false,
      showEditor: false,
      ip: null,
    }),
    getters: {},
    actions: {
      async setLoading(status) {
        this.loading = status;
      },
      async setMobile(isMobile) {
        this.isMobile = isMobile;
      },
      async setSideBar(sideBar) {
        this.sideBar = sideBar;
      },
      async setReferCode(referCode) {
        this.referCode = referCode;
      },
      async getSite(domain) {
        const { onResult, loading, error } = useQuery(SITE, {
          domain: domain,
        });
        onResult((queryResult) => {
          this.site = queryResult.data.site;
        });
      },
      async setSite(data) {
        this.site = data;
      },
      async setIp(data) {
        this.ip = data;
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

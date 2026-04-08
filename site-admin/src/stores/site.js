import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { SITE, SITES, SELF_SITE_UPDATE, SELF_SITE } from "@/gql/site";
const ls = new SecureLS({
  encryptionNamespace: "site-admin",
});
export const useSiteStore = defineStore("site_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    siteId: null,
    site: null,
    sites: [],
    isMobile: false,
    loading: false,
    locale: "en",
    referCode: "6",
    sideBar: false,
    guide: [],
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
        this.guide = this.site.guide;
      });
    },
    async getSiteByUser(userId, siteType) {
      const { onResult, loading, error, onError } = useQuery(SELF_SITE, {
        userId: userId,
        siteType: siteType,
      });
      onResult((queryResult) => {
        this.site = queryResult.data.selfSite;
        this.guide = this.site.guide;
      });
      onError((error) => {
        this.router.push("/create/");
      });
    },
    async getSitesByUser(userId, siteType) {
      const { onResult, loading, error, onError } = useQuery(SITES, {
        createdById: userId,
        siteType: siteType,
      });
      onResult((queryResult) => {
        this.sites = queryResult.data.sites.edges.map((v) => v.node);
      });
    },
    async updateSite(userId, data) {
      const { mutate, loading, error } = useMutation(SELF_SITE_UPDATE, {
        variables: {
          userId: userId,
          siteId: data.value.id,
          address: data.value.address,
          title: data.value.title,
        },
      });
      try {
        const response = await mutate();
        if (response.data.selfSiteUpdate) {
          this.site = response.data.selfSiteUpdate;
          this.guide = this.site.guide;
          const notificationsStore = useNotificationsStore();
          notificationsStore.addNotification(
            {
              title: "Account info",
              subTitle: "Successfully updated new data.",
            },
            "success"
          );
        }
      } catch (error) {
        const notificationsStore = useNotificationsStore();
        notificationsStore.addNotification(
          { title: "Account info", subTitle: error.message },
          "error"
        );
      }
    },
    async setSite(data) {
      this.site = data;
      this.guide = this.site.guide;
    },
    async setLocale(locale) {
      this.locale = locale;
    },
    async setSiteId(id) {
      this.siteId = id;
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

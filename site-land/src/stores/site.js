import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { SITE, SELF_SITE_UPDATE, SELF_SITE } from "@/gql/site";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useSiteStore = defineStore("site_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    site: null,
    isMobile: false,
    deviceType: "",
    loading: false,
    locale: "en",
    siteKey: 1,
    referCode: "6",
    sideBar: false,
    showPopUp: true,
    isCommunity: true,
    isAppDownload: true,
  }),
  getters: {},
  actions: {
    async setLoading(status) {
      this.loading = status;
    },
    async setMobile(isMobile) {
      this.isMobile = isMobile;
    },
    async setDeviceType(deviceType) {
      this.deviceType = deviceType;
    },
    async setLocale(locale) {
      this.locale = locale;
    },
    async setSideBar(sideBar) {
      this.sideBar = sideBar;
    },
    async setReferCode(referCode) {
      this.referCode = referCode;
    },
    async setShowPopUp(showPopUp) {
      this.showPopUp = showPopUp;
    },
    async getSite(domain) {
      const { onResult, loading, error } = useQuery(SITE, {
        domain: domain,
      });
      onResult((queryResult) => {
        this.site = queryResult.data.site;
        localStorage.setItem("siteId", this.site.id);
      });
    },
    async getSiteByUser(userId, siteType) {
      const { onResult, loading, error } = useQuery(SELF_SITE, {
        userId: userId,
        siteType: siteType,
      });
      onResult((queryResult) => {
        this.site = queryResult.data.selfSite;
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
  },
  persist: {
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key),
    },
  },
});

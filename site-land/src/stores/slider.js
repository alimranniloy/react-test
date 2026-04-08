import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { SITE_SLIDERS, SITE_SLIDER_DETAILS } from "@/gql/slider";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useSliderStore = defineStore("slider_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    sliderId: null,
    slider: null,
    sliders: [],
  }),
  getters: {},
  actions: {
    async setSliderId(sliderId) {
      this.sliderId = sliderId;
    },
    async getSlider(id) {
      const { onResult, loading, error } = useQuery(SITE_SLIDER_DETAILS, {
        id: id,
      });
      onResult((queryResult) => {
        this.slider = queryResult.data.siteSlider;
      });
    },
    async getSliders(siteId, childId) {
      const { onResult, loading, error } = useQuery(SITE_SLIDERS, {
        siteId: siteId,
        childId: childId,
        first: 2048,
      });
      onResult((queryResult) => {
       if (queryResult.data.siteSliders) {
         this.sliders = queryResult.data.siteSliders.edges
           .map((v) => v.node)
           .filter((v) => v.isActive === true);
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

import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { STORE_SHOPS, STORE_SHOP_DETAILS } from "@/gql/shop";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useShopStore = defineStore("shop_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    shopId: null,
    shop: null,
    shops: [],
  }),
  getters: {},
  actions: {
    async setShopId(shopId) {
      this.shopId = shopId;
    },
    async getShop(id) {
      const { onResult, loading, error } = useQuery(STORE_SHOP_DETAILS, {
        id: id,
      });
      onResult((queryResult) => {
        this.shop = queryResult.data.storeShop;
      });
    },
    async getShops(siteId) {
      const { onResult, loading, error } = useQuery(STORE_SHOPS, {
        siteId: siteId,
        first: 2048,
      });
      onResult((queryResult) => {
        if (queryResult.data.storeShops) {
          this.shops = queryResult.data.storeShops.edges
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

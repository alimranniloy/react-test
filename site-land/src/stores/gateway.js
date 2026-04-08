import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { STORE_GATEWAYS } from "@/gql/gateway";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useGatewayStore = defineStore("gateway_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    gateways: [],
  }),
  getters: {},
  actions: {
    async getGateways(siteId) {
      const { onResult, loading, error } = useQuery(STORE_GATEWAYS, {
        siteId: siteId,
        isActive: true,
        first: 2048,
      });
      onResult((queryResult) => {
        if (queryResult.data.storeGateways) {
          this.gateways = queryResult.data.storeGateways.edges
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

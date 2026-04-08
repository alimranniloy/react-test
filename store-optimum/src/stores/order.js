import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { STORE_ORDERS, STORE_ORDER_DETAILS } from "@/gql/order";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useOrderStore = defineStore(
  "order_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      orderId: null,
      order: null,
    }),
    getters: {},
    actions: {
      async setOrderId(orderId) {
        this.orderId = orderId;
      },
      async getOrder(id) {
        const { onResult, loading, error } = useQuery(STORE_ORDER_DETAILS, {
          id: id,
        });
        onResult((queryResult) => {
          this.order = queryResult.data.storeOrder;
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

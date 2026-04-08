import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import {
  STORE_ORDER_PAYMENTS,
  STORE_ORDER_PAYMENT_DETAILS,
} from "@/gql/orderPayment";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useOrderPaymentStore = defineStore(
  "orderPayment_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      orderPaymentId: null,
      orderPayment: null,
      orderPayments: [],
    }),
    getters: {},
    actions: {
      async setOrderPaymentId(orderPaymentId) {
        this.orderPaymentId = orderPaymentId;
      },
      async getOrderPayment(id) {
        const { onResult, loading, error } = useQuery(
          STORE_ORDER_PAYMENT_DETAILS,
          {
            id: id,
          }
        );
        onResult((queryResult) => {
          this.orderPayment = queryResult.data.storeOrderPayment;
        });
      },
      async getOrderPayments(siteId) {
        const { onResult, loading, error } = useQuery(STORE_ORDER_PAYMENTS, {
          siteId: siteId,
          first: 2048,
        });
        onResult((queryResult) => {
          this.orderPayments = queryResult.data.storeOrderPayments;
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

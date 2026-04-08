import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import {
  STORE_CUSTOMERS,
  SELF_STORE_CUSTOMER,
  STORE_CUSTOMER_DETAILS,
} from "@/gql/customer";
import { cloneDeep } from "lodash";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useCustomerStore = defineStore(
  "customer_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      customerId: null,
      customer: null,
    }),
    getters: {},
    actions: {
      async setCustomerId(customerId) {
        this.customerId = customerId;
      },
      async getCustomerByUser(
        userId,
        siteId,
        isActive,
        isReseller,
        isWholesale,
        customerType
      ) {
        const { onResult, loading, error } = useQuery(SELF_STORE_CUSTOMER, {
          userId: userId,
          siteId: siteId,
          isActive: isActive,
          isReseller: isReseller,
          iswholesale: isWholesale,
          customerType: customerType,
        });
        onResult((queryResult) => {
          this.customer = cloneDeep(queryResult.data.selfStoreCustomer);
          this.customerId = queryResult.data.selfStoreCustomer.id;
        });
      },
      async getCustomer(id) {
        const { onResult, loading, error } = useQuery(STORE_CUSTOMER_DETAILS, {
          id: id,
        });
        onResult((queryResult) => {
          this.customer = queryResult.data.storeCustomer;
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

import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import {
  SITE_TRANSACTIONS,
  SITE_TRANSACTION_DETAILS,
} from "@/gql/siteTransaction";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useSiteTransactionStore = defineStore(
  "siteTransaction_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      siteTransactionId: null,
      siteTransaction: null,
      siteTransactions: [],
    }),
    getters: {},
    actions: {
      async setSiteTransactionId(siteTransactionId) {
        this.siteTransactionId = siteTransactionId;
      },
      async getSiteTransaction(id) {
        const { onResult, loading, error } = useQuery(
          SITE_TRANSACTION_DETAILS,
          {
            id: id,
          }
        );
        onResult((queryResult) => {
          this.siteTransaction = queryResult.data.storeSiteTransaction;
        });
      },
      async getSiteTransactions(siteId) {
        const { onResult, loading, error } = useQuery(SITE_TRANSACTIONS, {
          siteId: siteId,
          first: 2048,
        });
        onResult((queryResult) => {
          this.siteTransactions = queryResult.data.storeSiteTransactions;
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

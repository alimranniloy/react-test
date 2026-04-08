import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { STORE_VOUCHERS, STORE_VOUCHER_DETAILS } from "@/gql/voucher";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useVoucherStore = defineStore(
  "voucher_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      voucherId: null,
      voucher: null,
      vouchers: [],
    }),
    getters: {},
    actions: {
      async setVoucherId(voucherId) {
        this.voucherId = voucherId;
      },
      async getVoucher(id) {
        const { onResult, loading, error } = useQuery(STORE_VOUCHER_DETAILS, {
          id: id,
        });
        onResult((queryResult) => {
          this.voucher = queryResult.data.storeVoucher;
        });
      },
      async getVouchers(siteId) {
        const { onResult, loading, error } = useQuery(STORE_VOUCHERS, {
          siteId: siteId,
          first: 2048,
        });
        onResult((queryResult) => {
          if (queryResult.data.storeVouchers) {
            this.vouchers = queryResult.data.storeVouchers.edges
              .map((v) => v.node)
              .filter((v) => v.isActive === true && v.isPublic === true);
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
  }
);

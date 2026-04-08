import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { STORE_SUPPLIERS, STORE_SUPPLIER_DETAILS } from "@/gql/supplier";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useSupplierStore = defineStore(
  "supplier_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      supplierId: null,
      supplier: null,
      suppliers: [],
    }),
    getters: {},
    actions: {
      async setSupplierId(supplierId) {
        this.supplierId = supplierId;
      },
      async getSupplier(id) {
        const { onResult, loading, error } = useQuery(STORE_SUPPLIER_DETAILS, {
          id: id,
        });
        onResult((queryResult) => {
          this.supplier = queryResult.data.storeSupplier;
        });
      },
      async getSuppliers(siteId) {
        const { onResult, loading, error } = useQuery(STORE_SUPPLIERS, {
          siteId: siteId,
          first: 2048,
        });
        onResult((queryResult) => {
          if (queryResult.data.storeSuppliers) {
            this.suppliers = queryResult.data.storeSuppliers.edges
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
  }
);

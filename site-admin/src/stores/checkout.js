import { defineStore } from "pinia";

import SecureLS from "secure-ls";
const ls = new SecureLS({
  encryptionNamespace: "site-admin",
});
export const useCheckoutStore = defineStore(
  "checkout_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      step: 1,
      orderId: null,
      taxId: null
    }),
    actions: {
      setStep(data) {
        this.step = data;
      },
      setOrderId(orderId) {
        this.orderId = orderId;
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

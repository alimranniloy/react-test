import { defineStore } from "pinia";

import SecureLS from "secure-ls";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useCheckoutStore = defineStore("checkout_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    step: 2,
    orderId: null,
    referenceId: null,
    taxId: null,
  }),
  actions: {
    setStep(data) {
      this.step = data;
    },
    setOrderId(orderId) {
      this.orderId = orderId;
    },
    setReferenceId(referenceId) {
      this.referenceId = referenceId;
    },
    setTaxId(taxId) {
      this.taxId = taxId;
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

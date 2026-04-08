import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { STORE_PRODUCT_REVIEWS } from "@/gql/productReview";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useProductReviewStore = defineStore("productReview_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    productReviewId: null,
    productReviews: null,
  }),
  getters: {},
  actions: {
    async setProductReviewId(productReviewId) {
      this.productReviewId = productReviewId;
    },
    async getProductReviews(siteId) {
      const { onResult, loading, error } = useQuery(STORE_PRODUCT_REVIEWS, {
        siteId: siteId,
        first: 2048,
      });
      onResult((queryResult) => {
        if (queryResult.data.storeProductReviews) {
          this.productReviews = queryResult.data.storeProductReviews.edges
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

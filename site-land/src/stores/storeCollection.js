import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { STORE_COLLECTIONS, STORE_COLLECTION_DETAILS } from "@/gql/storeCollection";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useCollectionStore = defineStore("collection_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    collectionId: null,
    collection: null,
    collections: [],
  }),
  getters: {},
  actions: {
    async setCollectionId(collectionId) {
      this.collectionId = collectionId;
    },
    async getCollection(id) {
      const { onResult, loading, error } = useQuery(STORE_COLLECTION_DETAILS, {
        id: id,
      });
      onResult((queryResult) => {
        this.collection = queryResult.data.storeCollection;
      });
    },
    async getCollections(siteId, childId) {
      const { onResult, loading, error } = useQuery(STORE_COLLECTIONS, {
        siteId: siteId,
        childId: childId,
        first: 2048,
      });
      onResult((queryResult) => {
       if (queryResult.data.storeCollections) {
         this.collections = queryResult.data.storeCollections.edges
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

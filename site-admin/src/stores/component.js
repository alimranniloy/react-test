import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { SITE_COMPONENTS, SITE_COMPONENT_CATEGORIES } from "@/gql/site";
const ls = new SecureLS({
  encryptionNamespace: "site-admin",
});
export const useComponentStore = defineStore(
  "component_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      componentId: null,
      components: [],
      componentCategories: [],
    }),
    getters: {},
    actions: {
      async setComponentId(componentId) {
        this.componentId = componentId;
      },
      async getComponents() {
        const { onResult, loading, error } = useQuery(SITE_COMPONENTS, {
          isActive: true,
          first: 4096,
          after: null,
        });
        onResult((queryResult) => {
          if (queryResult.data.siteComponents) {
            this.components = queryResult.data.siteComponents.edges.map(
              (v) => v.node
            );
          }
        });
      },
      async getComponentCategories() {
        const { onResult, loading, error } = useQuery(
          SITE_COMPONENT_CATEGORIES,
          {
            isActive: true,
            first: 4096,
            after: null,
          }
        );
        onResult((queryResult) => {
          if (queryResult.data.siteComponentCategories) {
            this.componentCategories =
              queryResult.data.siteComponentCategories.edges.map((v) => v.node);
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

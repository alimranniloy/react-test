import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from './notifications'
import {
  USERS, USER_PREVIEW
} from "@/gql/user";
const ls = new SecureLS({
  encryptionNamespace: 'site-admin'
});
export const useUserStore = defineStore("user_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    userId: null,
    user: null,
  }),
  getters: {},
  actions: {
    async setUserId(userId) {
      this.userId = userId;
    },
    async getUser(id) {
      const { onResult, loading, error } = useQuery(USER_PREVIEW, {
        id: id,
      })
      onResult(queryResult => {
        this.user = queryResult.data.user;
      });
    },
  },
  persist: {
    storage: {
      getItem: key => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: key => ls.remove(key)
    },
  },
});

import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from './notifications'
import {
  USERS, USER_DETAILS
} from "@/gql/user";
const ls = new SecureLS({
  encryptionNamespace: 'khata-app'
});
export const useUserStore = defineStore("user_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    userId: null,
    user: null,
    users: [],
  }),
  getters: {},
  actions: {
    async setUserId(userId) {
      this.userId = userId;
    },
    async getUser(id) {
      const { onResult, loading, error } = useQuery(USER_DETAILS, {
        id: id,
      })
      onResult(queryResult => {
        this.user = queryResult.data.userUser;
      });
    },
    async getUsers() {
      const { onResult, loading, error } = useQuery(USERS, {
        first: 2048
      })
      onResult(queryResult => {
        this.users = queryResult.data.userUsers;
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

import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ME, LOGIN, USER_CHECK, SELF_LOGIN } from "@/gql/me";
import { onLogin, onLogout } from "@/vue-apollo";
import { useNotificationsStore } from "./notifications";
const ls = new SecureLS({
  encryptionNamespace: "store-admin",
});
export const useMeStore = defineStore("me_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    me: null,
    auth: false,
    token: null,
    userId: null,
    phone: null,
  }),
  getters: {},
  actions: {
    async setToken(token) {
      this.token = token;
    },
    async setAuth(auth) {
      this.auth = auth;
    },
    async getMe() {
      const { onResult, loading, error } = useQuery(ME);
      onResult((queryResult) => {
        this.me = queryResult.data.me;
      });
    },
    async loginCheck(id) {
      const { mutate, loading, error } = useMutation(SELF_LOGIN, {
        variables: {
          userId: id,
        },
      });
      try {
        const response = await mutate();
        if (!response.data.selfLogin) {
          this.logOut();
        }
      } catch (error) {
        const notificationsStore = useNotificationsStore();
        notificationsStore.addNotification(
          { title: "Account info", subTitle: error.message },
          "error"
        );
      }
    },
    async getLogin(id, password) {
      const { mutate, loading, error } = useMutation(LOGIN, {
        variables: {
          id: id.value,
          password: password.value,
        },
      });
      try {
        const response = await mutate();
        console.log(response.data.login);
        if (response.data.login) {
          this.token = response.data.login;
          onLogin(this.token);
          this.getMe();
          this.auth = true;
          this.router.replace(`/`);
        } else {
          const notificationsStore = useNotificationsStore();
          notificationsStore.addNotification(
            { title: "Account info", subTitle: "Invalid password!" },
            "error"
          );
        }
      } catch (error) {
        const notificationsStore = useNotificationsStore();
        notificationsStore.addNotification(
          { title: "Account info", subTitle: error.message },
          "error"
        );
      }
    },
    async getUser(email) {
      const { onResult, loading, error } = useQuery(USER_CHECK, {
        data: email,
      });
      onResult((queryResult) => {
        this.userId = queryResult.data.userCheck.id;
      });
    },
    async logOut() {
      onLogout();
      this.me = null;
      this.auth = null;
      this.token = null;
      this.userId = null;
      ls.removeAll();
      this.router.push(`/`);
    },
    async setPhone(data) {
      this.phone = data;
    },
    async tryLogin(token) {
      this.token = token;
      onLogin(this.token);
      this.getMe();
      this.auth = true;
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

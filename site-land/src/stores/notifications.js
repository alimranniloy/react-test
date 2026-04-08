import { defineStore } from "pinia";

import SecureLS from "secure-ls";
import { useMeStore } from "./me";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useNotificationsStore = defineStore("notifications_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    notifications: [],
  }),
  actions: {
    addNotification(message, type = "success") {
      if (message.subTitle.includes('Authentication')) {
        this.router.push(`/login/`);
        const meStore = useMeStore();
          meStore.auth = false;
      }
      const notification = {
        title: message.title,
        subTitle: message.subTitle,
        type,
      };
      this.notifications.push(notification);
      setTimeout(() => {
        this.removeNotification();
      }, 3000);
    },
    removeNotification() {
      this.notifications = [];
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

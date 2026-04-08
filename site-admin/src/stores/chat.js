import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from './notifications'
import {
  CHAT_THREADS, CHAT_THREAD_PREVIEW
} from "@/gql/chat";
const ls = new SecureLS({
  encryptionNamespace: 'site-admin'
});
export const useChatStore = defineStore("chat_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    chatId: null,
    chat: null,
    chats: [],
  }),
  getters: {},
  actions: {
    async setChatId(chatId) {
      this.chatId = chatId;
    },
    async getChat(id) {
      const { onResult, loading, error } = useQuery(CHAT_THREAD_PREVIEW, {
        id: id,
      })
      onResult(queryResult => {
        this.chat = queryResult.data.chatThread;
      });
    },
    async getChats(siteId) {
      const { onResult, loading, error } = useQuery(CHAT_THREADS, {
        siteId: siteId,
      })
      onResult(queryResult => {
        this.chats = queryResult.data.chatThreads;
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

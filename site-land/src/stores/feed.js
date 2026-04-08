import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { FEED_FEEDS, FEED_FEED_DETAILS } from "@/gql/feed";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useFeedStore = defineStore("feed_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    feedId: null,
    feed: null,
    feeds: [],
    isShowCreate: false,
    feedType: 1,
  }),
  getters: {},
  actions: {
    async setFeedId(feedId) {
      this.feedId = feedId;
    },
    async setFeed(feed) {
      this.feed = feed;
    },
    async getFeed(id) {
      const { onResult, loading, error } = useQuery(FEED_FEED_DETAILS, {
        id: id,
      });
      onResult((queryResult) => {
        this.feed = queryResult.data.feedFeed;
      });
    },
    async getFeeds() {
      const { onResult, loading, error } = useQuery(FEED_FEEDS, {
        first: 2048,
      });
      onResult((queryResult) => {
        this.feeds = queryResult.data.feedFeeds;
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
